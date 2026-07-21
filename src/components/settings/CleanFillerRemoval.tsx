import React from "react";
import { useTranslation } from "react-i18next";
import { Switch } from "@astryxdesign/core";
import { useSettings } from "../../hooks/useSettings";

export const CleanFillerRemoval: React.FC = React.memo(() => {
  const { t } = useTranslation();
  const { getSetting, updateSetting, isUpdating } = useSettings();

  const enabled = getSetting("clean_filler_removal") ?? true;

  return (
    <Switch
      value={enabled}
      onChange={(enabled) => updateSetting("clean_filler_removal", enabled)}
      isLoading={isUpdating("clean_filler_removal")}
      label={t("settings.postProcessing.cleanup.fillerRemoval.label")}
      description={t(
        "settings.postProcessing.cleanup.fillerRemoval.description",
      )}
      labelPosition="start"
      labelSpacing="spread"
      width="100%"
    />
  );
});
