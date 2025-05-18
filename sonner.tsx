"use client";

import { useTheme } from "next-themes";
import { toast } from "sonner";

const playSound = () => {
  const audio = new Audio("https://voca.ro/105NhS8xMNPa");
  audio.volume = 1;
  audio.play().catch((err) => console.error("Audio playback failed:", err));
};

const triggerToast = (message: string) => {
  toast(message);
  playSound(); // Play sound when toast appears
};

const Toaster = () => {
  const { theme = "system" } = useTheme();

  return (
    <>
      <button onClick={() => triggerToast("Notification triggered!")}>
        Test Notification
      </button>
    </>
  );
};

export { Toaster, triggerToast };
