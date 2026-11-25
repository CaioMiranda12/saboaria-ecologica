"use client";

import { cloneElement, isValidElement, useId, type ReactElement } from "react";

type FormFieldProps = {
  label: string;
  error?: string;
  children: React.ReactNode;
};

export const formInputClass =
  "admin-control rounded-xl px-4 py-3 text-sm text-verde-escuro transition-colors w-full";

export function FormField({ label, error, children }: FormFieldProps) {
  const generatedId = useId();
  const native = isValidElement(children) && typeof children.type === "string" && ["input", "textarea", "select"].includes(children.type);
  const field = native ? children as ReactElement<{ id?: string; "aria-invalid"?: boolean; "aria-describedby"?: string }> : null;
  const id = field?.props.id ?? generatedId;
  return (
    <div className="flex flex-col gap-1.5">
      {field ? <label htmlFor={id} className="text-xs font-medium text-verde-escuro">{label}</label> : <span className="text-xs font-medium text-verde-escuro">{label}</span>}
      {field ? cloneElement(field, { id, "aria-invalid": error ? true : field.props["aria-invalid"], "aria-describedby": [field.props["aria-describedby"], error ? `${id}-error` : null].filter(Boolean).join(" ") || undefined }) : children}
      {error && <span id={`${id}-error`} role="alert" className="text-xs text-red-600">{error}</span>}
    </div>
  );
}