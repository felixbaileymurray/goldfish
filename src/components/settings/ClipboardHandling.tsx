import React from "react";
import { useTranslation } from "react-i18next";
import { Selector } from "@astryxdesign/core";
import { useSettings } from "../../hooks/useSettings";
import type { ClipboardHandling } from "@/bindings";

export const ClipboardHandlingSetting: React.FC = React.memo(() => {
  const { t } = useTranslation();
  const { getSetting, updateSetting, isUpdating } = useSettings();

  const clipboardHandlingOptions = [
    {
      value: "dont_modify",
      label: t("settings.advanced.clipboardHandling.options.dontModify"),
    },
    {
      value: "copy_to_clipboard",
      label: t("settings.advanced.clipboardHandling.options.copyToClipboard"),
    },
  ];

  const selectedHandling = (getSetting("clipboard_handling") ||
    "dont_modify") as ClipboardHandling;

  return (
    <Selector
      label={t("settings.advanced.clipboardHandling.title")}
      description={t("settings.advanced.clipboardHandling.description")}
      options={clipboardHandlingOptions}
      value={selectedHandling}
      onChange={(value) =>
        updateSetting("clipboard_handling", value as ClipboardHandling)
      }
      isDisabled={isUpdating("clipboard_handling")}
      width="100%"
    />
  );
});
