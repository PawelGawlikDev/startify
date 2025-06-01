import { Dropdown, EngineOptions } from "../Dropdown";
import { useSettings } from "@/context/SettingsContext";
import Toggle from "../Toggle";
import SettingRow from "./SettingRow";

export default function MainSettings() {
  const { getSetting, updateSetting } = useSettings();

  const engine = getSetting("searchEngine");
  const vanishAnimation = getSetting("vanishAnimation");
  const showClock = getSetting("showClock");
  const quickLink = getSetting("quickLink");
  const weather = getSetting("weather");

  return (
    <div className="bg-default-bg flex flex-col gap-4 rounded-md p-4">
      <SettingRow labelKey="engineSettings">
        <Dropdown title={engine?.name ?? ""} dataTestId="EngineSettings">
          <EngineOptions />
        </Dropdown>
      </SettingRow>

      {vanishAnimation !== undefined && (
        <SettingRow labelKey="vanishAnimation">
          <Toggle
            toggled={vanishAnimation}
            onToggle={() => updateSetting("vanishAnimation", !vanishAnimation)}
          />
        </SettingRow>
      )}

      {weather !== undefined && (
        <SettingRow labelKey="weatherWidget" dataTestId="Warther">
          <Toggle
            toggled={weather.enable}
            onToggle={() =>
              updateSetting("weather", { ...weather, enable: !weather.enable })
            }
          />
        </SettingRow>
      )}

      {showClock !== undefined && (
        <SettingRow labelKey="showClock">
          <Toggle
            toggled={showClock}
            onToggle={() => updateSetting("showClock", !showClock)}
          />
        </SettingRow>
      )}

      {quickLink?.enable !== undefined && (
        <SettingRow labelKey="quickLinks">
          <Toggle
            toggled={quickLink.enable}
            onToggle={() =>
              updateSetting("quickLink", {
                ...quickLink,
                enable: !quickLink.enable
              })
            }
          />
        </SettingRow>
      )}
    </div>
  );
}
