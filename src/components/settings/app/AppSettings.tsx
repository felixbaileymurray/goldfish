import React from "react";
import { useTranslation } from "react-i18next";
import { SettingsPage } from "../shared/SettingsPage";
import { SettingsFormGroup } from "../shared/SettingsFormGroup";
import { StartHidden } from "../StartHidden";
import { AutostartToggle } from "../AutostartToggle";
import { ShowTrayIcon } from "../ShowTrayIcon";
import { UpdateChecksToggle } from "../UpdateChecksToggle";
import { ShowOverlay } from "../ShowOverlay";
import { ModelUnloadTimeoutSetting } from "../ModelUnloadTimeout";
import { AccelerationSelector } from "../AccelerationSelector";
import { ExperimentalToggle } from "../ExperimentalToggle";
import { KeyboardImplementationSelector } from "../debug/KeyboardImplementationSelector";
import { LazyStreamClose } from "../LazyStreamClose";
import { useSettings } from "../../../hooks/useSettings";

export const AppSettings: React.FC = () => {
  const { t } = useTranslation();
  const { getSetting } = useSettings();
  const experimentalEnabled = getSetting("experimental_enabled") || false;

  return (
    <SettingsPage
      title={t("settings.app.title")}
      description={t("settings.app.description")}
    >
      <SettingsFormGroup title={t("settings.app.startup.title")}>
        <StartHidden />
        <AutostartToggle />
        <ShowTrayIcon />
        <UpdateChecksToggle />
      </SettingsFormGroup>

      <SettingsFormGroup title={t("settings.app.display.title")}>
        <ShowOverlay />
      </SettingsFormGroup>

      <SettingsFormGroup title={t("settings.app.performance.title")}>
        <ModelUnloadTimeoutSetting />
        <AccelerationSelector />
      </SettingsFormGroup>

      <SettingsFormGroup title={t("settings.app.experimental.title")}>
        <ExperimentalToggle />
        {experimentalEnabled && (
          <>
            <KeyboardImplementationSelector />
            <LazyStreamClose />
          </>
        )}
      </SettingsFormGroup>
    </SettingsPage>
  );
};
