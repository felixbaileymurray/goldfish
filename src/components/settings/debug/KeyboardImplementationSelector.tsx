import React, { useId } from "react";
import { useTranslation } from "react-i18next";
import { Field } from "@astryxdesign/core";
import { Dropdown, type DropdownOption } from "../../ui/Dropdown";
import { useSettings } from "../../../hooks/useSettings";
import { commands } from "@/bindings";
import { toast } from "sonner";

const KEYBOARD_IMPLEMENTATION_OPTIONS: DropdownOption[] = [
  { value: "tauri", label: "Tauri Global Shortcut" },
  { value: "handy_keys", label: "Handy Keys" },
];

export const KeyboardImplementationSelector: React.FC = () => {
  const { t } = useTranslation();
  const inputID = useId();
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
    <Field
      label={t("settings.debug.keyboardImplementation.title")}
      description={t("settings.debug.keyboardImplementation.description")}
      inputID={inputID}
      width="100%"
    >
      <Dropdown
        options={KEYBOARD_IMPLEMENTATION_OPTIONS}
        selectedValue={currentImplementation}
        onSelect={handleSelect}
        disabled={isUpdating("keyboard_implementation")}
      />
    </Field>
  );
};
