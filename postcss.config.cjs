const HOVER_QUERY = "(hover: hover)";

const hoverOnly = () => ({
	postcssPlugin: "hover-only",
	Rule(rule, { AtRule }) {
		if (!rule.selector.includes(":hover")) return;
		for (let node = rule.parent; node; node = node.parent) {
			if (node.type === "atrule" && /keyframes$/i.test(node.name)) return;
			if (node.type === "atrule" && node.name === "media" && node.params.includes(HOVER_QUERY)) return;
		}
		const hover = rule.selectors.filter((selector) => selector.includes(":hover"));
		const rest = rule.selectors.filter((selector) => !selector.includes(":hover"));
		const media = new AtRule({ name: "media", params: HOVER_QUERY });
		if (rest.length) {
			media.append(rule.clone({ selectors: hover }));
			rule.selectors = rest;
			rule.after(media);
		} else {
			rule.replaceWith(media);
			media.append(rule);
		}
	},
});
hoverOnly.postcss = true;

module.exports = {
	plugins: [
		require("autoprefixer"),
		hoverOnly,
		...(process.env.NODE_ENV === "production" ? [require("cssnano")] : []),
	],
};
