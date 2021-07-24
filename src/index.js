import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { RecoilRoot } from "recoil";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {}

  render() {
    if (this.state.hasError) {
      // 你可以自定义降级后的 UI 并渲染
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

ReactDOM.render(
  <RecoilRoot>
    <ErrorBoundary>
      <Suspense fallback={<div>loading...</div>}>
        <React.StrictMode>
          <h1>xxxxxx</h1>
          <App />
        </React.StrictMode>
      </Suspense>
    </ErrorBoundary>
  </RecoilRoot>,

  document.getElementById("root")
);
