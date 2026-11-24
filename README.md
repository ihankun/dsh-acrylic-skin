# dsh-acrylic-skin

English | [中文](README.zh.md)

Windows acrylic skin for DeepSeek Harness Desktop. The caption strip and sidebar become translucent panes over the native DWM acrylic backdrop; the conversation content stays opaque.

This is a browser plugin bundled with an empty Host half. It paints the page surfaces only. The desktop shell owns the native window material.

## Requirements

- DeepSeek Harness Desktop on **Windows 11 22H2 (build 22621) or later**.
- A desktop shell that enables the acrylic backdrop and marks the document root with `data-windows-material="acrylic"`. That marker is what activates this plugin; every selector is scoped to it, so the plugin is inert on other platforms and on builds without the shell support.
- A shell whose main window is transparent, with a transparent Windows titlebar overlay. A renderer plugin cannot change `BrowserWindow` options; without those shell settings there is no material to show through.

The `dev` branch of `deepseek-harness` at the time of writing provides those shell settings and the marker. A build without them shows no visual change, not a broken layout.

## Install

Install the bundle into the Desktop profile from the repository:

```sh
dsh plugin --profile desktop add github:ihankun/dsh-acrylic-skin#<full-commit>
```

Use a full 40-character commit for a reproducible install. The plugin manager adds the bundle to the profile, and the bundle patch mounts the Host row whose package also supplies the browser half. Restart Desktop if the install result reports `restart-required`; with HMR the skin applies immediately.

Remove it with:

```sh
dsh plugin --profile desktop remove dsh-acrylic-skin
```

## What it changes

- The page and window background become transparent so the native material shows through.
- One translucent tint layer is painted on the app frame; the caption strip and sidebar column stay transparent, so the tint and material read as one surface.
- The light tint mixes the theme's sidebar fill with a faint blue, then thins it to 40%; dark mode uses 50% without the blue cast and shifts the glass fills. Custom themes follow `--dsw-specific-sidebar-fill`.
- The New Session control uses the same glass fills as the macOS vibrancy sidebar, including its collapsed state.
- The sidebar scroll fade is hidden because its opaque gradient would paint a strip over the material.
- `prefers-reduced-transparency: reduce` raises the tint to 90% and restores opaque control fills.

The content column keeps its opaque base, so conversations, panels, and dialogs are unchanged.

## How the browser half attaches

The package declares both faces:

- `dsh.bundle.patch` inserts the `acrylic-skin` Host row.
- `dsh.client.platform: "web"` plus `exports["./client"]` supplies the browser bundle for that row.

The browser bundle registers a Cordis plugin with `window.__ModuleLoader__.load`, adds one `<style data-plugin="dsh-acrylic-skin">` in `apply`, and removes it through `ctx.effect` when the plugin unloads. Selectors use the renderer's stable `data-slot` anchors (`root`, `sidebar`) rather than CSS-module hashes. The two cosmetic selectors that still name module classes use the `_scrollFade` and `_newSession` suffixes.

There is no build step: `lib/client.js` carries its stylesheet inline.

## Compatibility

`engines.dsh` requires `>=0.2.2-rc.5`. The skin targets that client DOM. The acrylic material itself still needs a shell that sets the marker: the 0.2.2-rc.5 desktop release uses acrylic only for its welcome window, so the skin stays inactive there. A future sidebar redesign may rename the two class suffixes; the tint, transparency, and glass fills then need a matching selector update. Everything else keys off slot anchors and theme tokens.

The skin duplicates the built-in acrylic rules currently present on the `deepseek-harness` `dev` branch. It exists so the visual treatment can ship as a plugin; when the shell keeps only the native material support, this plugin supplies the page surfaces on its own.

## License

MIT
