import React, { useId } from "react";
import { useTranslation } from "react-i18next";
import { Dropdown } from "../ui/Dropdown";
import { Field, HStack } from "@astryxdesign/core";
import { ResetButton } from "../ui/ResetButton";
import { useSettings } from "../../hooks/useSettings";

export const MicrophoneSelector: React.FC = React.memo(() => {
  const { t } = useTranslation();
  const inputID = useId();
  const {
    getSetting,
    updateSetting,
    resetSetting,
    isUpdating,
    isLoading,
    audioDevices,
    refreshAudioDevices,
  } = useSettings();

  const selectedMicrophone =
    getSetting("selected_microphone") === "default"
      ? "Default"
      : getSetting("selected_microphone") || "Default";

  const handleMicrophoneSelect = async (deviceName: string) => {
    await updateSetting("selected_microphone", deviceName);
  };

  const handleReset = async () => {
    await resetSetting("selected_microphone");
  };

  const microphoneOptions = audioDevices.map((device) => ({
    value: device.name,
    label: device.name,
  }));

  return (
    <Field
      label={t("settings.sound.microphone.title")}
      description={t("settings.sound.microphone.description")}
      inputID={inputID}
      width="100%"
    >
      <HStack gap={1}>
        <Dropdown
          options={microphoneOptions}
          selectedValue={selectedMicrophone}
          onSelect={handleMicrophoneSelect}
          placeholder={
            isLoading || audioDevices.length === 0
              ? t("settings.sound.microphone.loading")
              : t("settings.sound.microphone.placeholder")
          }
          disabled={
            isUpdating("selected_microphone") ||
            isLoading ||
            audioDevices.length === 0
          }
          onRefresh={refreshAudioDevices}
        />
        <ResetButton
          onClick={handleReset}
          disabled={isUpdating("selected_microphone") || isLoading}
        />
      </HStack>
    </Field>
  );
});
