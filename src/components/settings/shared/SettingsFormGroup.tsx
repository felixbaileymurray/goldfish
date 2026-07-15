import React from "react";
import { VStack, Heading, FormLayout } from "@astryxdesign/core";

interface SettingsFormGroupProps {
  title?: string;
  children: React.ReactNode;
}

export const SettingsFormGroup: React.FC<SettingsFormGroupProps> = ({
  title,
  children,
}) => (
  <VStack gap={3}>
    {title && <Heading level={3}>{title}</Heading>}
    <FormLayout direction="vertical">{children}</FormLayout>
  </VStack>
);
