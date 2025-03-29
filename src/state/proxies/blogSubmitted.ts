import { proxy } from "valtio";
export const blogSubmitted: { status: boolean } = proxy({
  status: false,
});
