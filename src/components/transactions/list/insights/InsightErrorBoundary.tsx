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
      info
    );
  }

  render() {
    if (this.state.hasError) {
      return (
        <article className="bg-muted rounded-2xl border border-border/70 p-4 sm:p-5 flex items-center justify-center min-h-24">
          <p className="text-sm text-muted-foreground">
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
