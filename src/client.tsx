/// <reference types="vinxi/types/client" />
import { StrictMode } from "react";
import { StartClient } from "@tanstack/react-start/client";
import { hydrateRoot } from "react-dom/client";

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .then((registration) => {
        // When a new SW is found, tell it to skip waiting and take control
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          if (!newWorker) return;

          newWorker.addEventListener("statechange", () => {
            if (
              newWorker.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              // New version available — activate immediately then reload
              newWorker.postMessage({ type: "SKIP_WAITING" });
            }
          });
        });
      })
      .catch(() => {
        // SW registration failed silently — app still works without it
      });

    // Reload once the new SW has taken control so the page uses fresh assets
    let refreshing = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (!refreshing) {
        refreshing = true;
        window.location.reload();
      }
    });
  });
}

hydrateRoot(
  document,
  <StrictMode>
    <StartClient />
  </StrictMode>
);
