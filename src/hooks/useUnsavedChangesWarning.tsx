// hooks/use-prevent-navigation.tsx
"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { blogSubmitted } from "@/state/proxies/blogSubmitted";
import { useSnapshot } from "@/lib/valtio";
export function useUnsavedChangesWarning({
  isDisabled,
}: {
  isDisabled: boolean;
}) {
  const blogSubmittedSnap = useSnapshot(blogSubmitted);
  const router = useRouter();
  const pathname = usePathname();
  const warningMessage =
    "You have unsaved changes. Are you sure you want to leave this page? All unsaved changes will be lost.";
  // Handle browser refresh and tab close with native browser dialog
  useEffect(() => {
    if (blogSubmittedSnap.status) return;
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isDisabled) {
        e.preventDefault();
        e.returnValue = warningMessage;
        return warningMessage;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDisabled, warningMessage, blogSubmittedSnap.status]);

  // Intercept link clicks for internal navigation
  useEffect(() => {
    if (blogSubmittedSnap.status) return;
    const handleClick = (e: MouseEvent) => {
      if (isDisabled) return; // Allow navigation if disabled (no unsaved changes)

      const target = e.target as HTMLElement;
      const link = target.closest("a");

      if (!link) return;

      // Check if this is an internal navigation
      const href = link.getAttribute("href");
      if (
        !href ||
        href.startsWith("http") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:")
      )
        return;

      // Check if this is navigation to one of our protected routes
      if (
        href.startsWith("/dashboard/new-blog") ||
        href.startsWith("/dashboard/all-blogs/") ||
        href.startsWith("/dashboard/drafts/")
      ) {
        e.preventDefault();

        if (window.confirm(warningMessage)) {
          router.push(href);
        }
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [isDisabled, router, warningMessage, blogSubmittedSnap.status]);

  // Handle URL bar changes and browser back/forward
  useEffect(() => {
    const handlePopState = () => {
      if (blogSubmittedSnap.status) return;
      if (!isDisabled) {
        // Prevent the navigation temporarily
        history.pushState(null, "", pathname);

        if (window.confirm(warningMessage)) {
          // User confirmed, allow navigation
          window.removeEventListener("popstate", handlePopState);
          history.back();
        }
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [isDisabled, pathname, warningMessage, blogSubmittedSnap.status]);

  useEffect(() => {
    if (blogSubmittedSnap.status) return;
    const originalPush = router.push;
    const originalReplace = router.replace;

    router.push = (href: string) => {
      if (isDisabled || window.confirm(warningMessage)) {
        return originalPush(href);
      }
      return Promise.resolve(false);
    };

    router.replace = (href: string) => {
      if (isDisabled || window.confirm(warningMessage)) {
        return originalReplace(href);
      }
      return Promise.resolve(false);
    };

    return () => {
      router.push = originalPush;
      router.replace = originalReplace;
    };
  }, [isDisabled, pathname, router, warningMessage, blogSubmittedSnap.status]);

  return {};
}
