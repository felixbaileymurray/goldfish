import React from "react";
import { useTranslation } from "react-i18next";
import {
  Check,
  Download,
  Globe,
  Languages,
  Loader2,
  Trash2,
} from "lucide-react";
import type { ModelInfo } from "@/bindings";
import { Card } from "@astryxdesign/core/Card";
import { ClickableCard } from "@astryxdesign/core/ClickableCard";
import { VStack } from "@astryxdesign/core/VStack";
import { HStack } from "@astryxdesign/core/HStack";
import { Text } from "@astryxdesign/core/Text";
import { Badge } from "@astryxdesign/core/Badge";
import { Divider } from "@astryxdesign/core/Divider";
import { ProgressBar } from "@astryxdesign/core/ProgressBar";
import { Button } from "@astryxdesign/core/Button";
import { Tooltip } from "@astryxdesign/core/Tooltip";
import { formatModelSize } from "../../lib/utils/format";
import {
  getTranslatedModelDescription,
  getTranslatedModelName,
} from "../../lib/utils/modelTranslation";
import { LANGUAGES } from "../../lib/constants/languages";

// Get display text for model's language support
const getLanguageDisplayText = (
  supportedLanguages: string[],
  t: (key: string, options?: Record<string, unknown>) => string,
): string => {
  if (supportedLanguages.length === 1) {
    const langCode = supportedLanguages[0];
    const langName =
      LANGUAGES.find((l) => l.value === langCode)?.label || langCode;
    return t("modelSelector.capabilities.languageOnly", { language: langName });
  }
  return t("modelSelector.capabilities.multiLanguage");
};

export type ModelCardStatus =
  | "downloadable"
  | "downloading"
  | "verifying"
  | "extracting"
  | "switching"
  | "active"
  | "available";

interface ModelCardProps {
  model: ModelInfo;
  variant?: "default" | "featured";
  status?: ModelCardStatus;
  disabled?: boolean;
  className?: string;
  onSelect: (modelId: string) => void;
  onDownload?: (modelId: string) => void;
  onDelete?: (modelId: string) => void;
  onCancel?: (modelId: string) => void;
  downloadProgress?: number;
  downloadSpeed?: number; // MB/s
  showRecommended?: boolean;
}

const ModelCard: React.FC<ModelCardProps> = ({
  model,
  variant = "default",
  status = "downloadable",
  disabled = false,
  className = "",
  onSelect,
  onDownload,
  onDelete,
  onCancel,
  downloadProgress,
  downloadSpeed,
  showRecommended = true,
}) => {
  const { t } = useTranslation();
  const isFeatured = variant === "featured";
  const isClickable =
    status === "available" || status === "active" || status === "downloadable";

  const displayName = getTranslatedModelName(model, t);
  const displayDescription = getTranslatedModelDescription(model, t);

  const cardVariant =
    status === "active" ? "blue" : isFeatured ? "blue" : "default";

  const handleClick = () => {
    if (status === "downloadable" && onDownload) {
      onDownload(model.id);
    } else {
      onSelect(model.id);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(model.id);
  };

  const cardContent = (
    <VStack gap={2} className={className}>
      {/* Top section: name/description + score bars */}
      <HStack justify="between" align="center" width="100%">
        <VStack gap={0.5} align="start" className="flex-1 min-w-0">
          <HStack gap={2} wrap="wrap" align="center">
            <Text type="label" weight="semibold">
              {displayName}
            </Text>
            {showRecommended && model.is_recommended && (
              <Badge variant="info" label={t("onboarding.recommended")} />
            )}
            {status === "active" && (
              <Badge
                variant="info"
                label={t("modelSelector.active")}
                icon={<Check width={12} height={12} />}
              />
            )}
            {model.is_custom && (
              <Badge variant="neutral" label={t("modelSelector.custom")} />
            )}
            {status === "switching" && (
              <Badge
                variant="neutral"
                label={t("modelSelector.switching")}
                icon={
                  <Loader2 width={12} height={12} className="animate-spin" />
                }
              />
            )}
          </HStack>
          <Text size="sm" color="secondary">
            {displayDescription}
          </Text>
        </VStack>
        {(model.accuracy_score > 0 || model.speed_score > 0) && (
          <VStack gap={1} className="hidden sm:flex shrink-0 ms-4 w-32">
            <HStack gap={2} align="center">
              <Text size="xsm" color="secondary" className="w-16 text-end">
                {t("onboarding.modelCard.accuracy")}
              </Text>
              <ProgressBar
                value={model.accuracy_score * 100}
                label={t("onboarding.modelCard.accuracy")}
                isLabelHidden
                className="flex-1"
              />
            </HStack>
            <HStack gap={2} align="center">
              <Text size="xsm" color="secondary" className="w-16 text-end">
                {t("onboarding.modelCard.speed")}
              </Text>
              <ProgressBar
                value={model.speed_score * 100}
                label={t("onboarding.modelCard.speed")}
                isLabelHidden
                className="flex-1"
              />
            </HStack>
          </VStack>
        )}
      </HStack>

      <Divider />

      {/* Bottom row: tags + action buttons */}
      <HStack gap={3} align="center" width="100%">
        {model.supported_languages.length > 0 && (
          <Tooltip
            content={
              model.supported_languages.length === 1
                ? t("modelSelector.capabilities.singleLanguage")
                : t("modelSelector.capabilities.languageSelection")
            }
          >
            <HStack gap={1} align="center">
              <Globe
                width={14}
                height={14}
                color="var(--color-text-secondary)"
              />
              <Text size="xsm" color="secondary">
                {getLanguageDisplayText(model.supported_languages, t)}
              </Text>
            </HStack>
          </Tooltip>
        )}
        {model.supports_translation && (
          <Tooltip content={t("modelSelector.capabilities.translation")}>
            <HStack gap={1} align="center">
              <Languages
                width={14}
                height={14}
                color="var(--color-text-secondary)"
              />
              <Text size="xsm" color="secondary">
                {t("modelSelector.capabilities.translate")}
              </Text>
            </HStack>
          </Tooltip>
        )}
        {status === "downloadable" && (
          <HStack gap={1.5} align="center" className="ms-auto">
            <Download
              width={14}
              height={14}
              color="var(--color-text-secondary)"
            />
            <Text size="xsm" color="secondary">
              {formatModelSize(Number(model.size_mb))}
            </Text>
          </HStack>
        )}
        {onDelete && (status === "available" || status === "active") && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            label={t("modelSelector.deleteModel", { modelName: displayName })}
            isIconOnly
            icon={<Trash2 width={14} height={14} />}
            className="ms-auto"
          />
        )}
      </HStack>

      {/* Download/extract progress */}
      {status === "downloading" && downloadProgress !== undefined && (
        <VStack gap={1} width="100%">
          <ProgressBar
            value={downloadProgress}
            label={t("modelSelector.downloading", {
              percentage: Math.round(downloadProgress),
            })}
            isLabelHidden
          />
          <HStack justify="between" align="center">
            <Text size="xsm" color="secondary">
              {t("modelSelector.downloading", {
                percentage: Math.round(downloadProgress),
              })}
            </Text>
            <HStack gap={2} align="center">
              {downloadSpeed !== undefined && downloadSpeed > 0 && (
                <Text size="xsm" color="secondary" className="tabular-nums">
                  {t("modelSelector.downloadSpeed", {
                    speed: downloadSpeed.toFixed(1),
                  })}
                </Text>
              )}
              {onCancel && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onCancel(model.id);
                  }}
                  label={t("modelSelector.cancel")}
                  tooltip={t("modelSelector.cancelDownload")}
                />
              )}
            </HStack>
          </HStack>
        </VStack>
      )}
      {status === "verifying" && (
        <VStack gap={1} width="100%">
          <ProgressBar
            isIndeterminate
            label={t("modelSelector.verifyingGeneric")}
            isLabelHidden
          />
          <Text size="xsm" color="secondary">
            {t("modelSelector.verifyingGeneric")}
          </Text>
        </VStack>
      )}
      {status === "extracting" && (
        <VStack gap={1} width="100%">
          <ProgressBar
            isIndeterminate
            label={t("modelSelector.extractingGeneric")}
            isLabelHidden
          />
          <Text size="xsm" color="secondary">
            {t("modelSelector.extractingGeneric")}
          </Text>
        </VStack>
      )}
    </VStack>
  );

  if (isClickable) {
    return (
      <ClickableCard
        label={displayName}
        onClick={handleClick}
        isDisabled={disabled}
        variant={cardVariant}
        padding={4}
      >
        {cardContent}
      </ClickableCard>
    );
  }

  return (
    <Card variant={cardVariant} padding={4}>
      {cardContent}
    </Card>
  );
};

export default ModelCard;
