import React from "react";
import { useTranslation } from "react-i18next";
import { SettingsPage } from "../shared/SettingsPage";
import { SettingsFormGroup } from "../shared/SettingsFormGroup";
import { MicrophoneSelector } from "../MicrophoneSelector";
import { MuteWhileRecording } from "../MuteWhileRecording";
import { AlwaysOnMicrophone } from "../AlwaysOnMicrophone";
import { ClamshellMicrophoneSelector } from "../ClamshellMicrophoneSelector";
import { AudioFeedback } from "../AudioFeedback";
import { SoundPicker } from "../SoundPicker";
import { OutputDeviceSelector } from "../OutputDeviceSelector";
import { VolumeSlider } from "../VolumeSlider";
import { useSettings } from "../../../hooks/useSettings";

export const CaptureSettings: React.FC = () => {
  const { t } = useTranslation();
  const { audioFeedbackEnabled } = useSettings();

  return (
    <SettingsPage
      title={t("settings.capture.title")}
      description={t("settings.capture.description")}
    >
      <SettingsFormGroup title={t("settings.capture.microphone.title")}>
        <MicrophoneSelector />
        <MuteWhileRecording />
        <AlwaysOnMicrophone />
        <ClamshellMicrophoneSelector />
      </SettingsFormGroup>

      <SettingsFormGroup title={t("settings.capture.audioFeedback.title")}>
        <AudioFeedback />
        <SoundPicker
          label={t("settings.debug.soundTheme.label")}
          description={t("settings.debug.soundTheme.description")}
        />
        <OutputDeviceSelector disabled={!audioFeedbackEnabled} />
        <VolumeSlider disabled={!audioFeedbackEnabled} />
      </SettingsFormGroup>
    </SettingsPage>
  );
};
