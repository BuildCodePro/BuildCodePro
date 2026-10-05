import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";
import type { CalculationApiResult } from "@/types/analysis-results";

const CALCULATION_LABELS: Record<string, string> = {
  battery_capacity: "Battery capacity",
  nac_voltage_drop: "NAC voltage drop",
  conductor_sizing: "Conductor sizing",
  slc_loop_loading: "SLC loop loading",
  power_supply_loading: "Power supply loading",
  candela_coverage: "Candela coverage",
  audibility_requirement: "Audibility requirement",
};

interface CalculationsPanelProps {
  calculations: CalculationApiResult[] | null;
}

export function CalculationsPanel({ calculations }: CalculationsPanelProps) {
  if (!calculations || calculations.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <h3 className="text-section-title font-body">
            Engineering Calculations
          </h3>
          <p className="font-body text-sm text-stat-label">
            Calculated by fixed formulas, not by the AI. Each result shows its
            inputs and the code section it comes from.
          </p>
        </div>

        <div className="space-y-3">
          {calculations.map((calculation) => (
            <div
              key={calculation.calculation_kind}
              className="rounded-lg border border-slate-200 p-4"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="font-body font-medium">
                  {CALCULATION_LABELS[calculation.calculation_kind] ??
                    calculation.calculation_kind}
                </span>
                <span
                  className={cn(
                    "font-body text-lg tabular-nums",
                    calculation.passed ? "text-emerald-700" : "text-red-700",
                  )}
                >
                  {calculation.result_value} {calculation.result_unit}
                </span>
              </div>

              <p className="mt-1 font-mono text-xs break-words text-stat-label">
                {calculation.formula_expression}
              </p>

              <p className="mt-2 font-body text-xs text-stat-label">
                Source: {calculation.code_reference}
              </p>

              {calculation.assumptions.length > 0 ? (
                <ul className="mt-2 space-y-1">
                  {calculation.assumptions.map((assumption) => (
                    <li
                      key={assumption}
                      className="font-body text-xs text-stat-label"
                    >
                      • {assumption}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
