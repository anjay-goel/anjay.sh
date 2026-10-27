export interface Palette {
	bg: string;
	ink: string;
	muted: string;
	soft: string;
	accent: string;
}

export const palette: Record<"light" | "dark", Palette> = {
	light: { bg: "#f6f6f5", ink: "#1a1a1a", muted: "#424242", soft: "#656565", accent: "#335a85" },
	dark: { bg: "#131313", ink: "#ebe9e5", muted: "#bdbab4", soft: "#908d87", accent: "#9fc3e6" },
};
