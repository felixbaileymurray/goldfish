import React from "react";
import { useTranslation } from "react-i18next";
import { Switch } from "@astryxdesign/core";
import { useSettings } from "../../hooks/useSettings";

export const SummarisationToggle: React.FC = React.memo(() => {
  const { t } = useTranslation();
  const { getSetting, updateSetting, isUpdating } = useSettings();

  const enabled = getSetting("summarize_enabled") || false;

  return (
    <Switch
      value={enabled}
      onChange={(value) => updateSetting("summarize_enabled", value)}
      isLoading={isUpdating("summarize_enabled")}
      label={t("settings.summarisation.toggle.label")}
      description={t("settings.summarisation.toggle.description")}
      labelPosition="start"
      labelSpacing="spread"
      width="100%"
    />
  );
});

SummarisationToggle.displayName = "SummarisationToggle";
