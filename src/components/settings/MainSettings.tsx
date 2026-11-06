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

  return (
    <div className="flex flex-col">
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
