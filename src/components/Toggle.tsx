import { Switch } from "@/components/ui/switch";

type ToggleProps = {
  toggled: boolean;
  dataTestId?: string;
  onToggle: (newValue: boolean) => void;
};

export default function Toggle({ toggled, dataTestId, onToggle }: ToggleProps) {
  return (
    <div className="inline-flex items-center">
      <input
        type="checkbox"
        data-testid={dataTestId}
        checked={toggled}
        onChange={() => onToggle(!toggled)}
        className="sr-only"
      />
      <Switch
        checked={toggled}
        onCheckedChange={onToggle}
        data-testid={`${dataTestId}Toggle`}
        aria-label={dataTestId ?? "toggle setting"}
        className="data-checked:bg-success data-unchecked:bg-error"
      />
    </div>
  );
}
