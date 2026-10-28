const numerals: [number, string][] = [
	[1000, "M"],
	[900, "CM"],
	[500, "D"],
	[400, "CD"],
	[100, "C"],
	[90, "XC"],
	[50, "L"],
	[40, "XL"],
	[10, "X"],
	[9, "IX"],
	[5, "V"],
	[4, "IV"],
	[1, "I"],
];

export function toRoman(value: number): string {
	let rest = Math.floor(value);
	let out = "";
	for (const [n, s] of numerals) {
		while (rest >= n) {
			out += s;
			rest -= n;
		}
	}
	return out;
}
