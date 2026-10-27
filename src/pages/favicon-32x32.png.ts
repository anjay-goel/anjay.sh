import { appIconPng, pngResponse } from "@/utils/icons";

export function GET() {
	return pngResponse(appIconPng({ size: 32, rounded: true }));
}
