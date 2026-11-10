const codeBlocks = document.querySelectorAll<HTMLPreElement>(".post-article .expressive-code pre");
if (codeBlocks.length && "ResizeObserver" in window) {
	const markClipped = (pre: HTMLElement) =>
		pre.toggleAttribute("data-clipped", pre.scrollWidth - pre.clientWidth - pre.scrollLeft > 1);
	const ro = new ResizeObserver((entries) =>
		entries.forEach((e) => {
			const pre = e.target.closest("pre");
			const frame = pre?.offsetParent;
			if (!pre || !frame) return;
			const top = pre.getBoundingClientRect().top - frame.getBoundingClientRect().top + pre.clientTop;
			pre.style.setProperty("--clip-top", `${top}px`);
			markClipped(pre);
		}),
	);
	codeBlocks.forEach((pre) => {
		pre.addEventListener("scroll", () => markClipped(pre), { passive: true });
		ro.observe(pre);
		if (pre.firstElementChild) ro.observe(pre.firstElementChild);
	});
}
