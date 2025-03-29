import { proxy } from "valtio";
export const activeSection: { name: string; index: number } = proxy({
  index: -1,
  name: "Metadata",
});
