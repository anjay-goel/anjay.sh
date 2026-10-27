import assert from "node:assert/strict";
import { test } from "node:test";
import { createMarkdownProcessor } from "@astrojs/markdown-remark";
import remarkDirective from "remark-directive";
import { rehypeMarginNotes } from "../src/plugins/rehype-margin-notes.ts";
import { remarkCapabilities } from "../src/plugins/remark-capabilities.ts";

test("Footnotes become margin notes beside the reference and at the end of the paragraph", async () => {
	const renderer = await createMarkdownProcessor({ rehypePlugins: [rehypeMarginNotes] });
	const { code } = await renderer.render(
		"Clock.[^a] More text.[^a]\n\n| x |\n|---|\n| cell[^b] |\n\n[^a]: Time namespaces *exist*.\n\n[^b]: Kept below.",
	);
	const paragraph = code.slice(code.indexOf("<p>"), code.indexOf("</p>") + 4);
	assert.match(
		paragraph,
		/Clock\.<sup class="note-ref" aria-hidden="true">1<\/sup><span class="margin-note margin-note-side" role="note"><span class="margin-note-num">1<\/span>Time namespaces <em>exist<\/em>\.<\/span> More text\./,
	);
	assert.match(
		paragraph,
		/More text\.<sup class="note-ref" aria-hidden="true">1<\/sup><span class="margin-note margin-note-end" role="note" data-pagefind-ignore="">/,
	);
	assert.equal(code.match(/margin-note-side/g)?.length, 1);
	assert.match(code, /<section data-footnotes[^>]*>[\s\S]*Kept below[\s\S]*<\/section>/);
	assert.ok(!code.includes("Time namespaces <em>exist</em>. <a"));
});

test("The capabilities directive renders switches and command results from their defaults", async () => {
	const labels = { reset: "Reset", ok: "✓", fail: "✗", prompt: "$" };
	const renderer = await createMarkdownProcessor({
		remarkPlugins: [remarkDirective, [remarkCapabilities, { labels }]],
	});
	const { code, metadata } = await renderer.render(
		':::capabilities[Try it]{label="Keeps" caption="Switch one off."}\n- [x] CAP_NET_RAW\n- [ ] CAP_SYS_TIME\n\n::command[ping 1.1.1.1]{needs="CAP_NET_RAW" ok="pong" fail="denied"}\n::command[date -s now]{needs="CAP_SYS_TIME" ok="set" fail="denied"}\n:::',
	);
	assert.equal(metadata.frontmatter.hasCapabilities, true);
	assert.match(
		code,
		/role="switch" aria-checked="true" class="caps-switch" data-cap="CAP_NET_RAW" data-default="true"/,
	);
	assert.match(code, /aria-checked="false" class="caps-switch" data-cap="CAP_SYS_TIME"/);
	assert.match(code, /data-state="ok"[^>]*>✓ pong</);
	assert.match(code, /data-state="fail"[^>]*>✗ denied</);
	assert.match(code, /<span class="caps-title">Try it<\/span>/);
	assert.match(code, /<figcaption>Switch one off\.<\/figcaption>/);
});
