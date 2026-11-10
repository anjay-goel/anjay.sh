import { siteConfig } from "@/site-config";

const { locale, options } = siteConfig.date;
const timeZone = options.timeZone ?? "UTC";

const railFormatter = new Intl.DateTimeFormat(locale, { ...options, timeZone });

const railDayFormatter = new Intl.DateTimeFormat(locale, {
	day: options.day,
	month: options.month,
	timeZone,
});

const railYearFormatter = new Intl.DateTimeFormat(locale, { year: options.year, timeZone });

const bylineFormatter = new Intl.DateTimeFormat("en-GB", {
	day: "numeric",
	month: "long",
	year: "numeric",
	timeZone,
});

const eyebrowFormatter = new Intl.DateTimeFormat("en-US", {
	month: "long",
	year: "numeric",
	timeZone,
});

export function formatRailDate(date: Date): string {
	return railFormatter.format(date);
}

export function formatRailDay(date: Date): string {
	return railDayFormatter.format(date);
}

export function formatRailYear(date: Date): string {
	return railYearFormatter.format(date);
}

export function formatBylineDate(date: Date): string {
	return bylineFormatter.format(date);
}

export function formatEyebrowDate(date: Date): string {
	return eyebrowFormatter.format(date);
}
