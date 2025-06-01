import { Dropdown, ColorOptions } from "../Dropdown";

export default function WidgetSettings() {
  return (
    <div className="bg-surface flex items-center justify-between rounded-md p-2">
      <p className="text-primary-text text-nowrap">
        {getMessage("widgetsSettings")}
      </p>
      <Dropdown title="Colors" dataTestId="WidgetSettings">
        <ColorOptions />
      </Dropdown>
    </div>
  );
}
