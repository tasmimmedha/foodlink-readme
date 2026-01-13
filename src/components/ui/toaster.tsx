"use client";

import { Toast, ToastDescription, ToastTitle, ToastViewport, ToastProvider } from "./toast";
import { useToast } from "./use-toast";
import { X } from "lucide-react";

export function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    <ToastProvider>
      {toasts.map((toastInstance) => (
        <Toast
          key={toastInstance.id}
          open
          duration={toastInstance.duration ?? 5000}
          onOpenChange={(open) => {
            if (!open) dismiss(toastInstance.id);
          }}
        >
          <div className="flex flex-1 flex-col gap-1">
            {toastInstance.title && <ToastTitle>{toastInstance.title}</ToastTitle>}
            {toastInstance.description && (
              <ToastDescription>{toastInstance.description}</ToastDescription>
            )}
          </div>
          {toastInstance.action}
          <button
            type="button"
            className="rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-100"
            onClick={() => dismiss(toastInstance.id)}
          >
            <X className="h-4 w-4" />
          </button>
        </Toast>
      ))}
      <ToastViewport />
    </ToastProvider>
  );
}

