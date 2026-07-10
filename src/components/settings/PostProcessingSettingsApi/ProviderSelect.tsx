import React from "react";
import { Selector } from "@astryxdesign/core";

interface ProviderSelectProps {
  options: Array<{ value: string; label: string }>;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const ProviderSelect: React.FC<ProviderSelectProps> = React.memo(
  ({ options, value, onChange, disabled }) => {
    return (
      <Selector
        label="Provider"
        isLabelHidden
        options={options}
        value={value}
        onChange={onChange}
        isDisabled={disabled}
      />
    );
  },
);

ProviderSelect.displayName = "ProviderSelect";
