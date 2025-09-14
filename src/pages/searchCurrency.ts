import { hideInfoButton, setInfoButtonState } from "../components/softkeys";
import { CURRENCIES } from "../data/currencies";
import { _ } from "../helpers/utils";
import {
  createListItem,
  handleBlur,
  handleFocus,
  onCurrencyClick,
  queryCurrencyCode,
  scrollIntoViewIfNeeded,
} from "./currencyList";
import "./searchCurrency.css";

const dialog = _("search") as HTMLDialogElement;
const input = _("search-input") as HTMLInputElement;
const list = _("search-list") as HTMLOListElement;

let currentSearchText = "";

function populateList() {
  const searchText = input.value.toLocaleLowerCase();

  // avoid having to re-render for the same query
  if (currentSearchText === searchText) return;

  list.innerHTML = "";
  if (!searchText) return;

  const fragment = CURRENCIES.filter((a) =>
    // super simple string search
    `${a.currencyCode} ${a.currencySymbol} ${a.englishCurrencyName} ${a.languageCode} ${a.localCurrencyName}`
      .toLocaleLowerCase()
      .includes(searchText)
  )
    .map(createListItem)
    .reduce((frag, item) => (frag.appendChild(item), frag), document.createDocumentFragment());

  list.append(fragment);
  currentSearchText = searchText;
}

function handleInputKeydown(e: KeyboardEvent) {
  // simulate CloudPhone in dev environment
  if (import.meta.env.DEV) {
    if (e.key === "Enter") {
      const text = prompt("Enter Text", input.value) || "";
      input.value = text;
      input.dispatchEvent(new Event("input"));
      input.dispatchEvent(new Event("change"));
    }
  }

  if (e.key === "ArrowDown" && list.childElementCount) {
    // prevent scrolling
    e.preventDefault();
    (list.firstElementChild as HTMLLIElement).focus();
  }
}

function handleListKeydown(e: KeyboardEvent) {
  const target = e.target as HTMLLIElement;
  if (e.key === "ArrowDown") {
    // prevent scrolling
    e.preventDefault();
    const next = target.nextElementSibling as HTMLLIElement;
    if (next) {
      scrollIntoViewIfNeeded(next);
      next.focus();
    }
  }

  if (e.key === "ArrowUp") {
    // prevent scrolling
    e.preventDefault();
    const next = target.previousElementSibling as HTMLLIElement;
    if (next) {
      scrollIntoViewIfNeeded(next);
      next.focus();
    } else {
      input.focus();
    }
  }
}

function handleListKeyUp(ev: KeyboardEvent) {
  const target = ev.target as HTMLLIElement;

  if (ev.key == "Enter") {
    const button = target.firstElementChild as HTMLDivElement;

    setTimeout(() => {
      onCurrencyClick(queryCurrencyCode(button));
      hideSearch();
    }, 0);
  }
}

function handleInputChange(ev: Event) {
  populateList();
}

export function showSearch() {
  input.addEventListener("keydown", handleInputKeydown);
  input.addEventListener("change", handleInputChange);
  input.addEventListener("input", handleInputChange);

  list.innerHTML = "";
  input.value = "";
  currentSearchText = "";

  list.addEventListener("keydown", handleListKeydown, true);
  list.addEventListener("keyup", handleListKeyUp, true);

  list.addEventListener("focus", handleFocus, true);
  list.addEventListener("blur", handleBlur, true);

  dialog.open = true;
  setInfoButtonState("search");
  hideInfoButton();
  input.focus();
}

export function hideSearch() {
  dialog.open = false;

  input.removeEventListener("keydown", handleInputKeydown);
  input.removeEventListener("change", handleInputChange);
  input.removeEventListener("input", handleInputChange);

  list.removeEventListener("keydown", handleListKeydown, true);
  list.removeEventListener("keyup", handleListKeyUp, true);

  list.removeEventListener("focus", handleFocus, true);
  list.removeEventListener("blur", handleBlur, true);

  list.innerHTML = "";
  currentSearchText = "";
}
