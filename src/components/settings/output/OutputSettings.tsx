import React from "react";
import { useTranslation } from "react-i18next";
import { SettingsPage } from "../shared/SettingsPage";
import { SettingsFormGroup } from "../shared/SettingsFormGroup";
import { PasteMethodSetting } from "../PasteMethod";
import { TypingToolSetting } from "../TypingTool";
import { ClipboardHandlingSetting } from "../ClipboardHandling";
import { AutoSubmit } from "../AutoSubmit";
import { CustomWords } from "../CustomWords";
import { AppendTrailingSpace } from "../AppendTrailingSpace";

export const OutputSettings: React.FC = () => {
  const { t } = useTranslation();

  return (
    <SettingsPage
      title={t("settings.output.title")}
      description={t("settings.output.description")}
    >
      <SettingsFormGroup title={t("settings.output.pasting.title")}>
        <PasteMethodSetting />
        <TypingToolSetting />
        <ClipboardHandlingSetting />
        <AutoSubmit />
      </SettingsFormGroup>

      <SettingsFormGroup title={t("settings.output.quality.title")}>
        <CustomWords />
        <AppendTrailingSpace />
      </SettingsFormGroup>
    </SettingsPage>
  );
};
