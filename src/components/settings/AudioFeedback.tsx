import React from "react";
import { useTranslation } from "react-i18next";
import { Switch } from "@astryxdesign/core";
import { useSettings } from "../../hooks/useSettings";

export const AudioFeedback: React.FC = React.memo(() => {
  const { t } = useTranslation();
  const { getSetting, updateSetting, isUpdating } = useSettings();
  const audioFeedbackEnabled = getSetting("audio_feedback") || false;

  return (
    <Switch
      value={audioFeedbackEnabled}
      onChange={(enabled) => updateSetting("audio_feedback", enabled)}
      isLoading={isUpdating("audio_feedback")}
      label={t("settings.sound.audioFeedback.label")}
      description={t("settings.sound.audioFeedback.description")}
      labelPosition="start"
      labelSpacing="spread"
      width="100%"
    />
  );
});
