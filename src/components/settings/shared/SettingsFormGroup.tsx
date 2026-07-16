import React from "react";
import { VStack, Heading, FormLayout, Section } from "@astryxdesign/core";

interface SettingsFormGroupProps {
  title?: string;
  children: React.ReactNode;
}

export const SettingsFormGroup: React.FC<SettingsFormGroupProps> = ({
  title,
  children,
}) => (
  <Section variant="transparent" padding={4}>
    <VStack gap={3}>
      {title && <Heading level={3}>{title}</Heading>}
      <FormLayout direction="vertical">{children}</FormLayout>
    </VStack>
  </Section>
);
