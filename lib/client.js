/**
 * Browser half of the acrylic skin.
 *
 * The desktop shell owns the native DWM acrylic backdrop and marks the document
 * with `data-windows-material="acrylic"`. This bundle only paints the page
 * surfaces over that material: one translucent tint layer behind the chrome,
 * transparent caption/sidebar columns, and glass control fills. All selectors
 * are inactive on other platforms and on builds without the marker.
 */
;(() => {
  const CSS = `
html[data-windows-material='acrylic'],
html[data-windows-material='acrylic'] body {
  background: transparent;
}

html[data-windows-material='acrylic'] body {
  --dsh-acrylic-tint: color-mix(in srgb, color-mix(in srgb, var(--dsw-specific-sidebar-fill) 97%, rgb(122 155 240)) 40%, transparent);
  --dsh-acrylic-glass-fill: rgb(255 255 255 / 0.55);
  --dsh-acrylic-glass-hover: rgb(255 255 255 / 0.3);
  --dsh-acrylic-glass-collapsed-fill: transparent;
  --dsh-acrylic-glass-collapsed-hover: var(--dsw-alias-interactive-bg-hover);
}

html[data-windows-material='acrylic'] body[data-ds-dark-theme] {
  --dsh-acrylic-tint: color-mix(in srgb, var(--dsw-specific-sidebar-fill) 50%, transparent);
  --dsh-acrylic-glass-fill: rgb(255 255 255 / 0.15);
  --dsh-acrylic-glass-hover: rgb(255 255 255 / 0.2);
  --dsh-acrylic-glass-collapsed-fill: var(--dsh-acrylic-glass-fill);
  --dsh-acrylic-glass-collapsed-hover: var(--dsh-acrylic-glass-hover);
}

@media (prefers-reduced-transparency: reduce) {
  html[data-windows-material='acrylic'] body,
  html[data-windows-material='acrylic'] body[data-ds-dark-theme] {
    --dsh-acrylic-tint: color-mix(in srgb, var(--dsw-specific-sidebar-fill) 90%, transparent);
    --dsh-acrylic-glass-fill: var(--dsw-alias-button-elevated-fill);
    --dsh-acrylic-glass-hover: var(--dsw-alias-button-floating-hover);
    --dsh-acrylic-glass-collapsed-fill: transparent;
    --dsh-acrylic-glass-collapsed-hover: var(--dsw-alias-interactive-bg-hover);
  }
}

/* One tint layer behind all chrome; the caption strip and the expanded
   sidebar column stay transparent so the material and tint read as a single
   surface. The drawer keeps its column fill, and the content column keeps its
   own opaque base. */
html[data-windows-material='acrylic'] #root [data-slot='root'] > * {
  background: var(--dsh-acrylic-tint);
}

html[data-windows-material='acrylic'] #root [data-slot='root'] > *::before,
html[data-windows-material='acrylic'] #root [data-slot='root'] > *:not([data-sidebar-drawer]) > div:has(> [data-slot='sidebar']) {
  background: transparent;
}

/* The sidebar occupant paints its own opaque fill today. */
html[data-windows-material='acrylic'] #root [data-slot='sidebar'] > * {
  background: transparent;
}

/* The base fade blends into the opaque fill; over the material it paints a
   solid strip. */
html[data-windows-material='acrylic'] #root [data-slot='sidebar'] [class*='_scrollFade'] {
  display: none;
}

/* New Session rides the glass like the macOS vibrancy sidebar; a dialog
   sidebar keeps its elevated fill. */
html[data-windows-material='acrylic'] #root [data-slot='sidebar'] > *:not([role='dialog']) button[class*='_newSession'] {
  background: var(--dsh-acrylic-glass-fill);
}

html[data-windows-material='acrylic'] #root [data-sidebar-collapsed] [data-slot='sidebar'] > *:not([role='dialog']) button[class*='_newSession'] {
  background: var(--dsh-acrylic-glass-collapsed-fill);
}

@media (hover: hover) {
  html[data-windows-material='acrylic'] #root [data-slot='sidebar'] > *:not([role='dialog']) button[class*='_newSession']:hover {
    background: var(--dsh-acrylic-glass-hover);
  }

  html[data-windows-material='acrylic'] #root [data-sidebar-collapsed] [data-slot='sidebar'] > *:not([role='dialog']) button[class*='_newSession']:hover {
    background: var(--dsh-acrylic-glass-collapsed-hover);
  }
}
`

  window.__ModuleLoader__.load({
    id: 'dsh-acrylic-skin',
    factory: () => ({
      name: 'acrylic-skin',
      apply(ctx) {
        if (document.documentElement.dataset.windowsMaterial !== 'acrylic') {
          console.info('[dsh-acrylic-skin] native acrylic window marker is absent; the skin is inactive')
        }
        const style = document.createElement('style')
        style.dataset.plugin = 'dsh-acrylic-skin'
        style.dataset.dshAcrylicSkin = ''
        style.textContent = CSS
        ctx.effect(() => {
          ;(document.head ?? document.documentElement).append(style)
          return () => { style.remove() }
        }, 'acrylic-skin: acrylic window surfaces')
      },
    }),
  })
})()
