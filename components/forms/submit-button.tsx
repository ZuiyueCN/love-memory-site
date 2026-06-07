"use client";

import { LoaderCircle } from "lucide-react";
import { useFormStatus } from "react-dom";

export function SubmitButton({
  children,
  className = "primary-button",
  disabled = false
}: {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}) {
  const { pending } = useFormStatus();
  const isDisabled = pending || disabled;

  return (
    <button type="submit" className={className} disabled={isDisabled}>
      {isDisabled ? <LoaderCircle className="size-4 animate-spin" /> : null}
      {children}
    </button>
  );
}
