import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { TextInput } from "@astryxdesign/core";

interface BaseUrlFieldProps {
  value: string;
  onBlur: (value: string) => void;
  disabled: boolean;
  placeholder?: string;
  className?: string;
}

export const BaseUrlField: React.FC<BaseUrlFieldProps> = React.memo(
  ({ value, onBlur, disabled, placeholder, className = "" }) => {
    const { t } = useTranslation();
    const [localValue, setLocalValue] = useState(value);

    React.useEffect(() => {
      setLocalValue(value);
    }, [value]);

    return (
      <TextInput
        type="text"
        label={t("settings.postProcessing.api.baseUrl.title")}
        isLabelHidden
        value={localValue}
        onChange={(val) => setLocalValue(val)}
        onBlur={() => onBlur(localValue)}
        placeholder={placeholder}
        isDisabled={disabled}
        className={`flex-1 min-w-[360px] ${className}`}
      />
    );
  },
);

BaseUrlField.displayName = "BaseUrlField";
