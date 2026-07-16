import React, { useId } from "react";
import { useTranslation } from "react-i18next";
import { Field, HStack, IconButton, Selector } from "@astryxdesign/core";
import ResetIcon from "../icons/ResetIcon";
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

  // Astryx's Selector has no onOpen/onRefresh hook, so rescan devices on any
  // click in this control (mirrors the old Dropdown's refresh-on-open).
  const handleRefreshOnInteract = () => {
    refreshAudioDevices().catch(console.error);
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
      <HStack gap={1} onClickCapture={handleRefreshOnInteract}>
        <Selector
          label={t("settings.sound.microphone.title")}
          isLabelHidden
          options={microphoneOptions}
          value={selectedMicrophone}
          onChange={handleMicrophoneSelect}
          placeholder={
            isLoading || audioDevices.length === 0
              ? t("settings.sound.microphone.loading")
              : t("settings.sound.microphone.placeholder")
          }
          isDisabled={
            isUpdating("selected_microphone") ||
            isLoading ||
            audioDevices.length === 0
          }
        />
        <IconButton
          icon={<ResetIcon />}
          label={t("common.reset")}
          onClick={handleReset}
          isDisabled={isUpdating("selected_microphone") || isLoading}
          variant="ghost"
        />
      </HStack>
    </Field>
  );
});
