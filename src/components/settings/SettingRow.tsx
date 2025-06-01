import React from "react";
import { getMessage } from "@/utils/getMessage";

type SettingRowProps = {
  labelKey: string;
  children: React.ReactNode;
  dataTestId?: string;
};

export default function SettingRow({
  labelKey,
  children,
  dataTestId
}: SettingRowProps) {
  return (
    <div
      className="bg-surface flex items-center justify-between rounded-md p-2"
      data-testid={dataTestId}>
      <p className="text-primary-text">{getMessage(labelKey)}</p>
      {children}
    </div>
  );
}
