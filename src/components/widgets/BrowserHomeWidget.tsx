import ChromeIcon from "@/components/ChromeIcon";

export function BrowserHomeWidget() {
  return (
    <button
      type="button"
      className="text-primary-text/90 hover:text-primary-text focus-visible:ring-primary/70 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition-colors focus-visible:ring-2 focus-visible:outline-none"
      data-testid="ChromeIcon"
      aria-label="Open default browser tab"
      onClick={async () => {
        await browser.tabs.update({
          url: "chrome://new-tab-page/"
        });
      }}>
      <ChromeIcon />
    </button>
  );
}
