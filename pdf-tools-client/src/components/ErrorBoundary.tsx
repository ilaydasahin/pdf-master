'use client';

import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Link } from '@/navigation';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Log to error reporting service (e.g., Sentry) if configured
    if (typeof window !== 'undefined' && (window as any).errorLogger) {
      (window as any).errorLogger.log(error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
          <div className="max-w-md w-full">
            {/* Error Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              {/* Icon */}
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>

              {/* Title */}
              <h1 className="text-2xl font-bold text-slate-900 mb-3">
                Oops! Something went wrong
              </h1>

              {/* Description */}
              <p className="text-slate-600 mb-6">
                We encountered an unexpected error. Don't worry, your files are safe. Please try again.
              </p>

              {/* Error Details (only in development) */}              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mb-6 text-left bg-slate-50 rounded-lg p-4">
                  <summary className="cursor-pointer text-sm font-medium text-slate-700 hover:text-slate-900">
                    Error Details (Dev Only)
                  </summary>
                  <pre className="mt-2 text-xs text-red-600 overflow-auto max-h-40">
                    {this.state.error.message}
                    {'\n\n'}
                    {this.state.error.stack}
                  </pre>
                </details>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={this.handleReset}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
                >
                  <RefreshCw className="w-4 h-4" />
                  Try Again
                </button>
                
                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-colors"
                >
                  <Home className="w-4 h-4" />
                  Go Home
                </Link>
              </div>

              {/* Support Link */}
              <p className="mt-6 text-sm text-slate-500">
                Still having issues?{' '}
                <Link href="/contact" className="text-indigo-600 hover:text-indigo-700 font-medium">
                  Contact Support
                </Link>
              </p>
            </div>

            {/* Background Decoration */}
            <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
              <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
