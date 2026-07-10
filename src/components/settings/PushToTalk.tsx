import React from "react";
import { useTranslation } from "react-i18next";
import { Switch } from "@astryxdesign/core";
import { useSettings } from "../../hooks/useSettings";

export const PushToTalk: React.FC = React.memo(() => {
  const { t } = useTranslation();
  const { getSetting, updateSetting, isUpdating } = useSettings();

  const pttEnabled = getSetting("push_to_talk") || false;

  return (
    <Switch
      value={pttEnabled}
      onChange={(enabled) => updateSetting("push_to_talk", enabled)}
      isLoading={isUpdating("push_to_talk")}
      label={t("settings.general.pushToTalk.label")}
      description={t("settings.general.pushToTalk.description")}
      labelPosition="start"
      labelSpacing="spread"
      width="100%"
    />
  );
});
