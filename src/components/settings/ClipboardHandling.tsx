import React, { useId } from "react";
import { useTranslation } from "react-i18next";
import { Dropdown } from "../ui/Dropdown";
import { Field } from "@astryxdesign/core";
import { useSettings } from "../../hooks/useSettings";
import type { ClipboardHandling } from "@/bindings";

export const ClipboardHandlingSetting: React.FC = React.memo(() => {
  const { t } = useTranslation();
  const inputID = useId();
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
    <Field
      label={t("settings.advanced.clipboardHandling.title")}
      description={t("settings.advanced.clipboardHandling.description")}
      inputID={inputID}
      width="100%"
    >
      <Dropdown
        options={clipboardHandlingOptions}
        selectedValue={selectedHandling}
        onSelect={(value) =>
          updateSetting("clipboard_handling", value as ClipboardHandling)
        }
        disabled={isUpdating("clipboard_handling")}
      />
    </Field>
  );
});
