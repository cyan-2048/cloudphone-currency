// import styles for dialog
import "./currencyList.css";
import "./about.css";
import { _ } from "./utils";
import { focusHome, updateHomeHeader } from "./input";
import { setHeaderText } from "./header";
import { hideCenterButton, hideInfoButton, showInfoButton } from "./softkeys";

const dialog = _("about") as HTMLDialogElement;

function handleBackEvent(ev: Event) {
  ev.preventDefault();
  hideAbout();
}

export function showAbout() {
  dialog.open = true;
  dialog.scrollTop = 0;
  // Cyan: remove this in the final version
  dialog.onkeydown = (e) => {
    if (e.key === "*") {
      localStorage.clear();
      location.reload();
    }
  };
  dialog.focus();
  setHeaderText("About");
  hideInfoButton();
  hideCenterButton();
  window.addEventListener("back", handleBackEvent);
}

export function hideAbout() {
  dialog.open = false;
  updateHomeHeader();
  showInfoButton();
  focusHome();
  window.removeEventListener("back", handleBackEvent);
}
