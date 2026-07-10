import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ask } from "@tauri-apps/plugin-dialog";
import type { ModelCardStatus } from "@/components/onboarding";
import { ModelCard } from "@/components/onboarding";
import { useModelStore } from "@/stores/modelStore";
import { LANGUAGES } from "@/lib/constants/languages.ts";
import type { ModelInfo } from "@/bindings";
import { ModelSettingsCard } from "../general/ModelSettingsCard";
import { SettingsPage } from "../shared/SettingsPage";
import {
  Center,
  Collapsible,
  EmptyState,
  HStack,
  Selector,
  Spinner,
  Text,
  VStack,
} from "@astryxdesign/core";

export const TranscriptionSettings: React.FC = () => {
  const { t } = useTranslation();
  const [switchingModelId, setSwitchingModelId] = useState<string | null>(null);
  const [languageFilter, setLanguageFilter] = useState("all");
  const {
    models,
    currentModel,
    downloadingModels,
    downloadProgress,
    downloadStats,
    verifyingModels,
    extractingModels,
    loading,
    downloadModel,
    cancelDownload,
    selectModel,
    deleteModel,
  } = useModelStore();

  const languageFilterOptions = useMemo(
    () => [
      { value: "all", label: t("settings.models.filters.allLanguages") },
      ...LANGUAGES.filter((lang) => lang.value !== "auto").map((lang) => ({
        value: lang.value,
        label: lang.label,
      })),
    ],
    [t],
  );

  const getModelStatus = (modelId: string): ModelCardStatus => {
    if (modelId in extractingModels) return "extracting";
    if (modelId in verifyingModels) return "verifying";
    if (modelId in downloadingModels) return "downloading";
    if (switchingModelId === modelId) return "switching";
    if (modelId === currentModel) return "active";
    const model = models.find((m: ModelInfo) => m.id === modelId);
    if (model?.is_downloaded) return "available";
    return "downloadable";
  };

  const getDownloadProgress = (modelId: string) =>
    downloadProgress[modelId]?.percentage;

  const getDownloadSpeed = (modelId: string) => downloadStats[modelId]?.speed;

  const handleModelSelect = async (modelId: string) => {
    setSwitchingModelId(modelId);
    try {
      await selectModel(modelId);
    } finally {
      setSwitchingModelId(null);
    }
  };

  const handleModelDelete = async (modelId: string) => {
    const model = models.find((m: ModelInfo) => m.id === modelId);
    const modelName = model?.name || modelId;
    const isActive = modelId === currentModel;
    const confirmed = await ask(
      isActive
        ? t("settings.models.deleteActiveConfirm", { modelName })
        : t("settings.models.deleteConfirm", { modelName }),
      { title: t("settings.models.deleteTitle"), kind: "warning" },
    );
    if (confirmed) {
      try {
        await deleteModel(modelId);
      } catch (err) {
        console.error(`Failed to delete model ${modelId}:`, err);
      }
    }
  };

  const handleModelCancel = async (modelId: string) => {
    try {
      await cancelDownload(modelId);
    } catch (err) {
      console.error(`Failed to cancel download for ${modelId}:`, err);
    }
  };

  const filteredModels = useMemo(() => {
    return models.filter((model: ModelInfo) => {
      if (languageFilter !== "all") {
        const supported = model.supported_languages ?? [];
        if (!supported.includes(languageFilter)) return false;
      }
      return true;
    });
  }, [models, languageFilter]);

  const { downloadedModels, availableModels } = useMemo(() => {
    const downloaded: ModelInfo[] = [];
    const available: ModelInfo[] = [];
    for (const model of filteredModels) {
      if (
        model.is_custom ||
        model.is_downloaded ||
        model.id in downloadingModels ||
        model.id in extractingModels
      ) {
        downloaded.push(model);
      } else {
        available.push(model);
      }
    }
    downloaded.sort((a, b) => {
      if (a.id === currentModel) return -1;
      if (b.id === currentModel) return 1;
      if (a.is_custom !== b.is_custom) return a.is_custom ? 1 : -1;
      return 0;
    });
    return { downloadedModels: downloaded, availableModels: available };
  }, [filteredModels, downloadingModels, extractingModels, currentModel]);

  if (loading) {
    return (
      <Center axis="both" maxWidth={768} height={200}>
        <Spinner size="lg" />
      </Center>
    );
  }

  return (
    <SettingsPage
      title={t("settings.transcription.title")}
      description={t("settings.transcription.description")}
    >
      {filteredModels.length > 0 ? (
        <VStack gap={6}>
          <VStack gap={3}>
            <HStack justify="between" align="center">
              <Text type="label" color="secondary">
                {t("settings.models.yourModels")}
              </Text>
              <Selector
                label={t("settings.general.language.title")}
                isLabelHidden
                options={languageFilterOptions}
                value={languageFilter}
                onChange={(value) => value && setLanguageFilter(value)}
                hasSearch
                searchPlaceholder={t(
                  "settings.general.language.searchPlaceholder",
                )}
                size="sm"
                width={220}
              />
            </HStack>
            {downloadedModels.map((model: ModelInfo) => (
              <ModelCard
                key={model.id}
                model={model}
                status={getModelStatus(model.id)}
                onSelect={handleModelSelect}
                onDownload={downloadModel}
                onDelete={handleModelDelete}
                onCancel={handleModelCancel}
                downloadProgress={getDownloadProgress(model.id)}
                downloadSpeed={getDownloadSpeed(model.id)}
                showRecommended={false}
              />
            ))}
          </VStack>
          {availableModels.length > 0 && (
            <Collapsible
              defaultIsOpen={false}
              trigger={
                <Text type="label" color="secondary">
                  {t("settings.models.availableModelsCount", {
                    count: availableModels.length,
                  })}
                </Text>
              }
            >
              <VStack gap={3}>
                {availableModels.map((model: ModelInfo) => (
                  <ModelCard
                    key={model.id}
                    model={model}
                    status={getModelStatus(model.id)}
                    onSelect={handleModelSelect}
                    onDownload={downloadModel}
                    onDelete={handleModelDelete}
                    onCancel={handleModelCancel}
                    downloadProgress={getDownloadProgress(model.id)}
                    downloadSpeed={getDownloadSpeed(model.id)}
                    showRecommended={false}
                  />
                ))}
              </VStack>
            </Collapsible>
          )}
        </VStack>
      ) : (
        <EmptyState title={t("settings.models.noModelsMatch")} />
      )}

      {/* STT quality settings */}
      <ModelSettingsCard />
    </SettingsPage>
  );
};
