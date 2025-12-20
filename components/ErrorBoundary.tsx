
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
// Explicitly using React.Component to ensure the class correctly inherits properties from the base class in TypeScript
export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    // Properly initializing state within the constructor as an inherited property from React.Component
    this.state = {
      hasError: false
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    // Checking the current error state before rendering children
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
                // Calling the inherited setState method to clear the error state and attempt recovery
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

    // Returning the children provided in props correctly from the React.Component instance
    return this.props.children;
  }
}
