import type { ToastContent } from "#/features/toasts/constants/toast-queue/toast-queue.constant";
import { toastQueue } from "#/features/toasts/constants/toast-queue/toast-queue.constant";

const DEFAULT_TOAST_DURATION_IN_MS = 2500;

type EnqueueToastOpts = {
  /**
   * The duration in milliseconds for which the toast should be displayed.
   *
   * @default 2500
   */
  durationInMs?: number;
};

export const useToastNotification = () => {
  const enqueueToast = (content: ToastContent, opts?: EnqueueToastOpts) => {
    return toastQueue.add(content, {
      timeout: opts?.durationInMs ?? DEFAULT_TOAST_DURATION_IN_MS,
    });
  };

  const dismissToast = (toastId: string) => {
    toastQueue.close(toastId);
  };

  return {
    dismissToast,
    enqueueToast,
  };
};
