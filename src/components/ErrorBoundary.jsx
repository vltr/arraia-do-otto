import { Component } from "react";

// Minimal boundary so an optional/decorative subtree (e.g. the WebGL embers on
// a device without WebGL) can fail without taking the page down.
export default class ErrorBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    // swallow — this wraps purely decorative content
  }

  render() {
    if (this.state.failed) return this.props.fallback ?? null;
    return this.props.children;
  }
}
