"use client";
import { Component, ReactNode } from "react";

interface Props { children: ReactNode; }
interface State { hasError: boolean; error: Error | null; }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: "100vh",
          background: "#0a0a0e",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 16,
          fontFamily: "'DM Sans', sans-serif",
          color: "#fff",
          padding: 24,
          textAlign: "center",
        }}>
          <h2 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 24,
            fontWeight: 800,
            color: "#EF4444",
          }}>
            Something went wrong
          </h2>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, maxWidth: 400 }}>
            Reload the page to continue.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: "12px 24px",
              background: "linear-gradient(135deg, #4a7cf7, #6b9bff)",
              border: "none",
              borderRadius: 10,
              color: "#fff",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
