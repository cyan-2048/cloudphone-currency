// import styles for dialog
import "./currencyList.css";
import "./about.css";
import { _ } from "../helpers/utils";
import { focusHome, updateHomeHeader } from "../input";
import { setHeaderText } from "../components/header";
import { hideCenterButton, hideInfoButton, showInfoButton } from "../components/softkeys";

const dialog = _("about") as HTMLDialogElement;

function handleBackEvent(ev: Event) {
  ev.preventDefault();
  hideAbout();
}

export function showAbout() {
  dialog.open = true;
  dialog.scrollTop = 0;
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
