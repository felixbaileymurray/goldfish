import React from "react";
import { VStack, Heading, Text } from "@astryxdesign/core";

interface SettingsPageProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  title,
  description,
  children,
}) => (
  // Center relies on flex alignment to self-center, which only works if an
  // ancestor stretches it to a definite width first. The settings panel's
  // outer container uses align-items: center (shrink-to-fit), so Center
  // collapsed to its content's width instead of a stable 768px column —
  // most visible on the Transcription page, where content width swings
  // depending on which model is active. width: 100% + margin-inline: auto
  // is the same technique Astryx's own Layout.contentWidth uses, and it
  // centers reliably regardless of the parent's alignment behavior.
  <VStack gap={6} width="100%" maxWidth={768} style={{ marginInline: "auto" }}>
    <VStack gap={2}>
      <Heading level={2}>{title}</Heading>
      <Text type="supporting">{description}</Text>
    </VStack>
    {children}
  </VStack>
);
