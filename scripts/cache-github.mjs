// Optional build-time refresh. Keeps the last successful cache on network failure.
import { writeFile } from "node:fs/promises";
const username = "SomyadeepTarat";
try {
  const response = await fetch(
    `https://github.com/users/${username}/contributions`,
    {
      signal: AbortSignal.timeout(10000),
      headers: { "User-Agent": "portfolio-contribution-cache" },
    },
  );
  if (!response.ok) throw Error(`HTTP ${response.status}`);
  const html = await response.text();
  const labels = new Map(
    [
      ...html.matchAll(
        /<tool-tip[^>]*for="([^"]+)"[^>]*>([\s\S]*?)<\/tool-tip>/g,
      ),
    ].map((m) => [m[1], m[2].replace(/<[^>]+>/g, "").trim()]),
  );
  const days = [];
  for (const match of html.matchAll(/<td\b[^>]*data-date="[^"]+"[^>]*>/g)) {
    const tag = match[0],
      date = tag.match(/data-date="([^"]+)"/)?.[1],
      id = tag.match(/\bid="([^"]+)"/)?.[1];
    const label = labels.get(id) || "",
      count = /No contributions/i.test(label)
        ? 0
        : Number(
            label.match(/([\d,]+) contributions?/i)?.[1]?.replaceAll(",", ""),
          );
    if (date && Number.isFinite(count)) days.push({ date, count });
  }
  if (!days.length) throw Error("No verified contribution counts found");
  days.sort((a, b) => a.date.localeCompare(b.date));
  await writeFile(
    "public/data/github-contributions.json",
    JSON.stringify({ username, fetchedAt: new Date().toISOString(), days }),
  );
  console.log(`Cached ${days.length} contribution days.`);
} catch (error) {
  console.warn(`GitHub cache unchanged: ${error.message}`);
}
