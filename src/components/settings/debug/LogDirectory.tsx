import React, { useEffect, useId, useState } from "react";
import { useTranslation } from "react-i18next";
import { commands } from "@/bindings";
import { Button, Field, Skeleton } from "@astryxdesign/core";

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
        <div className="flex items-center gap-2">
          <div className="flex-1 min-w-0 px-2 py-2 bg-mid-gray/10 border border-mid-gray/80 rounded-lg text-xs font-mono break-all select-text cursor-text">
            {logDir}
          </div>
          <Button
            label={t("common.open")}
            onClick={handleOpen}
            variant="secondary"
            size="sm"
            isDisabled={!logDir}
          />
        </div>
      )}
    </Field>
  );
};
