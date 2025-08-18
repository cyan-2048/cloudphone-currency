// Adapted from https://www.npmjs.com/package/countries-and-timezones
// License: MIT

import timezonesData from "./timezones.json";

// ---------- Types ----------

interface Data {
  countries: Record<string, string>;
  timezones: Record<string, TimezoneEntry>;
}

interface TimezoneEntry {
  u?: number;          // UTC offset in minutes
  d?: number;          // DST offset in minutes
  a?: string;          // aliasOf
  c?: string[];        // country codes
  r?: number;          // deprecated flag
}

interface Country {
  id: string;
  name: string;
  timezones: string[];
  allTimezones: string[];
}

interface Timezone {
  name: string;
  countries: string[];
  utcOffset: number;
  utcOffsetStr: string;
  dstOffset: number;
  dstOffsetStr: string;
  aliasOf: string | null;
  deprecated?: boolean;
}

interface TimezonesMapEntry {
  current: string[];
  all: string[];
}

type TimezonesMap = Record<string, TimezonesMapEntry>;

interface DeliverCountryOptions {
  deprecated?: boolean;
}

export interface DeliveredCountry {
  timezones: string[];
  id: string;
  name: string;
}

const data: Data = timezonesData as Data;

// ---------- Internal state ----------

let timezonesMap: TimezonesMap | undefined;

const countries: Record<string, Country> = {};
const timezones: Record<string, Timezone> = {};

// ---------- Builders ----------

function buildCountry(data2: Data, id: string): Country | null {
  const name = data2.countries[id];
  if (!name) return null;
  const tzMap = getTimezonesMap(data2)[id] || { current: [], all: [] };
  return {
    id,
    name,
    timezones: tzMap.current || [],
    allTimezones: tzMap.all || [],
  };
}

function getTimezonesMap(data2: Data): TimezonesMap {
  timezonesMap ||= buildTimezonesMap(data2);
  return timezonesMap;
}

function buildTimezonesMap(data2: Data): TimezonesMap {
  return Object.keys(data2.timezones).reduce<TimezonesMap>((result, id) => {
    const tz = data2.timezones[id];
    const { c, a } = tz;
    const aliasTz = a ? data2.timezones[a] : {};
    const countries2 = c || aliasTz.c;
    if (!countries2) return result;
    for (const country of countries2) {
      if (!result[country]) {
        result[country] = { current: [], all: [] };
      }
      if (tz.r === undefined) result[country].current.push(id);
      result[country].all.push(id);
    }
    return result;
  }, {});
}

function buildTimezone(data2: Data, name: string): Timezone | null {
  const timezone = data2.timezones[name];
  if (!timezone) return null;
  const aliasOf = timezone.a ?? null;
  const aliasTz = aliasOf ? data2.timezones[aliasOf] : {};
  const tz = {
    ...aliasTz,
    ...data2.timezones[name],
  };
  const countries2 = tz.c || [];
  const utcOffset = tz.u ?? 0;
  const dstOffset = Number.isInteger(tz.d) ? tz.d! : utcOffset;
  const result: Timezone = {
    name,
    countries: countries2,
    utcOffset,
    utcOffsetStr: getOffsetString(utcOffset),
    dstOffset,
    dstOffsetStr: getOffsetString(dstOffset),
    aliasOf,
  };
  if (timezone.r) result.deprecated = true;
  return result;
}

// ---------- Helpers ----------

function getOffsetString(offset: number): string {
  const hours = Math.floor(Math.abs(offset) / 60);
  const min = Math.abs(offset) % 60;
  const sign = offset < 0 ? "-" : "+";
  return `${sign}${getNumberString(hours)}:${getNumberString(min)}`;
}

function getNumberString(input: number): string {
  const number_ = Math.abs(input);
  const prefix = number_ < 10 ? "0" : "";
  return `${prefix}${number_}`;
}

// ---------- Memoization ----------

function memoizeCountry(country: Country | null): void {
  if (!country) return;
  countries[country.id] = country;
}

function memoizeTimezone(timezone: Timezone | null): void {
  if (!timezone) return;
  timezones[timezone.name] = timezone;
}

// ---------- Public API ----------

export function getCountry(
  id: string,
  options: DeliverCountryOptions = {}
): DeliveredCountry | null {
  if (!countries[id]) memoizeCountry(buildCountry(data, id));
  return deliverCountry(countries[id], options);
}

export function getTimezone(name: string): Timezone | null {
  if (!timezones[name]) memoizeTimezone(buildTimezone(data, name));
  return timezones[name] ? { ...timezones[name] } : null;
}

export function getCountriesForTimezone(
  tzName: string,
  options: DeliverCountryOptions = {}
): (DeliveredCountry | null)[] {
  const timezone = getTimezone(tzName) || { countries: [] };
  const values = timezone.countries;
  return values.map((c) => getCountry(c, options));
}

export function getCountryForTimezone(
  tzName: string,
  options: DeliverCountryOptions = {}
): DeliveredCountry | null {
  const [main] = getCountriesForTimezone(tzName, options);
  return main || null;
}

function deliverCountry(
  country: Country | undefined,
  options: DeliverCountryOptions
): DeliveredCountry | null {
  if (!country) return null;
  const { deprecated } = options || {};
  const { allTimezones, ...other } = country;
  const tz = deprecated ? country.allTimezones : country.timezones;
  return { ...other, timezones: tz };
}
