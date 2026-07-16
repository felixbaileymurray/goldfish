import React from "react";
import { useTranslation } from "react-i18next";
import { Selector } from "@astryxdesign/core";
import { useSettings } from "../../hooks/useSettings";
import { useOsType } from "../../hooks/useOsType";
import type { AutoSubmitKey } from "@/bindings";

type AutoSubmitOptionValue = AutoSubmitKey | "off";

export const AutoSubmit: React.FC = React.memo(() => {
  const { t } = useTranslation();
  const osType = useOsType();
  const { getSetting, updateSetting, isUpdating } = useSettings();

  const enabled = getSetting("auto_submit") ?? false;
  const selectedKey = (getSetting("auto_submit_key") ||
    "enter") as AutoSubmitKey;
  const selectedValue: AutoSubmitOptionValue = enabled ? selectedKey : "off";
  const submitWithMetaLabel =
    osType === "macos"
      ? t("settings.advanced.autoSubmit.options.cmdEnter")
      : t("settings.advanced.autoSubmit.options.superEnter");

  const autoSubmitOptions = [
    {
      value: "off",
      label: t("settings.advanced.autoSubmit.options.off"),
    },
    {
      value: "enter",
      label: t("settings.advanced.autoSubmit.options.enter"),
    },
    {
      value: "ctrl_enter",
      label: t("settings.advanced.autoSubmit.options.ctrlEnter"),
    },
    {
      value: "cmd_enter",
      label: submitWithMetaLabel,
    },
  ];

  const handleAutoSubmitSelect = async (value: string) => {
    const selected = value as AutoSubmitOptionValue;

    if (selected === "off") {
      await updateSetting("auto_submit", false);
      return;
    }

    await updateSetting("auto_submit_key", selected as AutoSubmitKey);
    if (!enabled) {
      await updateSetting("auto_submit", true);
    }
  };

  return (
    <Selector
      label={t("settings.advanced.autoSubmit.title")}
      description={t("settings.advanced.autoSubmit.description")}
      options={autoSubmitOptions}
      value={selectedValue}
      onChange={handleAutoSubmitSelect}
      isDisabled={isUpdating("auto_submit") || isUpdating("auto_submit_key")}
      width="100%"
    />
  );
});
