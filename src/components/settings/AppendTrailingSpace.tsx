import React from "react";
import { useTranslation } from "react-i18next";
import { Switch } from "@astryxdesign/core";
import { useSettings } from "../../hooks/useSettings";

export const AppendTrailingSpace: React.FC = React.memo(() => {
  const { t } = useTranslation();
  const { getSetting, updateSetting, isUpdating } = useSettings();

  const enabled = getSetting("append_trailing_space") ?? false;

  return (
    <Switch
      value={enabled}
      onChange={(enabled) => updateSetting("append_trailing_space", enabled)}
      isLoading={isUpdating("append_trailing_space")}
      label={t("settings.debug.appendTrailingSpace.label")}
      description={t("settings.debug.appendTrailingSpace.description")}
      labelPosition="start"
      labelSpacing="spread"
      width="100%"
    />
  );
});
