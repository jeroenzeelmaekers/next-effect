import { Layer, ManagedRuntime } from "effect";
import { ApiLive } from "./api/client";
import { TelemetryLive } from "./telemetry";

const MainLive = ApiLive.pipe(Layer.provideMerge(TelemetryLive));

export const runtime = ManagedRuntime.make(MainLive);
