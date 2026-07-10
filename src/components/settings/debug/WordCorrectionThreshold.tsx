import React from "react";
import { useTranslation } from "react-i18next";
import { Slider } from "@astryxdesign/core";
import { useSettings } from "../../../hooks/useSettings";

export const WordCorrectionThreshold: React.FC = () => {
  const { t } = useTranslation();
  const { settings, updateSetting } = useSettings();

  const handleThresholdChange = (value: number) => {
    updateSetting("word_correction_threshold", value);
  };

  return (
    <Slider
      value={settings?.word_correction_threshold ?? 0.18}
      onChange={handleThresholdChange}
      min={0.0}
      max={1.0}
      label={t("settings.debug.wordCorrectionThreshold.title")}
      description={t("settings.debug.wordCorrectionThreshold.description")}
      formatValue={(v) => v.toFixed(2)}
      valueDisplay="text"
      width="100%"
    />
  );
};
