export async function copyText(text: string): Promise<boolean> {
	try {
		await navigator.clipboard.writeText(text);
		return true;
	} catch {
		const input = document.createElement("input");
		input.value = text;
		document.body.appendChild(input);
		input.select();
		let copied = false;
		try {
			copied = document.execCommand("copy");
		} catch {}
		input.remove();
		return copied;
	}
}
