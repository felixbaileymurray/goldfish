import React from "react";
import { useTranslation } from "react-i18next";
import { Switch } from "@astryxdesign/core";
import { useSettings } from "../../hooks/useSettings";

export const LazyStreamClose: React.FC = React.memo(() => {
  const { t } = useTranslation();
  const { getSetting, updateSetting, isUpdating } = useSettings();

  const enabled = getSetting("lazy_stream_close") ?? false;

  return (
    <Switch
      value={enabled}
      onChange={(enabled) => updateSetting("lazy_stream_close", enabled)}
      isLoading={isUpdating("lazy_stream_close")}
      label={t("settings.advanced.lazyStreamClose.label")}
      description={t("settings.advanced.lazyStreamClose.description")}
      labelPosition="start"
      labelSpacing="spread"
      width="100%"
    />
  );
});
