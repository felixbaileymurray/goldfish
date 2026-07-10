import React from "react";
import { useTranslation } from "react-i18next";
import { WordCorrectionThreshold } from "./WordCorrectionThreshold";
import { LogLevelSelector } from "./LogLevelSelector";
import { PasteDelay } from "./PasteDelay";
import { RecordingBuffer } from "./RecordingBuffer";
import { SettingsPage } from "../shared/SettingsPage";
import { SettingsFormGroup } from "../shared/SettingsFormGroup";

export const DebugSettings: React.FC = () => {
  const { t } = useTranslation();

  return (
    <SettingsPage
      title={t("settings.debug.title")}
      description={t("settings.debug.description")}
    >
      <SettingsFormGroup>
        <LogLevelSelector />
        <WordCorrectionThreshold />
        <PasteDelay />
        <RecordingBuffer />
      </SettingsFormGroup>
    </SettingsPage>
  );
};
