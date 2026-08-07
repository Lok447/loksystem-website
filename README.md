# LokSystem Website

Source for the official LokSystem product and download website at [www.lokai.net.cn](https://www.lokai.net.cn/). This repository is deployed independently from the Electron desktop application and never contains installer binaries or production credentials.

## Repository Scope

- Product positioning, workflows, supported capabilities, and system requirements
- Windows, macOS, and Linux download entry points with immutable release metadata
- Product screenshots and brand assets
- Privacy policy, user agreement, and other public legal pages
- Cookie-free, identifier-free homepage and download conversion events

Desktop application source lives in [Lok447/loksystem](https://github.com/Lok447/loksystem). Installers and release history live in [Lok447/loksystem-releases](https://github.com/Lok447/loksystem-releases/releases).

## Stack

- Vite
- React
- TypeScript

## Development

```bash
bun install
bun run dev
```

Open the URL printed by Vite. Before publishing, verify desktop and mobile layouts, every navigation target, all legal pages, and every download button.

## Build

```bash
bun run build
```

The production build is written to `dist/`. Deploy the built output as a versioned directory and switch the web root only after smoke testing the new version.

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

The homepage currently mirrors the same values in `src/App.tsx` for static rendering. Both sources must be changed in one commit so the visible download card and machine-readable metadata cannot drift.

## Product Screenshot

The hero automatically prefers a real product screenshot at:

```text
public/product/loksystem-app-screenshot.png
```

If that file is not present, the page falls back to a high-fidelity React product preview. This lets the website ship before the final marketing screenshot is captured.

## Download Hosting

The current primary downloads point to the mainland China update channel. Windows and Linux use the stable channel; macOS Apple Silicon uses an immutable versioned directory:

```text
https://update.lokai.net.cn/stable/LokSystem-2.0.8-win-x64.exe
https://update.lokai.net.cn/stable/LokSystem-2.0.8-linux-x64.deb
https://update.lokai.net.cn/prerelease/2.0.8-macos-beta-34c96ed/
```

GitHub Releases remains the mirror and release-history page. Installer binaries should stay in GitHub Releases, OSS, COS, S3, or a CDN. Keep this website repository focused on the landing page, legal pages, brand assets, and release metadata; it is built and deployed independently from the LokSystem desktop application.

Homepage download buttons use the first-party redirect endpoint at
`https://api.lokai.net.cn/download/windows-x64`,
`https://api.lokai.net.cn/download/macos-arm64`, and
`https://api.lokai.net.cn/download/linux-x64`. These endpoints record only the
button placement and selected platform, then redirect to the immutable CDN installer URL. Keep
`public/releases/latest.json` pointed directly at the CDN for machine-readable
release metadata.

The homepage also sends one cache-disabled, cookie-free page-view request to
`https://api.lokai.net.cn/telemetry/website-view.gif`. It carries only the
allowlisted page name so download conversion can be calculated without a
visitor identifier.

## Release Checklist

1. Publish the immutable installer and automatic-update metadata to the release channel.
2. Calculate the final file size and SHA-256 from the published installer.
3. Update `public/releases/latest.json` and the matching values in `src/App.tsx`.
4. Run `bun run lint` and `bun run build`.
5. Verify navigation, legal pages, download redirects, and responsive layouts locally.
6. Deploy `dist/` to a new versioned server directory, then switch the active web root.
7. Verify HTTPS, the root and `www` domains, the CDN download, and conversion events in production.

Do not commit access keys, deployment tokens, private certificates, analytics identifiers, or copies of the installer to this repository.
