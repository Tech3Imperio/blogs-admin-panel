import { snapshot, useSnapshot as useSnapshotOrig } from "valtio";

const isSSR = typeof window === "undefined";

// Fix for Next.js SSR - fallback to snapshot() on the server
export const useSnapshot = isSSR
  ? <T extends object>(p: T) => snapshot(p)
  : useSnapshotOrig;
