import { populateList } from "./currencyList";
import {
  fetchUSDExchangeRates,
  formatDate,
  USDExchangeRateResponse,
} from "./exchangeApi";
import { setup } from "./input";
import "./currencyInput";
import "./index.css";
import { _ } from "./utils";

populateList();

const splash = _("splash") as HTMLDivElement;
const asOfDate = _("as-of-date") as HTMLElement;

fetchUSDExchangeRates()
  .then((rates) => {
    console.log(rates);
    if (!rates) return;

    // Update and format "as of" date
    asOfDate.innerText = formatDate(rates.date);

    // Clear splash screen and update UI
    setup(rates);
    queueMicrotask(() => {
      splash.remove();
    });
  })
  .catch((e) => console.warn(e));

document.documentElement.classList.remove("no-js");
