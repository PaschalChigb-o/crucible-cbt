// Register the service worker only on published production origins.
// Never in Lovable preview/dev/iframe — service workers can pin stale HTML.
export function registerServiceWorker() {
  if (typeof window === "undefined") return;
  if (!("serviceWorker" in navigator)) return;
  try {
    if (window.top !== window.self) return; // iframe (preview)
  } catch {
    return;
  }
  const host = window.location.hostname;
  const blocked =
    host === "localhost" ||
    host.startsWith("id-preview--") ||
    host.startsWith("preview--") ||
    host.endsWith(".lovableproject.com") ||
    host.endsWith(".lovableproject-dev.com") ||
    host.endsWith(".beta.lovable.dev") ||
    host === "beta.lovable.dev" ||
    host === "lovableproject.com";
  if (blocked) {
    // Ensure no stale worker is left registered in preview
    navigator.serviceWorker
      .getRegistrations?.()
      .then((regs) =>
        regs.forEach((r) => {
          if (r.active?.scriptURL?.endsWith("/sw.js")) r.unregister();
        }),
      )
      .catch(() => {});
    return;
  }
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  });
}
