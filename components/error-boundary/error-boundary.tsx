import React from 'react';

type Props = {}
type State = {
  hasError: boolean
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: {}) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.log('Error cached!', error.message)
  }

  render() {
    if (this.state.hasError) {
      return 'Oops!';
    }

    return this.props.children;
  }
}

export default ErrorBoundary
