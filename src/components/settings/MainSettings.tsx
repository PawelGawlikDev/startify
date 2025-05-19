import { Dropdown, EngineOptions } from "../Dropdown";
import { useSettings } from "@/context/SettingsContext";
import Toggle from "../Toggle";

export default function MainSettings() {
  const { getSetting, updateSetting } = useSettings();

  const engine = getSetting("searchEngine");
  const vanishAnimation = getSetting("vanishAnimation");
  const showClock = getSetting("showClock");
  const quickLink = getSetting("quickLink");
  const weather = getSetting("weather");

  return (
    <div className="bg-default-bg flex flex-col gap-4 rounded-md p-4">
      <div className="bg-surface flex items-center justify-between rounded-md p-2">
        <p className="text-primary-text">
          {browser.i18n.getMessage("engineSettings")}
        </p>
        <Dropdown title={engine?.name ?? ""}>
          <EngineOptions />
        </Dropdown>
      </div>
      <div className="bg-surface flex flex-row items-center justify-between rounded-md p-2">
        <p className="text-primary-text">
          {browser.i18n.getMessage("vanishAnimation")}
        </p>
        {vanishAnimation !== undefined && (
          <Toggle
            toggled={vanishAnimation}
            onToggle={() => updateSetting("vanishAnimation", !vanishAnimation)}
          />
        )}
      </div>
      <div className="bg-surface flex flex-row items-center justify-between rounded-md p-2">
        <p className="text-primary-text">
          {browser.i18n.getMessage("weatherWidget")}
        </p>
        {weather !== undefined && (
          <Toggle
            toggled={weather.enable}
            onToggle={() =>
              updateSetting("weather", { ...weather, enable: !weather.enable })
            }
          />
        )}
      </div>
      <div className="bg-surface flex flex-row items-center justify-between rounded-md p-2">
        <p className="text-primary-text">
          {browser.i18n.getMessage("showClock")}
        </p>
        {showClock !== undefined && (
          <Toggle
            toggled={showClock}
            onToggle={() => updateSetting("showClock", !showClock)}
          />
        )}
      </div>
      <div className="bg-surface flex flex-row items-center justify-between rounded-md p-2">
        <p className="text-primary-text">
          {browser.i18n.getMessage("quickLinks")}
        </p>
        {quickLink?.enable !== undefined && (
          <Toggle
            toggled={quickLink.enable}
            onToggle={() =>
              updateSetting("quickLink", {
                ...quickLink,
                enable: !quickLink.enable
              })
            }
          />
        )}
      </div>
    </div>
  );
}
