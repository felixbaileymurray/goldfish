import React, { useState, useEffect, useId } from "react";
import { useTranslation } from "react-i18next";
import { commands } from "@/bindings";
import { Field, Skeleton } from "@astryxdesign/core";
import { PathDisplay } from "../ui/PathDisplay";

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
        <PathDisplay
          path={appDirPath}
          onOpen={handleOpen}
          disabled={!appDirPath}
        />
      )}
    </Field>
  );
};
