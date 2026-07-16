import React, { useState, useEffect, useId } from "react";
import { useTranslation } from "react-i18next";
import { commands } from "@/bindings";
import { Button, Field, Skeleton } from "@astryxdesign/core";

export const AppDataDirectory: React.FC = () => {
  const { t } = useTranslation();
  const inputID = useId();
  const [appDirPath, setAppDirPath] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAppDirectory = async () => {
      try {
        const result = await commands.getAppDirPath();
        if (result.status === "ok") {
          setAppDirPath(result.data);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load app directory",
        );
      } finally {
        setLoading(false);
      }
    };

    loadAppDirectory();
  }, []);

  const handleOpen = async () => {
    if (!appDirPath) return;
    try {
      await commands.openAppDataDir();
    } catch (openError) {
      console.error("Failed to open app data directory:", openError);
    }
  };

  return (
    <Field
      label={t("settings.about.appDataDirectory.title")}
      description={t("settings.about.appDataDirectory.description")}
      inputID={inputID}
      width="100%"
      status={
        error
          ? { type: "error", message: t("errors.loadDirectory", { error }) }
          : undefined
      }
    >
      {loading ? (
        <Skeleton height={36} />
      ) : (
        <div className="flex items-center gap-2">
          <div className="flex-1 min-w-0 px-2 py-2 bg-muted border border-border rounded-lg text-xs font-mono break-all select-text cursor-text">
            {appDirPath}
          </div>
          <Button
            label={t("common.open")}
            onClick={handleOpen}
            variant="secondary"
            size="sm"
            isDisabled={!appDirPath}
          />
        </div>
      )}
    </Field>
  );
};
