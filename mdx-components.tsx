import type { MDXComponents } from "mdx/types";

const components: MDXComponents = {
  h2: (props) => <h2 className="mt-14 text-3xl font-semibold tracking-tight" {...props} />,
  h3: (props) => <h3 className="mt-10 text-xl font-semibold" {...props} />,
  p: (props) => <p className="mt-5 text-lg leading-8 text-[var(--muted)]" {...props} />,
  ul: (props) => <ul className="mt-5 list-disc space-y-3 pl-6 text-[var(--muted)]" {...props} />,
  strong: (props) => <strong className="font-semibold text-[var(--foreground)]" {...props} />,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
