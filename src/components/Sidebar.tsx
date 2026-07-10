import React from "react";
import { useTranslation } from "react-i18next";
import { Cog, List } from "lucide-react";
import { SideNav, SideNavItem } from "@astryxdesign/core/SideNav";
import GoldfishTextLogo from "./icons/GoldfishTextLogo";

export type AppView = "main" | "settings";

interface SidebarProps {
  view: AppView;
  onSelectEntries: () => void;
  onOpenSettings: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  view,
  onSelectEntries,
  onOpenSettings,
}) => {
  const { t } = useTranslation();

  const isEntriesActive = view === "main";
  const isSettingsActive = view === "settings";

  return (
    <SideNav
      className="shrink-0"
      style={{ width: 160 }}
      header={<GoldfishTextLogo width={120} className="mx-auto my-4 block" />}
      footerIcons={
        <SideNavItem
          label={t("sidebar.settings")}
          icon={<Cog width={18} height={18} />}
          isSelected={isSettingsActive}
          onClick={onOpenSettings}
        />
      }
    >
      <SideNavItem
        label={t("sidebar.entries")}
        icon={<List width={20} height={20} />}
        isSelected={isEntriesActive}
        onClick={onSelectEntries}
      />
    </SideNav>
  );
};
