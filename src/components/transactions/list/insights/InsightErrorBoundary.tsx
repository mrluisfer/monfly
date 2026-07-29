import { Component, type ErrorInfo, type ReactNode } from "react";

import { Card } from "~/components/ui/card";

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
        <Card className="flex min-h-24 items-center justify-center">
          <p className="text-muted-foreground text-sm">
            {this.props.label
              ? `Could not load "${this.props.label}".`
              : "This section could not be loaded."}
          </p>
        </Card>
      );
    }

    return this.props.children;
  }
}
