import React from "react";
import { useTranslation } from "react-i18next";
import { SettingsPage } from "../shared/SettingsPage";
import { SettingsFormGroup } from "../shared/SettingsFormGroup";
import { HistoryLimit } from "../HistoryLimit";
import { RecordingRetentionPeriodSelector } from "../RecordingRetentionPeriod";

export const RetentionSettings: React.FC = () => {
  const { t } = useTranslation();

  return (
    <SettingsPage
      title={t("settings.retention.title")}
      description={t("settings.retention.description")}
    >
      <SettingsFormGroup title={t("settings.capture.history.title")}>
        <HistoryLimit />
        <RecordingRetentionPeriodSelector />
      </SettingsFormGroup>
    </SettingsPage>
  );
};
