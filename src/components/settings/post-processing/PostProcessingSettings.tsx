import React, { useId } from "react";
import { useTranslation } from "react-i18next";
import { RefreshCcw } from "lucide-react";

import { Banner } from "@astryxdesign/core/Banner";
import { Field, HStack, IconButton, Switch } from "@astryxdesign/core";

import { ProviderSelect } from "../PostProcessingSettingsApi/ProviderSelect";
import { BaseUrlField } from "../PostProcessingSettingsApi/BaseUrlField";
import { ApiKeyField } from "../PostProcessingSettingsApi/ApiKeyField";
import { ModelSelect } from "../PostProcessingSettingsApi/ModelSelect";
import { usePostProcessProviderState } from "../PostProcessingSettingsApi/usePostProcessProviderState";
import { useSettings } from "../../../hooks/useSettings";
import { SettingsPage } from "../shared/SettingsPage";
import { SettingsFormGroup } from "../shared/SettingsFormGroup";

const PostProcessingSettingsApiComponent: React.FC = () => {
  const { t } = useTranslation();
  const state = usePostProcessProviderState();
  const providerFieldID = useId();
  const baseUrlFieldID = useId();
  const apiKeyFieldID = useId();
  const modelFieldID = useId();

  return (
    <>
      <Field
        label={t("settings.postProcessing.api.provider.title")}
        description={t("settings.postProcessing.api.provider.description")}
        inputID={providerFieldID}
        width="100%"
      >
        <ProviderSelect
          options={state.providerOptions}
          value={state.selectedProviderId}
          onChange={state.handleProviderSelect}
        />
      </Field>

      {state.isAppleProvider ? (
        state.appleIntelligenceUnavailable ? (
          <Banner
            status="error"
            title={t(
              "settings.postProcessing.api.appleIntelligence.unavailable",
            )}
          />
        ) : null
      ) : (
        <>
          {state.selectedProvider?.id === "custom" && (
            <Field
              label={t("settings.postProcessing.api.baseUrl.title")}
              description={t("settings.postProcessing.api.baseUrl.description")}
              inputID={baseUrlFieldID}
              width="100%"
            >
              <BaseUrlField
                value={state.baseUrl}
                onBlur={state.handleBaseUrlChange}
                placeholder={t(
                  "settings.postProcessing.api.baseUrl.placeholder",
                )}
                disabled={state.isBaseUrlUpdating}
                className="min-w-95"
              />
            </Field>
          )}

          <Field
            label={t("settings.postProcessing.api.apiKey.title")}
            description={t("settings.postProcessing.api.apiKey.description")}
            inputID={apiKeyFieldID}
            width="100%"
          >
            <ApiKeyField
              value={state.apiKey}
              onBlur={state.handleApiKeyChange}
              placeholder={t("settings.postProcessing.api.apiKey.placeholder")}
              disabled={state.isApiKeyUpdating}
              className="min-w-80"
            />
          </Field>
        </>
      )}

      {!state.isAppleProvider && (
        <Field
          label={t("settings.postProcessing.api.model.title")}
          description={
            state.isCustomProvider
              ? t("settings.postProcessing.api.model.descriptionCustom")
              : t("settings.postProcessing.api.model.descriptionDefault")
          }
          inputID={modelFieldID}
          width="100%"
        >
          <HStack gap={2}>
            <ModelSelect
              value={state.model}
              options={state.modelOptions}
              isDisabled={state.isModelUpdating}
              placeholder={
                state.modelOptions.length > 0
                  ? t(
                      "settings.postProcessing.api.model.placeholderWithOptions",
                    )
                  : t("settings.postProcessing.api.model.placeholderNoOptions")
              }
              onSelect={state.handleModelSelect}
              onCreate={state.handleModelCreate}
              className="flex-1 min-w-95"
            />
            <IconButton
              icon={
                <RefreshCcw
                  className={`h-4 w-4 ${state.isFetchingModels ? "animate-spin" : ""}`}
                />
              }
              label={t("settings.postProcessing.api.model.refreshModels")}
              onClick={state.handleRefreshModels}
              isDisabled={state.isFetchingModels}
              variant="ghost"
            />
          </HStack>
        </Field>
      )}
    </>
  );
};

export const PostProcessingSettingsApi = React.memo(
  PostProcessingSettingsApiComponent,
);
PostProcessingSettingsApi.displayName = "PostProcessingSettingsApi";

// Order matches the assembled prompt in settings.rs::build_default_clean_prompt
const CLEANUP_TOGGLES = [
  { setting: "clean_spoken_corrections", key: "spokenCorrections" },
  { setting: "clean_filler_removal", key: "fillerRemoval" },
  { setting: "clean_numbers", key: "numbers" },
  { setting: "clean_formatting", key: "formatting" },
] as const;

export const PostProcessingSettings: React.FC = () => {
  const { t } = useTranslation();
  const { getSetting, updateSetting, isUpdating } = useSettings();

  return (
    <SettingsPage
      title={t("settings.postProcessing.title")}
      description={t("settings.postProcessing.description")}
    >
      <SettingsFormGroup title={t("settings.postProcessing.api.title")}>
        <PostProcessingSettingsApi />
      </SettingsFormGroup>

      <SettingsFormGroup title={t("settings.postProcessing.cleanup.title")}>
        {CLEANUP_TOGGLES.map(({ setting, key }) => (
          <Switch
            key={setting}
            value={getSetting(setting) ?? true}
            onChange={(value) => updateSetting(setting, value)}
            isLoading={isUpdating(setting)}
            label={t(`settings.postProcessing.cleanup.${key}.label`)}
            description={t(
              `settings.postProcessing.cleanup.${key}.description`,
            )}
            labelPosition="start"
            labelSpacing="spread"
            width="100%"
          />
        ))}
      </SettingsFormGroup>
    </SettingsPage>
  );
};
