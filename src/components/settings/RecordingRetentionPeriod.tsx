import React from "react";
import { useTranslation } from "react-i18next";
import { Selector } from "@astryxdesign/core";
import { useSettings } from "../../hooks/useSettings";
import { RecordingRetentionPeriod } from "@/bindings";

export const RecordingRetentionPeriodSelector: React.FC = React.memo(() => {
  const { t } = useTranslation();
  const { getSetting, updateSetting, isUpdating } = useSettings();

  const selectedRetentionPeriod =
    getSetting("recording_retention_period") || "never";
  const historyLimit = getSetting("history_limit") || 5;

  const handleRetentionPeriodSelect = async (period: string) => {
    await updateSetting(
      "recording_retention_period",
      period as RecordingRetentionPeriod,
    );
  };

  const retentionOptions = [
    { value: "never", label: t("settings.debug.recordingRetention.never") },
    {
      value: "preserve_limit",
      label: t("settings.debug.recordingRetention.preserveLimit", {
        count: Number(historyLimit),
      }),
    },
    { value: "days3", label: t("settings.debug.recordingRetention.days3") },
    { value: "weeks2", label: t("settings.debug.recordingRetention.weeks2") },
    {
      value: "months3",
      label: t("settings.debug.recordingRetention.months3"),
    },
  ];

  return (
    <Selector
      label={t("settings.debug.recordingRetention.title")}
      labelTooltip={t("settings.debug.recordingRetention.description")}
      options={retentionOptions}
      value={selectedRetentionPeriod}
      onChange={handleRetentionPeriodSelect}
      placeholder={t("settings.debug.recordingRetention.placeholder")}
      isDisabled={isUpdating("recording_retention_period")}
      width="100%"
    />
  );
});

RecordingRetentionPeriodSelector.displayName =
  "RecordingRetentionPeriodSelector";
