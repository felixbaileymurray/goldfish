import React from "react";
import { VStack, Text, FormLayout } from "@astryxdesign/core";

interface SettingsFormGroupProps {
  title?: string;
  children: React.ReactNode;
}

export const SettingsFormGroup: React.FC<SettingsFormGroupProps> = ({
  title,
  children,
}) => (
  <VStack gap={3}>
    {title && (
      <Text type="label" color="secondary">
        {title}
      </Text>
    )}
    <FormLayout direction="vertical">{children}</FormLayout>
  </VStack>
);
