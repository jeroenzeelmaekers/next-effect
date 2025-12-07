import { NodeSdk } from "@effect/opentelemetry";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { HttpInstrumentation } from "@opentelemetry/instrumentation-http";
import {
  BatchSpanProcessor,
  ConsoleSpanExporter,
  SimpleSpanProcessor,
  SpanProcessor,
} from "@opentelemetry/sdk-trace-node";
import { Config, Effect } from "effect";

export const TelemetryLive = NodeSdk.layer(
  Effect.gen(function* () {
    const OTLPUrl = yield* Config.string("OTLP_EXPORTER_URL");

    const spanProcessors: SpanProcessor[] = [
      new BatchSpanProcessor(new OTLPTraceExporter({ url: OTLPUrl })),
    ];

    if (process.env.DEBUG_OTLP === "true") {
      spanProcessors.push(new SimpleSpanProcessor(new ConsoleSpanExporter()));
    }

    return {
      resource: { serviceName: "civilian-portal" },
      spanProcessor: spanProcessors,
      instrumentations: [new HttpInstrumentation()],
    };
  }),
);
