import React, { useId } from "react";
import { useTranslation } from "react-i18next";
import { Field, Selector, TextInput, VStack } from "@astryxdesign/core";
import { useSettings } from "../../hooks/useSettings";
import { useOsType } from "../../hooks/useOsType";
import type { PasteMethod } from "@/bindings";

export const PasteMethodSetting: React.FC = React.memo(() => {
  const { t } = useTranslation();
  const inputID = useId();
  const { getSetting, updateSetting, isUpdating } = useSettings();
  const osType = useOsType();

  const getPasteMethodOptions = (osType: string) => {
    const mod = osType === "macos" ? "Cmd" : "Ctrl";

    const options = [
      {
        value: "ctrl_v",
        label: t("settings.advanced.pasteMethod.options.clipboard", {
          modifier: mod,
        }),
      },
      {
        value: "direct",
        label: t("settings.advanced.pasteMethod.options.direct"),
      },
      {
        value: "none",
        label: t("settings.advanced.pasteMethod.options.none"),
      },
    ];

    // Add Shift+Insert and Ctrl+Shift+V options for Windows and Linux only
    if (osType === "windows" || osType === "linux") {
      options.push(
        {
          value: "ctrl_shift_v",
          label: t("settings.advanced.pasteMethod.options.clipboardCtrlShiftV"),
        },
        {
          value: "shift_insert",
          label: t(
            "settings.advanced.pasteMethod.options.clipboardShiftInsert",
          ),
        },
      );
    }

    // External script is only available on Linux
    if (osType === "linux") {
      options.push({
        value: "external_script",
        label: t("settings.advanced.pasteMethod.options.externalScript"),
      });
    }

    return options;
  };

  const selectedMethod = (getSetting("paste_method") ||
    "ctrl_v") as PasteMethod;
  const externalScriptPath = getSetting("external_script_path") || "";

  const pasteMethodOptions = getPasteMethodOptions(osType);

  return (
    <Field
      label={t("settings.advanced.pasteMethod.title")}
      description={t("settings.advanced.pasteMethod.description")}
      inputID={inputID}
      width="100%"
    >
      <VStack gap={2}>
        <Selector
          label={t("settings.advanced.pasteMethod.title")}
          isLabelHidden
          options={pasteMethodOptions}
          value={selectedMethod}
          onChange={(value) =>
            updateSetting("paste_method", value as PasteMethod)
          }
          isDisabled={isUpdating("paste_method")}
        />
        {selectedMethod === "external_script" && (
          <TextInput
            label={t("settings.advanced.pasteMethod.externalScriptPlaceholder")}
            isLabelHidden
            type="text"
            value={externalScriptPath}
            onChange={(val) => updateSetting("external_script_path", val)}
            placeholder={t(
              "settings.advanced.pasteMethod.externalScriptPlaceholder",
            )}
            isDisabled={isUpdating("external_script_path")}
          />
        )}
      </VStack>
    </Field>
  );
});
