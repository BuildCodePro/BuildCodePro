import { Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";
import type { CalculationApiResult } from "@/types/analysis-results";

const FEATURED_KINDS = [
  "battery_capacity",
  "nac_voltage_drop",
  "slc_loop_loading",
] as const;

const CARD_COPY: Record<string, { title: string; fallbackSubtext: string }> = {
  battery_capacity: {
    title: "Battery capacity",
    fallbackSubtext: "NFPA 72 secondary power",
  },
  nac_voltage_drop: {
    title: "NAC voltage drop",
    fallbackSubtext: "Max drop allowed on the circuit",
  },
  slc_loop_loading: {
    title: "SLC loading",
    fallbackSubtext: "Devices on the signaling line",
  },
};

interface EngineCalculationCardsProps {
  calculations: CalculationApiResult[] | null | undefined;
  isComplete: boolean;
}

export function EngineCalculationCards({
  calculations,
  isComplete,
}: EngineCalculationCardsProps) {
  const featured = FEATURED_KINDS.map((kind) =>
    (calculations ?? []).find((item) => item.calculation_kind === kind),
  );

  return (
    <Card>
      <CardContent className="space-y-4 py-6">
        <div className="space-y-1">
          <h3 className="font-heading text-lg font-semibold text-foreground">
            {isComplete ? "Engine complete" : "Engine waiting on extraction"}
          </h3>
          <p className="font-body text-sm text-stat-label">
            Deterministic formulas calculate. The language model does not invent
            these numbers.
          </p>
        </div>
        <div className="space-y-3">
          {FEATURED_KINDS.map((kind, index) => {
            const calculation = featured[index];
            const copy = CARD_COPY[kind];
            return (
              <div
                key={kind}
                className="flex items-center justify-between gap-3 rounded-[12px] border border-border px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="font-body text-sm font-medium text-foreground">
                    {copy.title}
                  </p>
                  <p className="font-body text-xs text-stat-label">
                    {kind === "nac_voltage_drop" && calculation?.inputs?.circuit_length_feet
                      ? `${calculation.inputs.circuit_length_feet} ft · ${
                          calculation.inputs.circuit_length_source === "placement_pathway"
                            ? "from placed devices"
                            : "building-size estimate"
                        }`
                      : (calculation?.code_reference ?? copy.fallbackSubtext)}
                  </p>
                </div>
                {calculation ? (
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="font-heading text-xl font-bold tabular-nums text-primary">
                      {calculation.result_value} {calculation.result_unit}
                    </span>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 font-body text-[10px] font-semibold uppercase",
                        calculation.passed
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-red-50 text-red-700",
                      )}
                    >
                      {calculation.passed ? "Pass" : "Fail"}
                    </span>
                  </div>
                ) : (
                  <span className="font-body text-xs text-stat-label">
                    {isComplete ? "Not returned" : "Pending"}
                  </span>
                )}
              </div>
            );
          })}
        </div>
        <p className="font-body text-xs text-stat-label">
          {isComplete
            ? "Voltage drop uses the longest NAC path on the drawing when devices are placed."
            : "engine calculates"}
        </p>
        {isComplete ? (
          <p className="inline-flex items-center gap-1.5 font-body text-xs text-success">
            <Check className="size-3.5" aria-hidden="true" />
            Prepared for qualified review
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
