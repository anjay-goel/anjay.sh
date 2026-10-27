import { faviconSvg } from "@/utils/icons";

export function GET() {
	return new Response(faviconSvg(), { headers: { "Content-Type": "image/svg+xml" } });
}
