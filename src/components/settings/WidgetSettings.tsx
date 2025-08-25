import { Dropdown, ColorOptions } from "../Dropdown";
import SettingRow from "./SettingRow";

export default function WidgetSettings() {
  return (
    <SettingRow labelKey="widgetsSettings">
      <Dropdown title="Colors" dataTestId="WidgetSettings">
        <ColorOptions />
      </Dropdown>
    </SettingRow>
  );
}
