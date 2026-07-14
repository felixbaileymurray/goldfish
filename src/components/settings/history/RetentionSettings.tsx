import React from "react";
import { useTranslation } from "react-i18next";
import { SettingsFormGroup } from "../shared/SettingsFormGroup";
import { HistoryLimit } from "../HistoryLimit";
import { RecordingRetentionPeriodSelector } from "../RecordingRetentionPeriod";

export const RetentionSettings: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="max-w-3xl w-full mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-semibold mb-2">
          {t("settings.retention.title")}
        </h1>
        <p className="text-sm text-secondary">
          {t("settings.retention.description")}
        </p>
      </div>
      <SettingsFormGroup title={t("settings.capture.history.title")}>
        <HistoryLimit />
        <RecordingRetentionPeriodSelector />
      </SettingsFormGroup>
    </div>
  );
};
