import { handleMelvinAssistant } from "../src/server/melvin-assistant.js";

const handler = {
  fetch: handleMelvinAssistant,
};

export default handler;
