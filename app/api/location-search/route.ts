const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";
const MAX_RESULTS = 5;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim();

  if (!query || query.length < 2) {
    return Response.json([]);
  }

  try {
    const url = new URL(NOMINATIM_URL);
    url.searchParams.set("q", query);
    url.searchParams.set("format", "json");
    url.searchParams.set("limit", String(MAX_RESULTS));

    const res = await fetch(url.toString(), {
      headers: {
        // Nominatim usage policy requires a descriptive User-Agent.
        // This header is only settable server-side; browsers override it.
        "User-Agent": "ResumeBuilder/1.0 (https://github.com/your-repo)",
      },
    });

    if (!res.ok) {
      return Response.json([]);
    }

    const data: unknown = await res.json();
    if (!Array.isArray(data)) return Response.json([]);

    const results = data
      .map((item: unknown) =>
        typeof item === "object" &&
        item !== null &&
        "display_name" in item &&
        typeof (item as Record<string, unknown>).display_name === "string"
          ? (item as { display_name: string }).display_name
          : null
      )
      .filter((name): name is string => name !== null);

    return Response.json(results);
  } catch {
    return Response.json([]);
  }
}
