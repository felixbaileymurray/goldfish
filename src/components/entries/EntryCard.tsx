import { useCallback, useState } from "react";
import {
  AlertCircle,
  Check,
  Copy,
  RotateCcw,
  Sparkles,
  Square,
  Star,
  Trash2,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Card } from "@astryxdesign/core/Card";
import { HStack } from "@astryxdesign/core/HStack";
import { VStack } from "@astryxdesign/core/VStack";
import { Text } from "@astryxdesign/core/Text";
import { Badge } from "@astryxdesign/core/Badge";
import { Divider } from "@astryxdesign/core/Divider";
import { IconButton } from "@astryxdesign/core/IconButton";
import { Timestamp } from "@astryxdesign/core/Timestamp";
import { Collapsible } from "@astryxdesign/core/Collapsible";
import { type HistoryEntry } from "@/bindings";
import { AudioPlayer } from "../shared/AudioPlayer";

export interface EntryCardProps {
  entry: HistoryEntry;
  onToggleSaved: () => void;
  copyText: (text: string) => Promise<void>;
  getAudioUrl: (fileName: string) => Promise<string | null>;
  deleteAudio: (id: number) => Promise<void>;
  retryTranscription: (id: number) => Promise<void>;
  summarizeEntry: (id: number) => Promise<void>;
}

export const EntryCard: React.FC<EntryCardProps> = ({
  entry,
  onToggleSaved,
  copyText,
  getAudioUrl,
  deleteAudio,
  retryTranscription,
  summarizeEntry,
}) => {
  const { t } = useTranslation();
  const [showCopied, setShowCopied] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const [summarizing, setSummarizing] = useState(false);

  const hasTranscription = entry.transcription_text.trim().length > 0;
  const hasPostProcessed = Boolean(entry.post_processed_text?.trim());
  const hasSummary = Boolean(entry.summary?.trim());
  const summaryPending = entry.summary_status === "pending" || summarizing;
  const summaryFailed = entry.summary_status === "failed" && !summarizing;
  const hasActions = entry.actions.length > 0;

  const bodyText = entry.post_processed_text || entry.transcription_text;
  const hasBody = Boolean(bodyText?.trim());

  const handleLoadAudio = useCallback(
    () => getAudioUrl(entry.file_name),
    [getAudioUrl, entry.file_name],
  );

  const derivedTitle = (() => {
    if (entry.summary_title?.trim()) return entry.summary_title.trim();
    const source = entry.summary || bodyText;
    if (!source?.trim()) return entry.title;
    const firstSentence = source.match(/^[^.!?\n]+[.!?]?/)?.[0] ?? source;
    return firstSentence.length > 72
      ? firstSentence.slice(0, 69).trimEnd() + "…"
      : firstSentence.trim();
  })();

  const handleCopyText = async () => {
    const textToCopy = hasSummary ? entry.summary! : bodyText;
    if (!textToCopy.trim() || retrying) return;
    await copyText(textToCopy);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  const handleSummarize = async () => {
    try {
      setSummarizing(true);
      await summarizeEntry(entry.id);
    } catch (error) {
      console.error("Failed to summarise:", error);
      toast.error(t("entries.summarizeError"));
    } finally {
      setSummarizing(false);
    }
  };

  const handleDeleteEntry = async () => {
    try {
      await deleteAudio(entry.id);
    } catch (error) {
      console.error("Failed to delete entry:", error);
      toast.error(t("entries.deleteError"));
    }
  };

  const handleRetranscribe = async () => {
    try {
      setRetrying(true);
      await retryTranscription(entry.id);
    } catch (error) {
      console.error("Failed to re-transcribe:", error);
      toast.error(t("entries.retranscribeError"));
    } finally {
      setRetrying(false);
    }
  };

  const canCopy = (hasSummary || hasBody || hasTranscription) && !retrying;

  return (
    <Card variant="transparent" padding={4}>
      <VStack gap={2}>
        {/* Title + tools */}
        <HStack justify="between" align="start" gap={2}>
          <Text type="label" weight="semibold">
            {derivedTitle || t("entries.untitled")}
          </Text>
          <HStack gap={0.5} align="center">
            <IconButton
              label={t("entries.copyToClipboard")}
              onClick={handleCopyText}
              isDisabled={!canCopy}
              variant="ghost"
              size="sm"
              icon={
                showCopied ? (
                  <Check width={16} height={16} />
                ) : (
                  <Copy width={16} height={16} />
                )
              }
            />
            <IconButton
              label={entry.saved ? t("entries.unsave") : t("entries.save")}
              onClick={onToggleSaved}
              isDisabled={retrying}
              variant="ghost"
              size="sm"
              icon={
                <Star
                  width={16}
                  height={16}
                  fill={entry.saved ? "currentColor" : "none"}
                  color={entry.saved ? "var(--color-accent)" : undefined}
                />
              }
            />
            <IconButton
              label={t("entries.retranscribe")}
              onClick={handleRetranscribe}
              isDisabled={retrying}
              variant="ghost"
              size="sm"
              icon={
                <RotateCcw
                  width={16}
                  height={16}
                  className={retrying ? "animate-spin-reverse" : undefined}
                />
              }
            />
            <IconButton
              label={t("entries.delete")}
              onClick={handleDeleteEntry}
              isDisabled={retrying}
              variant="ghost"
              size="sm"
              icon={<Trash2 width={16} height={16} />}
            />
          </HStack>
        </HStack>

        {/* Metadata */}
        <Timestamp
          value={entry.timestamp}
          format="date_time"
          size="xsm"
          color="secondary"
        />

        {/* Main output */}
        {retrying ? (
          <Text size="sm" className="animate-transcribe-pulse">
            {t("entries.transcribing")}
          </Text>
        ) : hasSummary ? (
          <Text size="sm" wordBreak="break-word" className="select-text">
            {entry.summary}
          </Text>
        ) : summaryPending ? (
          <HStack gap={1.5} align="center" className="animate-summarize-pulse">
            <Sparkles width={14} height={14} />
            <Text size="sm">{t("entries.summarizing")}</Text>
          </HStack>
        ) : hasBody ? (
          <Text
            size="sm"
            color={hasPostProcessed ? "primary" : "secondary"}
            wordBreak="break-word"
            className="select-text"
          >
            {bodyText}
          </Text>
        ) : (
          <Text size="sm" color="disabled">
            {t("entries.transcriptionFailed")}
          </Text>
        )}

        {/* Actions checklist */}
        {hasActions && (
          <VStack gap={1.5}>
            {entry.actions.map((action, index) => (
              <HStack key={index} gap={2} align="start">
                <Square
                  width={14}
                  height={14}
                  className="mt-0.5 shrink-0"
                  color="var(--color-text-disabled)"
                />
                <HStack gap={1.5} align="center" wrap="wrap">
                  <Text size="sm" className="select-text">
                    {action.description}
                  </Text>
                  {action.assignee && (
                    <Badge variant="neutral" label={action.assignee} />
                  )}
                  {action.due && <Badge variant="neutral" label={action.due} />}
                </HStack>
              </HStack>
            ))}
          </VStack>
        )}

        {/* Summary failure / retry affordance */}
        {summaryFailed && (
          <button
            onClick={handleSummarize}
            title={t("entries.summarizeRetry")}
            className="flex w-fit items-center gap-1.5 cursor-pointer"
          >
            <AlertCircle width={13} height={13} />
            <Text size="xsm" color="secondary">
              {t("entries.summarizeFailed")}
            </Text>
          </button>
        )}

        {/* Details accordion */}
        <Collapsible
          defaultIsOpen={false}
          trigger={
            <Text size="xsm" color="secondary">
              {t("entries.viewDetails")}
            </Text>
          }
        >
          <VStack gap={3} className="pt-3">
            <Divider />
            {hasSummary && hasPostProcessed && (
              <VStack gap={1.5}>
                <Text
                  size="xsm"
                  weight="medium"
                  color="secondary"
                  className="uppercase tracking-wide"
                >
                  {t("entries.cleanedText")}
                </Text>
                <Text size="xsm" color="secondary" wordBreak="break-word">
                  {entry.post_processed_text}
                </Text>
              </VStack>
            )}
            <AudioPlayer onLoadRequest={handleLoadAudio} className="w-full" />
          </VStack>
        </Collapsible>
      </VStack>
    </Card>
  );
};
