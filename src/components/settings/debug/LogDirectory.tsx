import React, { useEffect, useId, useState } from "react";
import { useTranslation } from "react-i18next";
import { commands } from "@/bindings";
import { Field, Skeleton } from "@astryxdesign/core";
import { PathDisplay } from "../../ui/PathDisplay";

export const LogDirectory: React.FC = () => {
  const { t } = useTranslation();
  const inputID = useId();
  const [logDir, setLogDir] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadLogDirectory = async () => {
      try {
        const result = await commands.getLogDirPath();
        if (result.status === "ok") {
          setLogDir(result.data);
        } else {
          setError(result.error);
        }
      } catch (err) {
        const errorMessage =
          err && typeof err === "object" && "message" in err
            ? String(err.message)
            : "Failed to load log directory";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadLogDirectory();
  }, []);

  const handleOpen = async () => {
    if (!logDir) return;
    try {
      await commands.openLogDir();
    } catch (openError) {
      console.error("Failed to open log directory:", openError);
    }
  };

  return (
    <Field
      label={t("settings.debug.logDirectory.title")}
      description={t("settings.debug.logDirectory.description")}
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
        <PathDisplay path={logDir} onOpen={handleOpen} disabled={!logDir} />
      )}
    </Field>
  );
};
