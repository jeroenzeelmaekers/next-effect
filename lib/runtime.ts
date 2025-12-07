import { Layer, ManagedRuntime } from "effect";
import { ApiLive } from "./api/client";
import { TelemetryLive } from "./telemetry";

export const runtime = ManagedRuntime.make(
  Layer.mergeAll(ApiLive, TelemetryLive),
);
