import React from "react";
import { useTranslation } from "react-i18next";
import { Switch } from "@astryxdesign/core";
import { useSettings } from "../../hooks/useSettings";

export const CleanNumbers: React.FC = React.memo(() => {
  const { t } = useTranslation();
  const { getSetting, updateSetting, isUpdating } = useSettings();

  const enabled = getSetting("clean_numbers") ?? true;

  return (
    <Switch
      value={enabled}
      onChange={(enabled) => updateSetting("clean_numbers", enabled)}
      isLoading={isUpdating("clean_numbers")}
      label={t("settings.postProcessing.cleanup.numbers.label")}
      description={t("settings.postProcessing.cleanup.numbers.description")}
      labelPosition="start"
      labelSpacing="spread"
      width="100%"
    />
  );
});
