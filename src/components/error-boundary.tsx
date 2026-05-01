import React from 'react';

type Props = {
  children: React.ReactNode;
};

type State = {
  error?: Error;
};

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = {};

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error) {
    console.error('Frontend crashed:', error);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen bg-gray-100 p-8 text-gray-900">
          <div className="max-w-2xl rounded-md border border-red-200 bg-white p-6 shadow-sm">
            <h1 className="text-2xl font-bold text-red-700">Frontend crashed</h1>
            <p className="mt-3 text-sm text-gray-700">
              {this.state.error.message}
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
