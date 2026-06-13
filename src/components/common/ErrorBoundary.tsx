import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { AlertTriangle, RefreshCw } from "lucide-react";
import React from "react";

type Props = {
  children: React.ReactNode;
};

type State = {
  hasError: boolean;
  error: Error | null;
};

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Unhandled UI error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
    });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="mx-auto flex min-h-screen max-w-2xl items-center px-4 py-12">
          <Card className="w-full p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-300">
                <AlertTriangle className="h-6 w-6" />
              </div>

              <div className="flex-1">
                <h1 className="text-2xl font-semibold text-white">
                  Something went wrong
                </h1>
                <p className="mt-2 text-sm text-slate-400">
                  The interface crashed while rendering. Your backend state is
                  not affected.
                </p>

                {this.state.error ? (
                  <pre className="mt-4 overflow-auto rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs text-slate-300">
                    {this.state.error.message}
                  </pre>
                ) : null}

                <div className="mt-5">
                  <Button onClick={this.handleReset}>
                    <RefreshCw className="h-4 w-4" />
                    Reload app
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
