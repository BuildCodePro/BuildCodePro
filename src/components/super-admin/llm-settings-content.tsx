"use client";

import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, RefreshCcw, Save, Settings2 } from "lucide-react";
import { toast } from "sonner";

import { SuperAdminModuleHeader } from "@/components/super-admin/super-admin-module-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import {
  useGetLlmSettingsQuery,
  useSyncLlmModelsMutation,
  useUpdateLlmSettingsMutation,
  type LlmProviderEntry,
} from "@/services/llmSettingsService";
import { Skeleton } from "@/components/ui/skeleton";

export function LlmSettingsContent() {
  const { data, isLoading, isError, refetch } = useGetLlmSettingsQuery();
  const syncMutation = useSyncLlmModelsMutation();
  const updateMutation = useUpdateLlmSettingsMutation();

  const [providerOrder, setProviderOrder] = useState<LlmProviderEntry[]>([]);

  // Initialize local state when data loads
  useEffect(() => {
    if (data?.providers) {
      setProviderOrder(data.providers);
    }
  }, [data]);

  const handleSync = async () => {
    try {
      const result = await syncMutation.mutateAsync();
      let hasError = false;
      for (const res of result.results) {
        if (res.error) {
          toast.error(`Sync failed for ${res.provider}: ${res.error}`);
          hasError = true;
        }
      }

      if (!hasError) {
        toast.success("Models synced successfully across all providers");
      }
      refetch();
    } catch (error) {
      toast.error("Failed to sync models");
    }
  };

  const handleSave = async () => {
    try {
      await updateMutation.mutateAsync({
        providers: providerOrder,
        temperature: data?.temperature,
        max_output_tokens: data?.max_output_tokens,
      });
      toast.success("LLM settings saved successfully");
    } catch (error) {
      toast.error("Failed to save LLM settings");
    }
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newOrder = [...providerOrder];
    const temp = newOrder[index - 1];
    newOrder[index - 1] = newOrder[index];
    newOrder[index] = temp;
    setProviderOrder(newOrder);
  };

  const moveDown = (index: number) => {
    if (index === providerOrder.length - 1) return;
    const newOrder = [...providerOrder];
    const temp = newOrder[index + 1];
    newOrder[index + 1] = newOrder[index];
    newOrder[index] = temp;
    setProviderOrder(newOrder);
  };

  const updateModel = (
    index: number,
    value: string
  ) => {
    const newOrder = [...providerOrder];
    newOrder[index] = {
      ...newOrder[index],
      model: value === "none" ? "" : value,
    };
    setProviderOrder(newOrder);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <SuperAdminModuleHeader
          title="LLM Settings"
          description="Manage AI provider priority and model selection."

        />
        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="mt-4 h-20 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="space-y-6">
        <SuperAdminModuleHeader
          title="LLM Settings"
          description="Manage AI provider priority and model selection."

        />
        <Card>
          <CardContent className="p-6 text-center text-red-500">
            LLM settings not found.
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SuperAdminModuleHeader
        title="LLM Settings"
        description="Manage AI provider priority and model selection. The system will attempt to use the highest priority provider first."

        actions={
          <div className="flex gap-3">
            {/* <Button
              variant="outline"
              onClick={handleSync}
              size="sm"
              disabled={syncMutation.isPending}
            >
              <RefreshCcw
                className={`mr-2 size-4 ${syncMutation.isPending ? "animate-spin" : ""
                  }`}
              />
              Sync Models
            </Button> */}
            <Button
              onClick={handleSave}
              disabled={updateMutation.isPending}
              size="sm"
              className="bg-primary hover:bg-primary/90"
            >
              <Save className="mr-2 size-4" />
              Save Settings
            </Button>
          </div>
        }
      />

      <Card className="p-6">
        <CardHeader>
          <CardTitle className="text-lg">Provider Order & Models</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="flex flex-col">
            {providerOrder.map((provider, index) => {
              const availableModels = data.available_models
                .filter((m) => m.provider === provider.provider)
                .map((m) => ({ label: m.label, value: m.model }));

              const primaryOptions = [...availableModels];

              return (
                <div
                  key={provider.provider}
                  className="flex items-center justify-between border-b border-border bg-white p-4 last:border-0 hover:bg-slate-50"
                >
                  {/* Left: Reorder & Name */}
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => moveUp(index)}
                        disabled={index === 0}
                        className="rounded p-1 text-stat-label hover:bg-slate-200 hover:text-foreground disabled:opacity-30"
                      >
                        <ArrowUp className="size-4" />
                      </button>
                      <button
                        onClick={() => moveDown(index)}
                        disabled={index === providerOrder.length - 1}
                        className="rounded p-1 text-stat-label hover:bg-slate-200 hover:text-foreground disabled:opacity-30"
                      >
                        <ArrowDown className="size-4" />
                      </button>
                    </div>
                    <div>
                      <h4 className="font-heading text-base font-semibold text-foreground capitalize">
                        {provider.provider}
                      </h4>
                      <p className="font-body text-xs text-stat-label">
                        Priority {index + 1}
                      </p>
                    </div>
                  </div>

                  {/* Right: Selectors */}
                  <div className="flex items-center gap-6">
                    <div className="w-64">
                      <label className="mb-1 block font-body text-xs font-medium text-stat-label">
                        Model
                      </label>
                      <Select
                        value={provider.model}
                        onChange={(val) =>
                          updateModel(index, val)
                        }
                        options={primaryOptions}
                        placeholder="Select model"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
