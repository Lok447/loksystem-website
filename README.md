# LokSystem Website

Official download website for LokSystem.

## Stack

- Vite
- React
- TypeScript

## Development

```bash
bun install
bun run dev
```

## Build

```bash
bun run build
```

## Release Metadata

The current downloadable version is described in:

```text
public/releases/latest.json
```

When a new LokSystem package is published, update:

- `version`
- `fileName`
- `fileSize`
- `url`
- `sha256`
- `publishedAt`
- release notes

The homepage currently mirrors the same values in `src/App.tsx` for static rendering.

## Product Screenshot

The hero automatically prefers a real product screenshot at:

```text
public/product/loksystem-app-screenshot.png
```

If that file is not present, the page falls back to a high-fidelity React product preview. This lets the website ship before the final marketing screenshot is captured.

## Download Hosting

The current primary download points to the mainland China update channel:

```text
https://update.lokai.net.cn/stable/LokSystem-2.0.8-win-x64.exe
```

GitHub Releases remains the mirror and release-history page. Installer binaries should stay in GitHub Releases, OSS, COS, S3, or a CDN. Keep this website repository focused on the landing page, legal pages, brand assets, and release metadata; it is built and deployed independently from the LokSystem desktop application.

Homepage download buttons use the first-party redirect endpoint at
`https://api.lokai.net.cn/download/windows-x64`. The endpoint records only the
button placement and then redirects to the immutable CDN installer URL. Keep
`public/releases/latest.json` pointed directly at the CDN for machine-readable
release metadata.

The homepage also sends one cache-disabled, cookie-free page-view request to
`https://api.lokai.net.cn/telemetry/website-view.gif`. It carries only the
allowlisted page name so download conversion can be calculated without a
visitor identifier.
