import { Dropdown, EngineOptions } from "../Dropdown";
import { useSettings } from "@/context/SettingsContext";
import Toggle from "../Toggle";
import SettingsRow from "./SettingsRow";

export default function MainSettings() {
  const { getSetting, updateSetting } = useSettings();

  const engine = getSetting("searchEngine");
  const vanishAnimation = getSetting("vanishAnimation");
  const showClock = getSetting("showClock");
  const quickLink = getSetting("quickLink");
  const weather = getSetting("weather");

  return (
    <div className="bg-default-bg flex flex-col gap-3 rounded-md">
      <SettingsRow labelKey="engineSettings">
        <Dropdown title={engine?.name ?? ""} dataTestId="EngineSettings">
          <EngineOptions />
        </Dropdown>
      </SettingsRow>

      {vanishAnimation !== undefined && (
        <SettingsRow labelKey="vanishAnimation">
          <Toggle
            toggled={vanishAnimation}
            onToggle={() => updateSetting("vanishAnimation", !vanishAnimation)}
          />
        </SettingsRow>
      )}

      {weather !== undefined && (
        <SettingsRow labelKey="weatherWidget">
          <Toggle
            dataTestId="Warther"
            toggled={weather.enable}
            onToggle={() =>
              updateSetting("weather", { ...weather, enable: !weather.enable })
            }
          />
        </SettingsRow>
      )}

      {showClock !== undefined && (
        <SettingsRow labelKey="showClock">
          <Toggle
            toggled={showClock}
            onToggle={() => updateSetting("showClock", !showClock)}
          />
        </SettingsRow>
      )}

      {quickLink?.enable !== undefined && (
        <SettingsRow labelKey="quickLinks">
          <Toggle
            toggled={quickLink.enable}
            onToggle={() =>
              updateSetting("quickLink", {
                ...quickLink,
                enable: !quickLink.enable
              })
            }
          />
        </SettingsRow>
      )}
    </div>
  );
}
