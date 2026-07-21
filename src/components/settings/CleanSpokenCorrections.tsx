import React from "react";
import { useTranslation } from "react-i18next";
import { Switch } from "@astryxdesign/core";
import { useSettings } from "../../hooks/useSettings";

export const CleanSpokenCorrections: React.FC = React.memo(() => {
  const { t } = useTranslation();
  const { getSetting, updateSetting, isUpdating } = useSettings();

  const enabled = getSetting("clean_spoken_corrections") ?? true;

  return (
    <Switch
      value={enabled}
      onChange={(enabled) => updateSetting("clean_spoken_corrections", enabled)}
      isLoading={isUpdating("clean_spoken_corrections")}
      label={t("settings.postProcessing.cleanup.spokenCorrections.label")}
      description={t(
        "settings.postProcessing.cleanup.spokenCorrections.description",
      )}
      labelPosition="start"
      labelSpacing="spread"
      width="100%"
    />
  );
});
