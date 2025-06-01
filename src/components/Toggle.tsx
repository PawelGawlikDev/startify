type ToggleProps = {
  toggled: boolean;
  dataTestId?: string;
  onToggle: (newValue: boolean) => void;
};

export default function Toggle({ toggled, dataTestId, onToggle }: ToggleProps) {
  return (
    <label className="inline-flex cursor-pointer items-center">
      <input
        type="checkbox"
        data-testid={dataTestId}
        checked={toggled}
        onChange={() => onToggle(!toggled)}
        className="peer sr-only"
      />
      <div
        data-testid={`${dataTestId}Toggle`}
        className="peer peer-checked:bg-success bg-error relative h-6 w-11 rounded-full border-gray-600 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white rtl:peer-checked:after:-translate-x-full"></div>
    </label>
  );
}
