import React, { ErrorInfo, ReactNode } from 'react';
import { ShieldAlert, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black text-green-500 font-mono flex flex-col items-center justify-center p-4 text-center">
          <ShieldAlert size={64} className="mb-6 text-red-500 animate-pulse" />
          <h1 className="text-4xl font-bold mb-4 text-red-500">SYSTEM CRITICAL FAILURE</h1>
          <p className="mb-8 text-gray-400 max-w-md">
            An unexpected error has occurred in the matrix. The system has been halted to prevent data corruption.
          </p>
          <div className="bg-zinc-900 p-4 rounded border border-red-900/50 mb-8 max-w-2xl overflow-auto text-left w-full">
            <code className="text-xs text-red-400">
              {this.state.error?.toString()}
            </code>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-500 text-black font-bold rounded transition-all"
          >
            <RefreshCw size={20} />
            REBOOT SYSTEM
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}