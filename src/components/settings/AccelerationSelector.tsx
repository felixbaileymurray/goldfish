import { type FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Selector } from "@astryxdesign/core";
import { useSettings } from "../../hooks/useSettings";
import { commands } from "@/bindings";
import type {
  WhisperAcceleratorSetting,
  OrtAcceleratorSetting,
} from "@/bindings";

const ORT_LABELS: Record<OrtAcceleratorSetting, string> = {
  auto: "Auto",
  cpu: "CPU",
  cuda: "CUDA",
  directml: "DirectML",
  rocm: "ROCm",
};

/**
 * Whisper dropdown encodes accelerator + device in a single value:
 *   "auto"   → accelerator=auto,  gpu_device=-1
 *   "cpu"    → accelerator=cpu,   gpu_device=-1
 *   "gpu:0"  → accelerator=gpu,   gpu_device=0
 *   "gpu:1"  → accelerator=gpu,   gpu_device=1
 */
function encodeWhisperValue(
  accelerator: WhisperAcceleratorSetting,
  gpuDevice: number,
): string {
  if (accelerator === "cpu") return "cpu";
  if (accelerator === "gpu" && gpuDevice >= 0) return `gpu:${gpuDevice}`;
  return "auto";
}

function decodeWhisperValue(value: string): {
  accelerator: WhisperAcceleratorSetting;
  gpuDevice: number;
} {
  if (value === "cpu") return { accelerator: "cpu", gpuDevice: -1 };
  if (value.startsWith("gpu:")) {
    const id = parseInt(value.slice(4), 10);
    return { accelerator: "gpu", gpuDevice: id };
  }
  return { accelerator: "auto", gpuDevice: -1 };
}

export const AccelerationSelector: FC = () => {
  const { t } = useTranslation();
  const { getSetting, updateSetting, isUpdating } = useSettings();

  const [whisperOptions, setWhisperOptions] = useState<
    Array<{ value: string; label: string }>
  >([]);
  const [ortOptions, setOrtOptions] = useState<
    Array<{ value: string; label: string }>
  >([]);

  useEffect(() => {
    commands.getAvailableAccelerators().then((available) => {
      // Build combined Whisper options: Auto, [GPU devices...], CPU
      const opts: Array<{ value: string; label: string }> = [
        {
          value: "auto",
          label: t("settings.advanced.acceleration.gpuDevice.auto"),
        },
      ];

      for (const dev of available.gpu_devices) {
        const vramLabel =
          dev.total_vram_mb >= 1024
            ? `${(dev.total_vram_mb / 1024).toFixed(1)} GB`
            : `${dev.total_vram_mb} MB`;
        opts.push({
          value: `gpu:${dev.id}`,
          label: `${dev.name} (${vramLabel})`,
        });
      }

      opts.push({ value: "cpu", label: "CPU" });
      setWhisperOptions(opts);

      // ORT options (unchanged)
      const ortVals = available.ort.includes("auto")
        ? available.ort
        : ["auto", ...available.ort];
      setOrtOptions(
        ortVals.map((v) => ({
          value: v,
          label: ORT_LABELS[v as OrtAcceleratorSetting] ?? v,
        })),
      );
    });
  }, [t]);

  const currentAccelerator = getSetting("whisper_accelerator") ?? "auto";
  const currentGpuDevice = getSetting("whisper_gpu_device") ?? -1;
  const currentWhisper = encodeWhisperValue(
    currentAccelerator as WhisperAcceleratorSetting,
    currentGpuDevice as number,
  );
  const currentOrt = getSetting("ort_accelerator") ?? "auto";

  const handleWhisperChange = async (value: string) => {
    const { accelerator, gpuDevice } = decodeWhisperValue(value);
    await updateSetting("whisper_accelerator", accelerator);
    await updateSetting("whisper_gpu_device", gpuDevice);
  };

  return (
    <>
      <Selector
        label={t("settings.advanced.acceleration.whisper.title")}
        description={t("settings.advanced.acceleration.whisper.description")}
        options={whisperOptions}
        value={currentWhisper}
        onChange={handleWhisperChange}
        isDisabled={
          isUpdating("whisper_accelerator") || isUpdating("whisper_gpu_device")
        }
        width="100%"
      />
      {ortOptions.length > 2 && (
        <Selector
          label={t("settings.advanced.acceleration.ort.title")}
          description={t("settings.advanced.acceleration.ort.description")}
          options={ortOptions}
          value={currentOrt}
          onChange={(value) =>
            updateSetting("ort_accelerator", value as OrtAcceleratorSetting)
          }
          isDisabled={isUpdating("ort_accelerator")}
          width="100%"
        />
      )}
    </>
  );
};
