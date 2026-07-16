import React from "react";
import { useTranslation } from "react-i18next";
import { Slider } from "@astryxdesign/core";
import { useSettings } from "../../hooks/useSettings";

export const VolumeSlider: React.FC<{ disabled?: boolean }> = ({
  disabled = false,
}) => {
  const { t } = useTranslation();
  const { getSetting, updateSetting } = useSettings();
  const audioFeedbackVolume = getSetting("audio_feedback_volume") ?? 0.5;

  return (
    <Slider
      value={audioFeedbackVolume}
      onChange={(value: number) =>
        updateSetting("audio_feedback_volume", value)
      }
      min={0}
      max={1}
      step={0.01}
      label={t("settings.sound.volume.title")}
      description={t("settings.sound.volume.description")}
      formatValue={(value) => `${Math.round(value * 100)}%`}
      valueDisplay="text"
      isDisabled={disabled}
      width="100%"
    />
  );
};
