import { useEffect, useState } from "react";

export type AsyncState<T> =
  | { status: "loading" }
  | { status: "error"; error: Error }
  | { status: "success"; data: T };

export function useAsync<T>(load: () => Promise<T>, dependencies: readonly unknown[]): AsyncState<T> {
  const [state, setState] = useState<AsyncState<T>>({ status: "loading" });

  useEffect(() => {
    let active = true;
    setState({ status: "loading" });
    load().then(
      (data) => {
        if (active) setState({ status: "success", data });
      },
      (reason: unknown) => {
        if (active) setState({ status: "error", error: reason instanceof Error ? reason : new Error(String(reason)) });
      },
    );
    return () => {
      active = false;
    };
  }, dependencies);

  return state;
}
