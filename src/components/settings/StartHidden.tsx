import React from "react";
import { useTranslation } from "react-i18next";
import { Switch } from "@astryxdesign/core";
import { useSettings } from "../../hooks/useSettings";

export const StartHidden: React.FC = React.memo(() => {
  const { t } = useTranslation();
  const { getSetting, updateSetting, isUpdating } = useSettings();

  const startHidden = getSetting("start_hidden") ?? false;

  return (
    <Switch
      value={startHidden}
      onChange={(enabled) => updateSetting("start_hidden", enabled)}
      isLoading={isUpdating("start_hidden")}
      label={t("settings.advanced.startHidden.label")}
      description={t("settings.advanced.startHidden.description")}
      labelPosition="start"
      labelSpacing="spread"
      width="100%"
    />
  );
});
