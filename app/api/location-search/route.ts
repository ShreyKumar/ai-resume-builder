import { NextResponse } from "next/server";

const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";
const MAX_RESULTS = 5;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim();

  if (!query || query.length < 2) {
    return NextResponse.json([]);
  }

  try {
    const url = new URL(NOMINATIM_URL);
    url.searchParams.set("q", query);
    url.searchParams.set("format", "json");
    url.searchParams.set("limit", String(MAX_RESULTS));
    url.searchParams.set("countrycodes", "us,ca,gb");
    url.searchParams.set("featuretype", "city");
    url.searchParams.set("addressdetails", "1");

    const res = await fetch(url.toString(), {
      headers: {
        // Nominatim usage policy requires a descriptive User-Agent.
        // This header is only settable server-side; browsers override it.
        "User-Agent": "ResumeBuilder/1.0 (https://github.com/your-repo)",
      },
    });

    if (!res.ok) {
      return NextResponse.json([]);
    }

    const data: unknown = await res.json();
    if (!Array.isArray(data)) return NextResponse.json([]);

    interface NominatimResult {
      display_name?: string;
      address?: {
        city?: string;
        town?: string;
        village?: string;
        country?: string;
      };
    }

    const results = data
      .map((item: unknown) => {
        if (typeof item !== "object" || item === null) return null;
        const result = item as NominatimResult;
        const city =
          result.address?.city ||
          result.address?.town ||
          result.address?.village;
        const country = result.address?.country;
        if (city && country) return `${city}, ${country}`;
        return null;
      })
      .filter((name): name is string => name !== null);

    return NextResponse.json([...new Set(results)]);
  } catch {
    return NextResponse.json([]);
  }
}
