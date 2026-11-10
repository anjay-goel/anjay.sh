const lazyImgs = document.querySelectorAll<HTMLImageElement>('.post-article img[loading="lazy"]');
if (lazyImgs.length && "IntersectionObserver" in window) {
	const io = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (!entry.isIntersecting) continue;
				(entry.target as HTMLElement).dataset.in = "1";
				io.unobserve(entry.target);
			}
		},
		{ rootMargin: "120px 0px" },
	);
	for (const img of lazyImgs) io.observe(img);
}
