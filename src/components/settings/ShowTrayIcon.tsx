import React from "react";
import { useTranslation } from "react-i18next";
import { Switch } from "@astryxdesign/core";
import { useSettings } from "../../hooks/useSettings";

export const ShowTrayIcon: React.FC = React.memo(() => {
  const { t } = useTranslation();
  const { getSetting, updateSetting, isUpdating } = useSettings();

  const showTrayIcon = getSetting("show_tray_icon") ?? true;

  return (
    <Switch
      value={showTrayIcon}
      onChange={(enabled) => updateSetting("show_tray_icon", enabled)}
      isLoading={isUpdating("show_tray_icon")}
      label={t("settings.advanced.showTrayIcon.label")}
      description={t("settings.advanced.showTrayIcon.description")}
      labelPosition="start"
      labelSpacing="spread"
      width="100%"
    />
  );
});
