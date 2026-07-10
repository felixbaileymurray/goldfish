import React, { useId } from "react";
import { useTranslation } from "react-i18next";
import { PlayIcon } from "lucide-react";
import { Field, HStack, IconButton, Selector } from "@astryxdesign/core";
import { useSettingsStore } from "../../stores/settingsStore";
import { useSettings } from "../../hooks/useSettings";

interface SoundPickerProps {
  label: string;
  description: string;
}

export const SoundPicker: React.FC<SoundPickerProps> = ({
  label,
  description,
}) => {
  const { t } = useTranslation();
  const inputID = useId();
  const { getSetting, updateSetting } = useSettings();
  const playTestSound = useSettingsStore((state) => state.playTestSound);
  const customSounds = useSettingsStore((state) => state.customSounds);

  const selectedTheme = getSetting("sound_theme") ?? "marimba";

  const options = [
    { value: "marimba", label: "Marimba" },
    { value: "pop", label: "Pop" },
  ];

  // Only add Custom option if both custom sound files exist
  if (customSounds.start && customSounds.stop) {
    options.push({ value: "custom", label: "Custom" });
  }

  const handlePlayBothSounds = async () => {
    await playTestSound("start");
    await playTestSound("stop");
  };

  return (
    <Field
      label={label}
      description={description}
      inputID={inputID}
      width="100%"
    >
      <HStack gap={2}>
        <Selector
          label={label}
          isLabelHidden
          value={selectedTheme}
          onChange={(value) =>
            updateSetting("sound_theme", value as "marimba" | "pop" | "custom")
          }
          options={options}
        />
        <IconButton
          icon={<PlayIcon className="h-4 w-4" />}
          label={t("settings.advanced.soundTheme.previewAriaLabel")}
          variant="ghost"
          size="sm"
          onClick={handlePlayBothSounds}
        />
      </HStack>
    </Field>
  );
};
