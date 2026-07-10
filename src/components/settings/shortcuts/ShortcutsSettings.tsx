import React from "react";
import { useTranslation } from "react-i18next";
import { type } from "@tauri-apps/plugin-os";
import { SettingsPage } from "../shared/SettingsPage";
import { SettingsFormGroup } from "../shared/SettingsFormGroup";
import { ShortcutInput } from "../ShortcutInput";
import { PushToTalk } from "../PushToTalk";
import { useSettings } from "../../../hooks/useSettings";

export const ShortcutsSettings: React.FC = () => {
  const { t } = useTranslation();
  const { getSetting } = useSettings();
  const pushToTalk = getSetting("push_to_talk");
  const isLinux = type() === "linux";

  return (
    <SettingsPage
      title={t("settings.shortcuts.title")}
      description={t("settings.shortcuts.description")}
    >
      <SettingsFormGroup>
        <ShortcutInput shortcutId="transcribe" />
        <PushToTalk />
        {!isLinux && !pushToTalk && <ShortcutInput shortcutId="cancel" />}
        <ShortcutInput shortcutId="transcribe_with_post_process" />
      </SettingsFormGroup>
    </SettingsPage>
  );
};
