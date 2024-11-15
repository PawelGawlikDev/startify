import React, { type ReactNode } from "react";

interface SettingsSectionProps {
  children: ReactNode;
  sectionTitle: string;
  className?: string;
}

export default function SettingsSection({
  children,
  className,
  sectionTitle
}: SettingsSectionProps): React.JSX.Element {
  return (
    <div className={className}>
      <div className="flex flex-row p-2 text-lg">
        <p>{sectionTitle}</p>
      </div>
      <div className="flex flex-col gap-6 bg-neutral-800 p-5">{children}</div>
    </div>
  );
}
