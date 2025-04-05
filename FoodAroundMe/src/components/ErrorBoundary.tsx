import { Component, ErrorInfo, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Squircle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center p-5 bg-gray-100">
          <div className="max-w-xl p-8 text-center bg-white shadow-xl rounded-xl">
            <div className="mb-4 flex justify-center">
              <Squircle size={64} className="text-red-500" />
            </div>
            <h1 className="mb-4 text-2xl font-bold text-red-600">Something went wrong</h1>
            <p className="text-gray-600 mb-6">
              We're sorry, but we encountered an error while rendering this page.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={this.handleReload}
                className="px-4 py-2 text-white bg-indigo-600 rounded hover:bg-indigo-700 flex items-center justify-center gap-2"
              >
                <RefreshCw size={16} />
                Reload Page
              </button>
              <Link 
                to="/" 
                className="px-4 py-2 text-indigo-600 bg-indigo-100 rounded hover:bg-indigo-200"
              >
                Return to Home
              </Link>
            </div>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mt-6 p-4 text-left bg-gray-50 rounded overflow-auto text-xs">
                <p className="font-bold text-red-500">{this.state.error.toString()}</p>
                {this.state.errorInfo && (
                  <p className="mt-2 text-gray-600 whitespace-pre-wrap">
                    {this.state.errorInfo.componentStack}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
