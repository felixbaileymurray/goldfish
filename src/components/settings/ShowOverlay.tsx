import React, { useId } from "react";
import { useTranslation } from "react-i18next";
import { Dropdown } from "../ui/Dropdown";
import { Field } from "@astryxdesign/core";
import { useSettings } from "../../hooks/useSettings";
import type { OverlayPosition } from "@/bindings";

export const ShowOverlay: React.FC = React.memo(() => {
  const { t } = useTranslation();
  const inputID = useId();
  const { getSetting, updateSetting, isUpdating } = useSettings();

  const overlayOptions = [
    { value: "none", label: t("settings.advanced.overlay.options.none") },
    { value: "bottom", label: t("settings.advanced.overlay.options.bottom") },
    { value: "top", label: t("settings.advanced.overlay.options.top") },
  ];

  const selectedPosition = (getSetting("overlay_position") ||
    "bottom") as OverlayPosition;

  return (
    <Field
      label={t("settings.advanced.overlay.title")}
      description={t("settings.advanced.overlay.description")}
      inputID={inputID}
      width="100%"
    >
      <Dropdown
        options={overlayOptions}
        selectedValue={selectedPosition}
        onSelect={(value) =>
          updateSetting("overlay_position", value as OverlayPosition)
        }
        disabled={isUpdating("overlay_position")}
      />
    </Field>
  );
});
