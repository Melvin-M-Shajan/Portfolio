"use client";

import {
  ChatCircleDots,
  PaperPlaneTilt,
  Sparkle,
  X,
} from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  type FormEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { petAssistant } from "@/content/assistant";

type PetMotion = "walk" | "idle" | "wave" | "think" | "answer";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const initialMessage: Message = {
  id: "mini-mel-greeting",
  role: "assistant",
  content: petAssistant.greeting,
};

const makeId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random()}`;

function formatMessage(content: string): ReactNode[] {
  return content.split(/(\*\*[^*\n]+\*\*)/g).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }

    return part;
  });
}

const motionLabels: Partial<Record<PetMotion, string>> = {
  wave: "Hi!",
  think: "Thinking…",
  answer: "Got it!",
};

function PetSprite({
  motionName,
  direction = 1,
  reducedMotion,
}: {
  motionName: PetMotion;
  direction?: 1 | -1;
  reducedMotion: boolean;
}) {
  return (
    <span
      className="pet-facing"
      style={{ transform: `scaleX(${direction})` }}
      aria-hidden="true"
    >
      <span
        className={`pet-sprite pet-motion-${motionName}`}
        data-reduced-motion={reducedMotion ? "true" : "false"}
      />
    </span>
  );
}

export function PortfolioPet() {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const walkerRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef(24);
  const directionRef = useRef<1 | -1>(1);
  const velocityRef = useRef(0);
  const turnPauseUntilRef = useRef(0);
  const hoveredRef = useRef(false);
  const petMotionRef = useRef<PetMotion>("walk");
  const motionTimerRef = useRef<number | null>(null);
  const motionSequenceRef = useRef(0);
  const openRef = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [petMotion, setPetMotion] = useState<PetMotion>("walk");
  const [showNudge, setShowNudge] = useState(false);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [loading, setLoading] = useState(false);
  hoveredRef.current = hovered;
  petMotionRef.current = petMotion;
  const displayedMotion =
    hovered && petMotion === "walk" ? "idle" : petMotion;
  const displayedLabel = motionLabels[displayedMotion];
  const chatStatus =
    displayedMotion === "think"
      ? "Thinking…"
      : displayedMotion === "answer"
        ? "Answer ready"
        : displayedMotion === "wave"
          ? "Saying hi"
          : "Ask about Melvin";

  const clearMotionTimer = () => {
    if (motionTimerRef.current !== null) {
      window.clearTimeout(motionTimerRef.current);
      motionTimerRef.current = null;
    }
  };

  const holdMotion = (motionName: PetMotion) => {
    motionSequenceRef.current += 1;
    clearMotionTimer();
    setPetMotion(motionName);
  };

  const playMotion = (
    motionName: PetMotion,
    duration: number,
    nextMotion: PetMotion,
  ) => {
    const sequence = motionSequenceRef.current + 1;
    motionSequenceRef.current = sequence;
    clearMotionTimer();
    setPetMotion(motionName);
    const holdDuration = prefersReducedMotion
      ? Math.min(duration, 280)
      : duration;
    motionTimerRef.current = window.setTimeout(() => {
      if (motionSequenceRef.current === sequence) {
        setPetMotion(nextMotion);
      }
    }, holdDuration);
  };

  const openChat = () => {
    if (openRef.current) {
      return;
    }
    openRef.current = true;
    setOpen(true);
    setShowNudge(false);
    playMotion("wave", 1_150, "idle");
  };

  const closeChat = () => {
    if (!openRef.current) {
      return;
    }
    openRef.current = false;
    setOpen(false);
    playMotion("wave", 760, "walk");
  };

  useEffect(() => {
    const nudgeTimer = window.setTimeout(() => setShowNudge(true), 1_600);
    const hideTimer = window.setTimeout(() => setShowNudge(false), 10_000);
    return () => {
      window.clearTimeout(nudgeTimer);
      window.clearTimeout(hideTimer);
    };
  }, []);

  useEffect(
    () => () => {
      motionSequenceRef.current += 1;
      clearMotionTimer();
    },
    [],
  );

  useEffect(() => {
    if (!open) {
      return;
    }
    setShowNudge(false);
    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 180);
    return () => window.clearTimeout(focusTimer);
  }, [open]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  }, [messages, loading, prefersReducedMotion]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeChat();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  useEffect(() => {
    const walker = walkerRef.current;
    if (!walker) {
      return;
    }

    let animationFrame = 0;
    let previous = performance.now();

    const min = 16;
    let max = min;

    const updateBounds = () => {
      const petWidth = walker.getBoundingClientRect().width || 100;
      max = Math.max(min, window.innerWidth - petWidth - 16);
      positionRef.current = Math.min(max, Math.max(16, positionRef.current));
      walker.style.setProperty("--pet-x", `${positionRef.current}px`);
    };

    const animate = (time: number) => {
      const elapsed = Math.min(40, time - previous);
      previous = time;

      const canWalk =
        petMotionRef.current === "walk" &&
        !hoveredRef.current &&
        !prefersReducedMotion;

      if (!prefersReducedMotion) {
        const targetVelocity =
          canWalk && time >= turnPauseUntilRef.current
            ? directionRef.current * 0.028
            : 0;
        const easing = Math.min(1, elapsed / 170);
        velocityRef.current +=
          (targetVelocity - velocityRef.current) * easing;
        positionRef.current += velocityRef.current * elapsed;

        if (positionRef.current >= max && directionRef.current === 1) {
          positionRef.current = max;
          velocityRef.current = 0;
          turnPauseUntilRef.current = time + 260;
          directionRef.current = -1;
          setDirection(-1);
        } else if (
          positionRef.current <= min &&
          directionRef.current === -1
        ) {
          positionRef.current = min;
          velocityRef.current = 0;
          turnPauseUntilRef.current = time + 260;
          directionRef.current = 1;
          setDirection(1);
        }

        walker.style.setProperty("--pet-x", `${positionRef.current}px`);
      }

      animationFrame = window.requestAnimationFrame(animate);
    };

    updateBounds();
    window.addEventListener("resize", updateBounds);
    animationFrame = window.requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", updateBounds);
      window.cancelAnimationFrame(animationFrame);
    };
  }, [prefersReducedMotion]);

  const submitQuestion = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedQuestion = question.trim();
    if (!trimmedQuestion || loading) {
      return;
    }

    const userMessage: Message = {
      id: makeId(),
      role: "user",
      content: trimmedQuestion,
    };
    const history = messages.slice(-6).map(({ role, content }) => ({ role, content }));

    setQuestion("");
    setMessages((current) => [...current, userMessage]);
    setLoading(true);
    holdMotion("think");
    const thinkingStartedAt = performance.now();

    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_PET_API_URL ?? "/api/ask-melvin",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: trimmedQuestion, history }),
        },
      );
      const payload = (await response.json().catch(() => null)) as
        | { answer?: string; error?: string }
        | null;

      if (!response.ok || !payload?.answer) {
        throw new Error(
          payload?.error ??
            "Mini Mel is still waking up. Please try again in a moment.",
        );
      }

      const minimumThinkingTime = prefersReducedMotion ? 180 : 720;
      const thinkingElapsed = performance.now() - thinkingStartedAt;
      if (thinkingElapsed < minimumThinkingTime) {
        await new Promise((resolve) =>
          window.setTimeout(resolve, minimumThinkingTime - thinkingElapsed),
        );
      }

      setMessages((current) => [
        ...current,
        { id: makeId(), role: "assistant", content: payload.answer as string },
      ]);
      playMotion(
        "answer",
        1_050,
        openRef.current ? "idle" : "walk",
      );
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          id: makeId(),
          role: "assistant",
          content:
            error instanceof Error
              ? error.message
              : "Mini Mel is temporarily offline. Please try again.",
        },
      ]);
      playMotion("wave", 760, openRef.current ? "idle" : "walk");
    } finally {
      setLoading(false);
    }
  };

  const askSuggestion = (suggestion: string) => {
    setQuestion(suggestion);
    window.setTimeout(() => inputRef.current?.focus(), 0);
  };

  return (
    <>
      <AnimatePresence>
        {open ? (
          <motion.aside
            id="mini-mel-chat"
            className="pet-chat"
            role="dialog"
            aria-modal="false"
            aria-label="Ask Mini Mel about Melvin"
            initial={{ opacity: 0, y: 18, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={
              prefersReducedMotion
                ? { duration: 0 }
                : { type: "spring", stiffness: 360, damping: 30, mass: 0.78 }
            }
          >
            <header className="pet-chat-header">
              <div className="pet-chat-title">
                <span className="pet-chat-avatar" aria-hidden="true">
                  <PetSprite
                    motionName={
                      displayedMotion === "walk" ? "idle" : displayedMotion
                    }
                    reducedMotion={prefersReducedMotion}
                  />
                </span>
                <span>
                  <strong>{petAssistant.name}</strong>
                  <small><i /> {chatStatus}</small>
                </span>
              </div>
              <button
                type="button"
                className="pet-chat-close"
                aria-label="Close Mini Mel"
                onClick={closeChat}
              >
                <X size={17} weight="bold" />
              </button>
            </header>

            <div className="pet-chat-messages" aria-live="polite">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  className={`pet-message pet-message-${message.role}`}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 7 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
                >
                  {formatMessage(message.content)}
                </motion.div>
              ))}
              {messages.length === 1 ? (
                <div className="pet-suggestions" aria-label="Suggested questions">
                  {petAssistant.suggestions.map((suggestion) => (
                    <button
                      type="button"
                      key={suggestion}
                      onClick={() => askSuggestion(suggestion)}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              ) : null}
              {loading ? (
                <div className="pet-message pet-message-assistant pet-thinking">
                  <span /><span /><span />
                  <span className="sr-only">Mini Mel is thinking</span>
                </div>
              ) : null}
              <div ref={messagesEndRef} />
            </div>

            <form className="pet-chat-form" onSubmit={submitQuestion}>
              <label className="sr-only" htmlFor="mini-mel-question">
                Ask a question about Melvin
              </label>
              <input
                ref={inputRef}
                id="mini-mel-question"
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                placeholder="Ask about projects, skills, or experience…"
                maxLength={500}
                autoComplete="off"
              />
              <button
                type="submit"
                aria-label="Send question"
                disabled={!question.trim() || loading}
              >
                <PaperPlaneTilt size={18} weight="fill" />
              </button>
            </form>
            <p className="pet-chat-note">Powered by Groq · Portfolio-grounded answers</p>
          </motion.aside>
        ) : null}
      </AnimatePresence>

      <div
        ref={walkerRef}
        className="portfolio-pet"
        data-motion={displayedMotion}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <AnimatePresence>
          {showNudge && !open ? (
            <motion.button
              type="button"
              className="pet-nudge"
              onClick={openChat}
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 5, scale: 0.97 }}
            >
              <Sparkle size={14} weight="fill" />
              Ask me about Melvin
            </motion.button>
          ) : null}
        </AnimatePresence>
        <AnimatePresence>
          {displayedLabel ? (
            <motion.span
              key={displayedLabel}
              className="pet-state-label"
              initial={prefersReducedMotion ? false : { opacity: 0, y: 6, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={prefersReducedMotion ? undefined : { opacity: 0, y: 4, scale: 0.96 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.18 }}
              aria-live="polite"
            >
              {displayedLabel}
            </motion.span>
          ) : null}
        </AnimatePresence>
        <button
          type="button"
          className="portfolio-pet-button"
          aria-label={open ? "Close Mini Mel" : "Ask Mini Mel about Melvin"}
          aria-expanded={open}
          aria-controls="mini-mel-chat"
          onFocus={() => setHovered(true)}
          onBlur={() => setHovered(false)}
          onClick={open ? closeChat : openChat}
        >
          <PetSprite
            motionName={displayedMotion}
            direction={direction}
            reducedMotion={prefersReducedMotion}
          />
          <span className="pet-action-badge" aria-hidden="true">
            <ChatCircleDots size={16} weight="fill" />
          </span>
        </button>
      </div>
    </>
  );
}
