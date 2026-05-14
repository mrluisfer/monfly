import { Component, type ErrorInfo, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  label?: string;
};

type State = {
  hasError: boolean;
};

export class InsightErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(
      `[InsightErrorBoundary] ${this.props.label ?? ""}`,
      error,
      info,
    );
  }

  render() {
    if (this.state.hasError) {
      return (
        <article className="bg-muted border-border/70 flex min-h-24 items-center justify-center rounded-2xl border p-4 sm:p-5">
          <p className="text-muted-foreground text-sm">
            {this.props.label
              ? `Could not load "${this.props.label}".`
              : "This section could not be loaded."}
          </p>
        </article>
      );
    }

    return this.props.children;
  }
}
