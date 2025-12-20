
import React, { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * ErrorBoundary component to catch rendering errors and show a fallback UI.
 */
export class ErrorBoundary extends React.Component<Props, State> {
  // Fix: Explicitly initializing state as a class property for better TypeScript recognition
  public state: State = {
    hasError: false
  };

  constructor(props: Props) {
    super(props);
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    // Fix: Properly accessing state and methods inherited from React.Component
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F8FAFB] flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white rounded-[3rem] shadow-2xl p-10 text-center space-y-8 animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-[2rem] flex items-center justify-center mx-auto shadow-sm">
              <AlertTriangle size={40} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-gray-900 mb-3">Something snapped.</h1>
              <p className="text-gray-500 font-medium leading-relaxed">
                We hit an unexpected error while rendering this part of Sellit. Don't worry, your data is safe.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => window.location.reload()}
                className="w-full bg-sellit text-white py-4 rounded-2xl font-black shadow-lg shadow-sellit/20 flex items-center justify-center gap-3 hover:bg-sellit-dark transition-all"
              >
                <RefreshCw size={20} />
                Refresh Application
              </button>
              <button 
                // Fix: Calling setState on the ErrorBoundary instance correctly
                onClick={() => this.setState({ hasError: false })}
                className="w-full text-xs font-black text-gray-400 uppercase tracking-widest hover:text-gray-900 transition-colors"
              >
                Try to recover
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Fix: Correctly returning children from props in a React class component
    return this.props.children;
  }
}
