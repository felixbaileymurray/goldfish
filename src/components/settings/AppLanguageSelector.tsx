import React from "react";
import { useTranslation } from "react-i18next";
import { Selector } from "@astryxdesign/core";
import { SUPPORTED_LANGUAGES, type SupportedLanguageCode } from "../../i18n";
import { useSettings } from "@/hooks/useSettings";

export const AppLanguageSelector: React.FC = React.memo(() => {
  const { t, i18n } = useTranslation();
  const { settings, updateSetting } = useSettings();

  const currentLanguage = (settings?.app_language ||
    i18n.language) as SupportedLanguageCode;

  const languageOptions = SUPPORTED_LANGUAGES.map((lang) => ({
    value: lang.code,
    label: `${lang.nativeName} (${lang.name})`,
  }));

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
    updateSetting("app_language", langCode);
  };

  return (
    <Selector
      label={t("appLanguage.title")}
      description={t("appLanguage.description")}
      options={languageOptions}
      value={currentLanguage}
      onChange={handleLanguageChange}
      width="100%"
    />
  );
});

AppLanguageSelector.displayName = "AppLanguageSelector";
