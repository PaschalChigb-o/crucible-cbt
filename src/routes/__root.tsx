import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { registerServiceWorker } from "../lib/pwa";

function NotFoundComponent() {
  return (
    <div
      className="flex min-h-screen items-center justify-center px-4"
      style={{ background: "#0D1F3C", color: "#F0F4F8" }}
    >
      <div className="max-w-md text-center">
        <h1 className="heading text-7xl" style={{ color: "#C9A84C" }}>
          404
        </h1>
        <h2 className="heading mt-4 text-xl">Page not found</h2>
        <p className="mt-2 text-sm" style={{ color: "#4A5568" }}>
          The page you're looking for doesn't exist.
        </p>
        <div className="mt-6">
          <Link
            to="/home"
            className="heading inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm"
            style={{ background: "#00C2A8", color: "#0D1F3C" }}
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div
      className="flex min-h-screen items-center justify-center px-4"
      style={{ background: "#0D1F3C", color: "#F0F4F8" }}
    >
      <div className="max-w-md text-center">
        <h1 className="heading text-xl">Something went wrong loading this screen.</h1>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="heading rounded-xl px-4 py-2 text-sm"
            style={{ background: "#00C2A8", color: "#0D1F3C" }}
          >
            Try again
          </button>
          <a
            href="/home"
            className="rounded-xl border px-4 py-2 text-sm"
            style={{ borderColor: "#4A5568", color: "#F0F4F8" }}
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content:
          "width=device-width, initial-scale=1, viewport-fit=cover, maximum-scale=1",
      },
      { name: "theme-color", content: "#0D1F3C" },
      { title: "CRUCIBLE — CBT Practice for Nigerian Universities" },
      {
        name: "description",
        content:
          "CRUCIBLE is a Computer-Based Test practice app for Nigerian university students across all faculties. Enter the crucible. Leave prepared.",
      },
      { name: "author", content: "CRUCIBLE" },
      { property: "og:title", content: "CRUCIBLE — Enter the crucible. Leave prepared." },
      {
        property: "og:description",
        content:
          "CBT examination practice for Nigerian university students — 9 courses, 1,350+ questions, offline ready.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/manifest.json" },
      { rel: "icon", href: "/assets/logo.png", type: "image/png" },
      { rel: "apple-touch-icon", href: "/assets/logo.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Outfit:wght@400;700&family=DM+Sans:wght@400;500;700&display=swap",
      },
      {
        rel: "stylesheet",
        href: "https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css",
        crossOrigin: "anonymous",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  useEffect(() => {
    registerServiceWorker();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
