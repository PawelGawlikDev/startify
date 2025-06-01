import React from "react";
import { getMessage } from "@/utils/getMessage";

type SettingRowProps = {
  labelKey: string;
  children: React.ReactNode;
};

export default function SettingRow({ labelKey, children }: SettingRowProps) {
  return (
    <div className="bg-surface flex items-center justify-between rounded-md p-2">
      <p className="text-primary-text">{getMessage(labelKey)}</p>
      {children}
    </div>
  );
}
