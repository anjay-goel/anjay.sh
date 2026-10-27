type Theme = "light" | "dark";

const THEME_STORAGE_KEY = "theme";
export const THEME_EVENT = "theme-change";

export function getTheme(): Theme {
	return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function setTheme(theme: Theme): void {
	try {
		localStorage.setItem(THEME_STORAGE_KEY, theme);
	} catch {}
	document.dispatchEvent(new CustomEvent(THEME_EVENT, { detail: { theme } }));
}

export function toggleTheme(): Theme {
	const next: Theme = getTheme() === "dark" ? "light" : "dark";
	setTheme(next);
	return next;
}
