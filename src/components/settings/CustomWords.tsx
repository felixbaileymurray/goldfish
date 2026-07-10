import React, { useId, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useSettings } from "../../hooks/useSettings";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { Field, HStack, Token } from "@astryxdesign/core";

export const CustomWords: React.FC = React.memo(() => {
  const { t } = useTranslation();
  const inputID = useId();
  const { getSetting, updateSetting, isUpdating } = useSettings();
  const [newWord, setNewWord] = useState("");
  const customWords = getSetting("custom_words") || [];

  const handleAddWord = () => {
    const trimmedWord = newWord.trim();
    const sanitizedWord = trimmedWord.replace(/[<>"'&]/g, "");
    if (
      sanitizedWord &&
      !sanitizedWord.includes(" ") &&
      sanitizedWord.length <= 50
    ) {
      if (customWords.includes(sanitizedWord)) {
        toast.error(
          t("settings.advanced.customWords.duplicate", {
            word: sanitizedWord,
          }),
        );
        return;
      }
      updateSetting("custom_words", [...customWords, sanitizedWord]);
      setNewWord("");
    }
  };

  const handleRemoveWord = (wordToRemove: string) => {
    updateSetting(
      "custom_words",
      customWords.filter((word) => word !== wordToRemove),
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddWord();
    }
  };

  return (
    <Field
      label={t("settings.advanced.customWords.title")}
      description={t("settings.advanced.customWords.description")}
      inputID={inputID}
      width="100%"
    >
      <HStack gap={2}>
        <Input
          type="text"
          className="max-w-40"
          value={newWord}
          onChange={(e) => setNewWord(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder={t("settings.advanced.customWords.placeholder")}
          variant="compact"
          disabled={isUpdating("custom_words")}
        />
        <Button
          onClick={handleAddWord}
          disabled={
            !newWord.trim() ||
            newWord.includes(" ") ||
            newWord.trim().length > 50 ||
            isUpdating("custom_words")
          }
          variant="primary"
          size="md"
        >
          {t("settings.advanced.customWords.add")}
        </Button>
      </HStack>
      {customWords.length > 0 && (
        <HStack gap={1} wrap="wrap">
          {customWords.map((word) => (
            <Token
              key={word}
              label={word}
              onRemove={() => handleRemoveWord(word)}
              isDisabled={isUpdating("custom_words")}
            />
          ))}
        </HStack>
      )}
    </Field>
  );
});
