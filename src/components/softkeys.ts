import { showAbout } from "../pages/about";
import "./softkeys.css";
import { _ } from "../helpers/utils";
import { showSearch } from "../pages/searchCurrency";

const footer = _("cp-softkeys") as HTMLElement;
const infoButton = footer.firstElementChild as HTMLDivElement;
const centerButton = infoButton.nextElementSibling as HTMLDivElement;

if (import.meta.env.DEV) {
  infoButton.onclick = () => {
    showAbout();
  };

  const backButton = footer.lastElementChild as HTMLDivElement;
  backButton.onclick = () => {
    window.dispatchEvent(new Event("back", { cancelable: true }));
  };
}

export function showInfoButton() {
  infoButton.ariaDisabled = "false";
}

export function hideInfoButton() {
  infoButton.ariaDisabled = "true";
}

export function showCenterButton() {
  centerButton.ariaDisabled = "false";
}

export function hideCenterButton() {
  centerButton.ariaDisabled = "true";
}

export function setInfoButtonState(state: string) {
  infoButton.dataset.state = state;
}

export function getInfoButtonState() {
  return infoButton.dataset.state || "";
}

function handleKeydown(ev: KeyboardEvent) {
  if (ev.key == "Escape") {
    if (infoButton.dataset.state === "list") {
      showSearch();
      return;
    }

    if (infoButton.ariaDisabled !== "true") {
      showAbout();
    }
  }

  if (import.meta.env.DEV) {
    if (ev.key == "Backspace") {
      setTimeout(() => {
        window.dispatchEvent(new Event("back", { cancelable: true }));
      }, 10);
    }
  }
}

export function setupAboutPage() {
  window.addEventListener("keydown", handleKeydown);
}
