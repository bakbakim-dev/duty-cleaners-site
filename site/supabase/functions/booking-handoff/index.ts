import { createHandler } from "./handler.ts";

Deno.serve(createHandler(() => Deno.env.get("BOOKING_HANDOFF_SECRET") ?? ""));
