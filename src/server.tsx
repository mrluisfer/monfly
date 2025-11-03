// src/server.ts
import handler, { type ServerEntry } from "@tanstack/react-start/server-entry";

export default {
  fetch(request) {
    return handler.fetch(request);
  },
} satisfies ServerEntry;
