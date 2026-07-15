import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronLeft } from "lucide-react";
import {
  Layout,
  LayoutHeader,
  LayoutContent,
  LayoutPanel,
  HStack,
  Heading,
  IconButton,
} from "@astryxdesign/core";
import {
  SideNav,
  SideNavSection,
  SideNavItem,
} from "@astryxdesign/core/SideNav";
import { useSettings } from "../../hooks/useSettings";
import {
  SETTINGS_SECTIONS,
  SETTINGS_GROUP_ORDER,
  SETTINGS_GROUP_LABEL_KEYS,
  type SettingsSection,
  type SettingsGroup,
} from "./sections";

interface SettingsPanelProps {
  onBack: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ onBack }) => {
  const { t } = useTranslation();
  const { settings } = useSettings();
  const [activeSection, setActiveSection] =
    useState<SettingsSection>("shortcuts");

  const availableSections = Object.entries(SETTINGS_SECTIONS)
    .filter(([_, config]) => config.enabled(settings))
    .map(([id, config]) => ({ id: id as SettingsSection, ...config }));

  // If the active section becomes unavailable (e.g. debug toggled off), fall
  // back to shortcuts so we never render an empty panel.
  const resolvedSection = availableSections.some((s) => s.id === activeSection)
    ? activeSection
    : "shortcuts";
  const ActiveComponent = SETTINGS_SECTIONS[resolvedSection].component;

  const sectionsByGroup = SETTINGS_GROUP_ORDER.reduce<
    Record<SettingsGroup, typeof availableSections>
  >(
    (acc, group) => {
      acc[group] = availableSections.filter((s) => s.group === group);
      return acc;
    },
    { capture: [], dictate: [], keep: [], app: [] },
  );

  return (
    <Layout
      header={
        <LayoutHeader hasDivider>
          <HStack gap={2} vAlign="center">
            <IconButton
              icon={<ChevronLeft width={18} height={18} />}
              label={t("settings.back")}
              onClick={onBack}
              variant="ghost"
            />
            <Heading level={1}>{t("sidebar.settings")}</Heading>
          </HStack>
        </LayoutHeader>
      }
      start={
        <LayoutPanel hasDivider width={192}>
          <SideNav style={{ width: "100%" }}>
            {SETTINGS_GROUP_ORDER.map((group) => {
              const sections = sectionsByGroup[group];
              if (sections.length === 0) return null;
              return (
                <SideNavSection
                  key={group}
                  title={t(SETTINGS_GROUP_LABEL_KEYS[group])}
                >
                  {sections.map((section) => {
                    const Icon = section.icon;
                    return (
                      <SideNavItem
                        key={section.id}
                        label={t(section.labelKey)}
                        icon={<Icon width={20} height={20} />}
                        isSelected={resolvedSection === section.id}
                        onClick={() => setActiveSection(section.id)}
                      />
                    );
                  })}
                </SideNavSection>
              );
            })}
          </SideNav>
        </LayoutPanel>
      }
      content={
        <LayoutContent>
          <ActiveComponent />
        </LayoutContent>
      }
    />
  );
};
