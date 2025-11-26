import { Layer } from "effect";
import { ApiLive } from "./api/client";
import { TelemetryLive } from "./telemetry";
import { Atom } from "@effect-atom/atom-react";

const MainLive = ApiLive.pipe(Layer.provideMerge(TelemetryLive));

export const runtimeAtom = Atom.runtime(MainLive);
