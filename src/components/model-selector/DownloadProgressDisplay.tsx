import React from "react";
import { useTranslation } from "react-i18next";
import { ProgressBar } from "@astryxdesign/core/ProgressBar";
import { HStack } from "@astryxdesign/core/HStack";
import { VStack } from "@astryxdesign/core/VStack";
import { Text } from "@astryxdesign/core/Text";

interface DownloadProgress {
  model_id: string;
  downloaded: number;
  total: number;
  percentage: number;
}

interface DownloadStats {
  startTime: number;
  lastUpdate: number;
  totalDownloaded: number;
  speed: number;
}

interface DownloadProgressDisplayProps {
  downloadProgress: Record<string, DownloadProgress>;
  downloadStats: Record<string, DownloadStats>;
  className?: string;
}

const DownloadProgressDisplay: React.FC<DownloadProgressDisplayProps> = ({
  downloadProgress,
  downloadStats,
  className = "",
}) => {
  const { t } = useTranslation();
  const progressValues = Object.values(downloadProgress);
  if (progressValues.length === 0) {
    return null;
  }

  if (progressValues.length === 1) {
    const progress = progressValues[0];
    const percentage = Math.max(0, Math.min(100, progress.percentage));
    const speed = downloadStats[progress.model_id]?.speed;

    return (
      <HStack gap={3} align="center" className={className}>
        <ProgressBar
          value={percentage}
          label={t("modelSelector.downloading", {
            percentage: Math.round(percentage),
          })}
          isLabelHidden
          className="w-20"
        />
        {speed !== undefined && speed > 0 && (
          <Text size="xsm" color="secondary" className="tabular-nums">
            {t("modelSelector.downloadSpeed", { speed: speed.toFixed(1) })}
          </Text>
        )}
      </HStack>
    );
  }

  return (
    <VStack gap={1} className={className}>
      {progressValues.map((progress) => (
        <ProgressBar
          key={progress.model_id}
          value={Math.max(0, Math.min(100, progress.percentage))}
          label={progress.model_id}
          isLabelHidden
          className="w-20"
        />
      ))}
      <Text size="xsm" color="secondary">
        {t("modelSelector.downloadingMultiple", {
          count: progressValues.length,
        })}
      </Text>
    </VStack>
  );
};

export default DownloadProgressDisplay;
