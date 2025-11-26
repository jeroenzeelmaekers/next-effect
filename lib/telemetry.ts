import { NodeSdk } from "@effect/opentelemetry";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import {
  BatchSpanProcessor,
  ConsoleSpanExporter,
  SimpleSpanProcessor,
  SpanProcessor,
} from "@opentelemetry/sdk-trace-node";

export const TelemetryLive = NodeSdk.layer(() => {
  const spanProcessors: SpanProcessor[] = [
    new BatchSpanProcessor(
      new OTLPTraceExporter({ url: "http://localhost:4318/v1/traces" }),
    ),
  ];

  if (process.env.DEBUG_OTLP) {
    spanProcessors.push(new SimpleSpanProcessor(new ConsoleSpanExporter()));
  }

  return {
    resource: { serviceName: "nextjs-effect-app" },
    spanProcessor: spanProcessors,
  };
});
