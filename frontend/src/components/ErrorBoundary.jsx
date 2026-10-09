import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.hash = '/';
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 font-sans">
          <div className="max-w-lg w-full bg-white rounded-3xl shadow-xl border border-red-100 p-10 text-center">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle size={36} className="text-red-500" />
            </div>
            <h1 className="text-2xl font-black text-gray-900 mb-2">Something went wrong</h1>
            <p className="text-gray-500 font-medium mb-6">
              The application encountered an unexpected error. This is a demo system — try refreshing.
            </p>

            {this.state.error && (
              <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-left mb-6">
                <p className="text-xs font-mono text-red-700 font-bold break-all">
                  {this.state.error.toString()}
                </p>
                {this.state.errorInfo && (
                  <details className="mt-3">
                    <summary className="text-xs text-red-500 font-bold cursor-pointer">Stack trace</summary>
                    <pre className="text-xs text-red-400 mt-2 overflow-auto max-h-40 whitespace-pre-wrap">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>
            )}

            <button
              onClick={this.handleReset}
              className="flex items-center gap-2 mx-auto px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-black rounded-xl shadow-lg hover:-translate-y-0.5 transition-all"
            >
              <RefreshCw size={18} />
              Reset & Go to Login
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
