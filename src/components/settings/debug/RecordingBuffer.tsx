import React from "react";
import { useTranslation } from "react-i18next";
import { Slider } from "@astryxdesign/core";
import { useSettings } from "../../../hooks/useSettings";

export const RecordingBuffer: React.FC = () => {
  const { t } = useTranslation();
  const { settings, updateSetting } = useSettings();

  const handleBufferChange = (value: number) => {
    updateSetting("extra_recording_buffer_ms", value);
  };

  return (
    <Slider
      value={settings?.extra_recording_buffer_ms ?? 0}
      onChange={handleBufferChange}
      min={0}
      max={1500}
      step={50}
      label={t("settings.debug.recordingBuffer.title")}
      description={t("settings.debug.recordingBuffer.description")}
      formatValue={(v) => `${v}ms`}
      valueDisplay="text"
      width="100%"
    />
  );
};
