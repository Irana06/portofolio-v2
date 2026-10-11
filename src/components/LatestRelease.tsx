import { useEffect, useState } from "react";

type Asset = { name: string; size: number; browser_download_url: string };
type Release = { tag_name: string; published_at: string; html_url: string; assets: Asset[] };

/** Which phones each split APK is for, read from the file name. */
function abi(name: string): { label: string; note: string; order: number } {
  const n = name.toLowerCase();
  if (/arm64|v8a/.test(n)) return { label: "arm64-v8a", note: "most phones (try this first)", order: 0 };
  if (/armeabi|v7a/.test(n)) return { label: "armeabi-v7a", note: "older 32-bit phones", order: 1 };
  if (/x86_64|x64/.test(n)) return { label: "x86_64", note: "emulators and some tablets", order: 2 };
  return { label: name, note: "", order: 3 };
}

const mb = (bytes: number) => `${(bytes / 1024 / 1024).toFixed(1)} MB`;

/**
 * Download buttons for the newest GitHub release of a repo, fetched in the
 * visitor's browser so a new release shows up without redeploying the site.
 * If GitHub can't be reached, a plain link to the releases page remains.
 */
export default function LatestRelease({ repo }: { repo: string }) {
  const releasesUrl = `https://github.com/${repo}/releases`;
  const [release, setRelease] = useState<Release | null>(null);

  useEffect(() => {
    const key = `release:${repo}`;
    try {
      const cached = sessionStorage.getItem(key);
      if (cached) {
        setRelease(JSON.parse(cached));
        return;
      }
    } catch {
      /* storage blocked: just fetch */
    }
    let alive = true;
    fetch(`https://api.github.com/repos/${repo}/releases/latest`, { headers: { Accept: "application/vnd.github+json" } })
      .then((r) => (r.ok ? r.json() : null))
      .then((data: Release | null) => {
        if (!alive || !data?.assets) return;
        setRelease(data);
        try {
          sessionStorage.setItem(key, JSON.stringify(data));
        } catch {
          /* ignore */
        }
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [repo]);

  const apks = (release?.assets ?? [])
    .filter((a) => a.name.toLowerCase().endsWith(".apk"))
    .sort((a, b) => abi(a.name).order - abi(b.name).order);

  return (
    <div className="mt-6 rounded-md border border-rule bg-raised p-4">
      <p className="font-sans text-sm font-medium">
        Download for Android
        {release && (
          <span className="ml-2 font-mono text-[12px] font-normal text-muted">
            {release.tag_name} ·{" "}
            {new Date(release.published_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
          </span>
        )}
      </p>
      {apks.length > 0 ? (
        <ul className="mt-3 space-y-2">
          {apks.map((a) => {
            const info = abi(a.name);
            return (
              <li key={a.name}>
                <a
                  href={a.browser_download_url}
                  className="flex min-h-[44px] flex-wrap items-center justify-between gap-x-4 rounded-sm border border-rule px-3 py-2 no-underline hover:border-accent"
                >
                  <span>
                    <span className="font-mono text-[13px] text-ink">{info.label}</span>
                    {info.note && <span className="ml-2 font-sans text-[13px] text-muted">{info.note}</span>}
                  </span>
                  <span className="font-mono text-[12px] text-muted">APK · {mb(a.size)}</span>
                </a>
              </li>
            );
          })}
        </ul>
      ) : null}
      <a href={releasesUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex min-h-[44px] items-center font-sans text-sm">
        {apks.length > 0 ? "All releases on GitHub" : "Download from GitHub Releases"}
      </a>
    </div>
  );
}
