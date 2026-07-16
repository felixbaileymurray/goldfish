import React, { useId } from "react";
import { useTranslation } from "react-i18next";
import { useSettings } from "../../hooks/useSettings";
import { Field, HStack, TextInput } from "@astryxdesign/core";

export const HistoryLimit: React.FC = () => {
  const { t } = useTranslation();
  const inputID = useId();
  const { getSetting, updateSetting, isUpdating } = useSettings();

  const historyLimit = getSetting("history_limit") ?? 5;

  const handleChange = (val: string) => {
    const value = parseInt(val, 10);
    if (!isNaN(value) && value >= 0) {
      updateSetting("history_limit", value);
    }
  };

  return (
    <Field
      label={t("settings.debug.historyLimit.title")}
      labelTooltip={t("settings.debug.historyLimit.description")}
      inputID={inputID}
      width="100%"
    >
      <HStack gap={2}>
        <TextInput
          label={t("settings.debug.historyLimit.title")}
          isLabelHidden
          value={String(historyLimit)}
          onChange={handleChange}
          isDisabled={isUpdating("history_limit")}
          className="w-20"
        />
        <span className="text-sm text-primary">
          {t("settings.debug.historyLimit.entries")}
        </span>
      </HStack>
    </Field>
  );
};
