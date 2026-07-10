import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Selector } from "@astryxdesign/core";
import { useSettings } from "../../hooks/useSettings";
import { useOsType } from "../../hooks/useOsType";
import { commands } from "@/bindings";
import type { TypingTool } from "@/bindings";

const allToolLabels: Record<string, string> = {
  wtype: "wtype",
  kwtype: "kwtype",
  dotool: "dotool",
  ydotool: "ydotool",
  xdotool: "xdotool",
};

export const TypingToolSetting: React.FC = React.memo(() => {
  const { t } = useTranslation();
  const { getSetting, updateSetting, isUpdating } = useSettings();
  const osType = useOsType();
  const [availableTools, setAvailableTools] = useState<string[] | null>(null);

  useEffect(() => {
    if (osType !== "linux") return;
    commands
      .getAvailableTypingTools()
      .then(setAvailableTools)
      .catch(() => {
        setAvailableTools(["auto"]);
      });
  }, [osType]);

  // Only show this setting on Linux
  if (osType !== "linux") {
    return null;
  }

  // Only show if paste method is "direct"
  const pasteMethod = getSetting("paste_method");
  if (pasteMethod !== "direct") {
    return null;
  }

  const tools = availableTools ?? ["auto"];
  const typingToolOptions = tools.map((tool) =>
    tool === "auto"
      ? {
          value: "auto",
          label: t("settings.advanced.typingTool.options.auto"),
        }
      : { value: tool, label: allToolLabels[tool] ?? tool },
  );

  const selectedTool = (getSetting("typing_tool") || "auto") as TypingTool;

  return (
    <Selector
      label={t("settings.advanced.typingTool.title")}
      description={t("settings.advanced.typingTool.description")}
      options={typingToolOptions}
      value={selectedTool}
      onChange={(value) => updateSetting("typing_tool", value as TypingTool)}
      isDisabled={isUpdating("typing_tool")}
      width="100%"
    />
  );
});
