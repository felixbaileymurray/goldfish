import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { TextInput } from "@astryxdesign/core";

interface ApiKeyFieldProps {
  value: string;
  onBlur: (value: string) => void;
  disabled: boolean;
  placeholder?: string;
  className?: string;
}

export const ApiKeyField: React.FC<ApiKeyFieldProps> = React.memo(
  ({ value, onBlur, disabled, placeholder, className = "" }) => {
    const { t } = useTranslation();
    const [localValue, setLocalValue] = useState(value);

    React.useEffect(() => {
      setLocalValue(value);
    }, [value]);

    return (
      <TextInput
        type="password"
        label={t("settings.postProcessing.api.apiKey.title")}
        isLabelHidden
        value={localValue}
        onChange={(val) => setLocalValue(val)}
        onBlur={() => onBlur(localValue)}
        placeholder={placeholder}
        isDisabled={disabled}
        className={`flex-1 min-w-[320px] ${className}`}
      />
    );
  },
);

ApiKeyField.displayName = "ApiKeyField";
