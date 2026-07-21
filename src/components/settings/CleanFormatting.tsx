import React from "react";
import { useTranslation } from "react-i18next";
import { Switch } from "@astryxdesign/core";
import { useSettings } from "../../hooks/useSettings";

export const CleanFormatting: React.FC = React.memo(() => {
  const { t } = useTranslation();
  const { getSetting, updateSetting, isUpdating } = useSettings();

  const enabled = getSetting("clean_formatting") ?? true;

  return (
    <Switch
      value={enabled}
      onChange={(enabled) => updateSetting("clean_formatting", enabled)}
      isLoading={isUpdating("clean_formatting")}
      label={t("settings.postProcessing.cleanup.formatting.label")}
      description={t("settings.postProcessing.cleanup.formatting.description")}
      labelPosition="start"
      labelSpacing="spread"
      width="100%"
    />
  );
});
