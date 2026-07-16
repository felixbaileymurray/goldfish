import React, { useId, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Field, HStack, IconButton, Selector } from "@astryxdesign/core";
import { commands } from "@/bindings";
import ResetIcon from "../icons/ResetIcon";
import { useSettings } from "../../hooks/useSettings";

export const ClamshellMicrophoneSelector: React.FC = React.memo(() => {
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

  const [isLaptop, setIsLaptop] = useState<boolean>(false);

  useEffect(() => {
    const checkIsLaptop = async () => {
      try {
        const result = await commands.isLaptop();
        if (result.status === "ok") {
          setIsLaptop(result.data);
        } else {
          setIsLaptop(false);
        }
      } catch (error) {
        console.error("Failed to check if device is laptop:", error);
        setIsLaptop(false);
      }
    };

    checkIsLaptop();
  }, []);

  // Only render on laptops
  if (!isLaptop) {
    return null;
  }

  const selectedClamshellMicrophone =
    getSetting("clamshell_microphone") === "default"
      ? "Default"
      : getSetting("clamshell_microphone") || "Default";

  const handleClamshellMicrophoneSelect = async (deviceName: string) => {
    await updateSetting("clamshell_microphone", deviceName);
  };

  const handleReset = async () => {
    await resetSetting("clamshell_microphone");
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
      label={t("settings.debug.clamshellMicrophone.title")}
      description={t("settings.debug.clamshellMicrophone.description")}
      inputID={inputID}
      width="100%"
    >
      <HStack gap={1} onClickCapture={handleRefreshOnInteract}>
        <Selector
          label={t("settings.debug.clamshellMicrophone.title")}
          isLabelHidden
          options={microphoneOptions}
          value={selectedClamshellMicrophone}
          onChange={handleClamshellMicrophoneSelect}
          placeholder={
            isLoading || audioDevices.length === 0
              ? t("common.loading")
              : t("settings.sound.microphone.placeholder")
          }
          isDisabled={
            isUpdating("clamshell_microphone") ||
            isLoading ||
            audioDevices.length === 0
          }
        />
        <IconButton
          icon={<ResetIcon />}
          label={t("common.reset")}
          onClick={handleReset}
          isDisabled={isUpdating("clamshell_microphone") || isLoading}
          variant="ghost"
        />
      </HStack>
    </Field>
  );
});

ClamshellMicrophoneSelector.displayName = "ClamshellMicrophoneSelector";
