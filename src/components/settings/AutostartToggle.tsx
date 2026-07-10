import React from "react";
import { useTranslation } from "react-i18next";
import { Switch } from "@astryxdesign/core";
import { useSettings } from "../../hooks/useSettings";

export const AutostartToggle: React.FC = React.memo(() => {
  const { t } = useTranslation();
  const { getSetting, updateSetting, isUpdating } = useSettings();

  const autostartEnabled = getSetting("autostart_enabled") ?? false;

  return (
    <Switch
      value={autostartEnabled}
      onChange={(enabled) => updateSetting("autostart_enabled", enabled)}
      isLoading={isUpdating("autostart_enabled")}
      label={t("settings.advanced.autostart.label")}
      description={t("settings.advanced.autostart.description")}
      labelPosition="start"
      labelSpacing="spread"
      width="100%"
    />
  );
});
