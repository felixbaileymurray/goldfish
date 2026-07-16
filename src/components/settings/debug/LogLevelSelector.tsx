import React from "react";
import { useTranslation } from "react-i18next";
import { Selector } from "@astryxdesign/core";
import { useSettings } from "../../../hooks/useSettings";
import type { LogLevel } from "../../../bindings";

const LOG_LEVEL_OPTIONS = [
  { value: "error", label: "Error" },
  { value: "warn", label: "Warn" },
  { value: "info", label: "Info" },
  { value: "debug", label: "Debug" },
  { value: "trace", label: "Trace" },
];

export const LogLevelSelector: React.FC = () => {
  const { t } = useTranslation();
  const { settings, updateSetting, isUpdating } = useSettings();
  const currentLevel = settings?.log_level ?? "debug";

  const handleSelect = async (value: string) => {
    if (value === currentLevel) return;

    try {
      await updateSetting("log_level", value as LogLevel);
    } catch (error) {
      console.error("Failed to update log level:", error);
    }
  };

  return (
    <Selector
      label={t("settings.debug.logLevel.title")}
      description={t("settings.debug.logLevel.description")}
      options={LOG_LEVEL_OPTIONS}
      value={currentLevel}
      onChange={handleSelect}
      isDisabled={!settings || isUpdating("log_level")}
      width="100%"
    />
  );
};
