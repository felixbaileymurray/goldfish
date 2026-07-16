import React from "react";
import { useTranslation } from "react-i18next";
import { Switch } from "@astryxdesign/core";
import { useSettings } from "../../hooks/useSettings";

export const MuteWhileRecording: React.FC = React.memo(() => {
  const { t } = useTranslation();
  const { getSetting, updateSetting, isUpdating } = useSettings();

  const muteEnabled = getSetting("mute_while_recording") ?? false;

  return (
    <Switch
      value={muteEnabled}
      onChange={(enabled) => updateSetting("mute_while_recording", enabled)}
      isLoading={isUpdating("mute_while_recording")}
      label={t("settings.debug.muteWhileRecording.label")}
      description={t("settings.debug.muteWhileRecording.description")}
      labelPosition="start"
      labelSpacing="spread"
      width="100%"
    />
  );
});
