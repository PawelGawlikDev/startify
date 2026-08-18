import { Dropdown, ColorOptions } from "../Dropdown";
import SettingsRow from "./SettingsRow";

export default function WidgetSettings() {
  return (
    <div className="flex flex-col gap-3">
      <SettingsRow labelKey="widgetsSettings">
        <Dropdown title="Colors" dataTestId="WidgetSettings">
          <ColorOptions />
        </Dropdown>
      </SettingsRow>
    </div>
  );
}
