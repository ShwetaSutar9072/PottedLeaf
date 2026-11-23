import { Component } from "react";

// Shows the error on screen instead of a blank page.
export default class ErrorBoundary extends Component {
  state = { error: null };
  static getDerivedStateFromError(error) { return { error }; }
  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div style={{ padding: 24, fontFamily: "Arial, sans-serif" }}>
        <h2 style={{ color: "#b3261e" }}>Something went wrong</h2>
        <p>Send this message to whoever is fixing the app:</p>
        <pre style={{ background: "#fff", padding: 12, whiteSpace: "pre-wrap" }}>
          {String(this.state.error.stack || this.state.error)}
        </pre>
        <button onClick={() => { localStorage.clear(); location.href = "/"; }}>Clear saved data and reload</button>
      </div>
    );
  }
}
