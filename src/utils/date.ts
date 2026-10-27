import { siteConfig } from "@/site-config";

const timeZone = siteConfig.date.options.timeZone ?? "UTC";

const partsFormatter = new Intl.DateTimeFormat("en-US", {
	day: "numeric",
	month: "short",
	year: "numeric",
	timeZone,
});

function dateParts(date: Date): { day: string; month: string; year: string } {
	const parts = partsFormatter.formatToParts(date);
	const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((p) => p.type === type)?.value ?? "";
	return { day: get("day"), month: get("month"), year: get("year") };
}

export function formatDayMonth(date: Date): string {
	const { day, month } = dateParts(date);
	return `${day} ${month}`;
}

export function formatDayMonthYear(date: Date): string {
	const { day, month, year } = dateParts(date);
	return `${day} ${month} ${year}`;
}

export function getYear(date: Date): number {
	return Number(dateParts(date).year);
}
