import React, { useId } from "react";
import { useTranslation } from "react-i18next";
import { Field, HStack } from "@astryxdesign/core";
import { Dropdown } from "../ui/Dropdown";
import { ResetButton } from "../ui/ResetButton";
import { useSettings } from "../../hooks/useSettings";
import type { AudioDevice } from "@/bindings";

interface OutputDeviceSelectorProps {
  disabled?: boolean;
}

export const OutputDeviceSelector: React.FC<OutputDeviceSelectorProps> =
  React.memo(({ disabled = false }) => {
    const { t } = useTranslation();
    const inputID = useId();
    const {
      getSetting,
      updateSetting,
      resetSetting,
      isUpdating,
      isLoading,
      outputDevices,
      refreshOutputDevices,
    } = useSettings();

    const selectedOutputDevice =
      getSetting("selected_output_device") === "default"
        ? "Default"
        : getSetting("selected_output_device") || "Default";

    const handleOutputDeviceSelect = async (deviceName: string) => {
      await updateSetting("selected_output_device", deviceName);
    };

    const handleReset = async () => {
      await resetSetting("selected_output_device");
    };

    const outputDeviceOptions = outputDevices.map((device: AudioDevice) => ({
      value: device.name,
      label: device.name,
    }));

    return (
      <Field
        label={t("settings.sound.outputDevice.title")}
        description={t("settings.sound.outputDevice.description")}
        inputID={inputID}
        isDisabled={disabled}
        width="100%"
      >
        <HStack gap={1}>
          <Dropdown
            options={outputDeviceOptions}
            selectedValue={selectedOutputDevice}
            onSelect={handleOutputDeviceSelect}
            placeholder={
              isLoading || outputDevices.length === 0
                ? t("settings.sound.outputDevice.loading")
                : t("settings.sound.outputDevice.placeholder")
            }
            disabled={
              disabled ||
              isUpdating("selected_output_device") ||
              isLoading ||
              outputDevices.length === 0
            }
            onRefresh={refreshOutputDevices}
          />
          <ResetButton
            onClick={handleReset}
            disabled={
              disabled || isUpdating("selected_output_device") || isLoading
            }
          />
        </HStack>
      </Field>
    );
  });
