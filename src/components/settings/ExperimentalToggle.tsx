import React from "react";
import { useTranslation } from "react-i18next";
import { Switch } from "@astryxdesign/core";
import { useSettings } from "../../hooks/useSettings";

export const ExperimentalToggle: React.FC = React.memo(() => {
  const { t } = useTranslation();
  const { getSetting, updateSetting, isUpdating } = useSettings();

  const enabled = getSetting("experimental_enabled") || false;

  return (
    <Switch
      value={enabled}
      onChange={(enabled) => updateSetting("experimental_enabled", enabled)}
      isLoading={isUpdating("experimental_enabled")}
      label={t("settings.advanced.experimentalToggle.label")}
      description={t("settings.advanced.experimentalToggle.description")}
      labelPosition="start"
      labelSpacing="spread"
      width="100%"
    />
  );
});
