"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

// Resolved in the browser so the prerendered shell never bakes in a stale build-time year
export default function CurrentYear() {
  const year = useSyncExternalStore(
    subscribe,
    () => new Date().getFullYear(),
    () => null,
  );
  return <span>{year}</span>;
}
