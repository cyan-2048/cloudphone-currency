import timezones from "./timezones.json";

type CountryCode = keyof typeof timezones.countries;
type TimezoneName = keyof typeof timezones.timezones;

type Country = {
  id: CountryCode;
  name: string;
  timezones: TimezoneName[];
};

export function getCountryForTimezone(tz: string): Country | null;
