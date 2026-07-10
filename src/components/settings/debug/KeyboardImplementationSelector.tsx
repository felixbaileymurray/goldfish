import React from "react";
import { useTranslation } from "react-i18next";
import { Selector } from "@astryxdesign/core";
import { useSettings } from "../../../hooks/useSettings";
import { commands } from "@/bindings";
import { toast } from "sonner";

const KEYBOARD_IMPLEMENTATION_OPTIONS = [
  { value: "tauri", label: "Tauri Global Shortcut" },
  { value: "handy_keys", label: "Handy Keys" },
];

export const KeyboardImplementationSelector: React.FC = () => {
  const { t } = useTranslation();
  const { getSetting, isUpdating, refreshSettings } = useSettings();
  const currentImplementation =
    getSetting("keyboard_implementation") ?? "tauri";

  const handleSelect = async (value: string) => {
    if (value === currentImplementation) return;

    try {
      const result = await commands.changeKeyboardImplementationSetting(value);

      if (result.status === "error") {
        console.error(
          "Failed to update keyboard implementation:",
          result.error,
        );
        toast.error(String(result.error));
        return;
      }

      // If any bindings were reset due to incompatibility, notify the user
      if (result.data.reset_bindings.length > 0) {
        toast.warning(t("settings.debug.keyboardImplementation.bindingsReset"));
      }

      await refreshSettings();
    } catch (error) {
      console.error("Failed to update keyboard implementation:", error);
      toast.error(String(error));
    }
  };

  return (
    <Selector
      label={t("settings.debug.keyboardImplementation.title")}
      description={t("settings.debug.keyboardImplementation.description")}
      options={KEYBOARD_IMPLEMENTATION_OPTIONS}
      value={currentImplementation}
      onChange={handleSelect}
      isDisabled={isUpdating("keyboard_implementation")}
      width="100%"
    />
  );
};
