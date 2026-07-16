import React from "react";
import { useTranslation } from "react-i18next";
import { Switch } from "@astryxdesign/core";
import { useSettings } from "../../hooks/useSettings";

export const TranslateToEnglish: React.FC = React.memo(() => {
  const { t } = useTranslation();
  const { getSetting, updateSetting, isUpdating } = useSettings();

  const translateToEnglish = getSetting("translate_to_english") || false;

  return (
    <Switch
      value={translateToEnglish}
      onChange={(enabled) => updateSetting("translate_to_english", enabled)}
      isLoading={isUpdating("translate_to_english")}
      label={t("settings.advanced.translateToEnglish.label")}
      description={t("settings.advanced.translateToEnglish.description")}
      labelPosition="start"
      labelSpacing="spread"
      width="100%"
    />
  );
});
