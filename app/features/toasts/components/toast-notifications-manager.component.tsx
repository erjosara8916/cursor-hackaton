import { CircleXIcon } from "lucide-react";
import {
  ProgressBar,
  Text,
  UNSTABLE_Toast as Toast,
  UNSTABLE_ToastContent as ToastContent,
  UNSTABLE_ToastRegion as ToastRegion,
} from "react-aria-components";

import { Button } from "#/components/button/button.component";
import type { ToastType } from "#/features/toasts/constants/toast-queue/toast-queue.constant";
import { toastQueue } from "#/features/toasts/constants/toast-queue/toast-queue.constant";

const TOAST_CLASS_NAMES: Record<ToastType, string> = {
  ERROR: "alert-error",
  INFO: "alert-info",
  LOADING: "alert-info",
  SUCCESS: "alert-success",
};

export const ToastNotificationsManager = () => (
  <ToastRegion queue={toastQueue} className="toast toast-center">
    {({ toast }) => (
      <Toast
        className={`alert ${TOAST_CLASS_NAMES[toast.content.type]} flex items-center justify-between`}
        style={{
          viewTransitionName: toast.key,
        }}
        toast={toast}
      >
        <ToastContent className="flex items-center gap-2">
          {toast.content.type === "LOADING" ? (
            <ProgressBar aria-label="loading" isIndeterminate>
              <span className="loading loading-spinner" />
            </ProgressBar>
          ) : null}

          <Text slot="description">{toast.content.content}</Text>
        </ToastContent>

        <Button className="btn-circle btn-ghost btn-sm" slot="close">
          <CircleXIcon />
        </Button>
      </Toast>
    )}
  </ToastRegion>
);
