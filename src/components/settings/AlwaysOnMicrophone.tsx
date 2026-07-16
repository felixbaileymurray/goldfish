import React from "react";
import { useTranslation } from "react-i18next";
import { Switch } from "@astryxdesign/core";
import { useSettings } from "../../hooks/useSettings";

export const AlwaysOnMicrophone: React.FC = React.memo(() => {
  const { t } = useTranslation();
  const { getSetting, updateSetting, isUpdating } = useSettings();

  const alwaysOnMode = getSetting("always_on_microphone") || false;

  return (
    <Switch
      value={alwaysOnMode}
      onChange={(enabled) => updateSetting("always_on_microphone", enabled)}
      isLoading={isUpdating("always_on_microphone")}
      label={t("settings.debug.alwaysOnMicrophone.label")}
      description={t("settings.debug.alwaysOnMicrophone.description")}
      labelPosition="start"
      labelSpacing="spread"
      width="100%"
    />
  );
});
