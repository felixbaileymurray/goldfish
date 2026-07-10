import React, { useState, useEffect, useId } from "react";
import { useTranslation } from "react-i18next";
import { getVersion } from "@tauri-apps/api/app";
import { openUrl } from "@tauri-apps/plugin-opener";
import { Button, Code, Field, HStack, Text } from "@astryxdesign/core";
import { SettingsPage } from "../shared/SettingsPage";
import { SettingsFormGroup } from "../shared/SettingsFormGroup";
import { AppDataDirectory } from "../AppDataDirectory";
import { AppLanguageSelector } from "../AppLanguageSelector";
import { LogDirectory } from "../debug";
import UpdateChecker from "../../update-checker";

export const AboutSettings: React.FC = () => {
  const { t } = useTranslation();
  const [version, setVersion] = useState("");
  const versionInputID = useId();
  const supportInputID = useId();
  const sourceInputID = useId();
  const whisperInputID = useId();
  const handyInputID = useId();

  useEffect(() => {
    const fetchVersion = async () => {
      try {
        const appVersion = await getVersion();
        setVersion(appVersion);
      } catch (error) {
        console.error("Failed to get app version:", error);
        setVersion("0.1.2");
      }
    };

    fetchVersion();
  }, []);

  const handleDonateClick = async () => {
    try {
      await openUrl("https://handy.computer/donate");
    } catch (error) {
      console.error("Failed to open donate link:", error);
    }
  };

  return (
    <SettingsPage
      title={t("settings.about.title")}
      description={t("settings.about.description")}
    >
      <SettingsFormGroup>
        <AppLanguageSelector />

        <Field
          label={t("settings.about.version.title")}
          description={t("settings.about.version.description")}
          inputID={versionInputID}
          width="100%"
        >
          <HStack gap={3} align="center">
            {/* eslint-disable-next-line i18next/no-literal-string */}
            <Code>v{version}</Code>
            <UpdateChecker />
          </HStack>
        </Field>

        <Field
          label={t("settings.about.supportDevelopment.title")}
          description={t("settings.about.supportDevelopment.description")}
          inputID={supportInputID}
          width="100%"
        >
          <Button
            label={t("settings.about.supportDevelopment.button")}
            variant="primary"
            onClick={handleDonateClick}
          />
        </Field>

        <Field
          label={t("settings.about.sourceCode.title")}
          description={t("settings.about.sourceCode.description")}
          inputID={sourceInputID}
          width="100%"
        >
          <Button
            label={t("settings.about.sourceCode.button")}
            variant="secondary"
            onClick={() =>
              openUrl("https://github.com/felixbaileymurray/goldfish")
            }
          />
        </Field>

        <AppDataDirectory />
        <LogDirectory />
      </SettingsFormGroup>

      <SettingsFormGroup title={t("settings.about.acknowledgments.title")}>
        <Field
          label={t("settings.about.acknowledgments.whisper.title")}
          description={t("settings.about.acknowledgments.whisper.description")}
          inputID={whisperInputID}
          width="100%"
        >
          <Text size="sm" color="secondary">
            {t("settings.about.acknowledgments.whisper.details")}
          </Text>
        </Field>
        <Field
          label="Handy"
          description="Goldfish is built on Handy, the open-source speech-to-text app by cjpais."
          inputID={handyInputID}
          width="100%"
        >
          <Button
            label="View upstream"
            variant="secondary"
            onClick={() => openUrl("https://github.com/cjpais/Handy")}
          />
        </Field>
      </SettingsFormGroup>
    </SettingsPage>
  );
};
