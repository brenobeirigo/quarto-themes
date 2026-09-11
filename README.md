# quarto-dact-theme

The HTML look and feel of the *Data Analysis and Computational Thinking* book,
packaged as a Quarto **format extension** so it can be installed into any
Quarto book or website with one command.

The extension bundles:

- the light (`cosmo`) and dark (`darkly`) Bootstrap themes with the DACT SCSS
  overrides (Jost / Libre Franklin fonts, palette, headings, callouts, navbar);
- the component stylesheets (tables, decision tables, MCQ, Excel, Mermaid
  flowcharts, pseudocode terminal, citations, reader mode, responsive layout,
  black-and-white print, home page and syllabus cards);
- four after-body scripts: flowchart layout, keyboard-accessible solution
  callouts, exercise-number copy buttons, and full-width table regions.

## Install

From GitHub (after this repo is pushed):

```bash
quarto add brenobeirigo/quarto-dact-theme
```

From a local clone:

```bash
quarto add ../quarto-dact-theme
```

Either command copies the extension into `_extensions/dact/` of the current
project. Update later with `quarto update brenobeirigo/quarto-dact-theme`.

## Use

Replace `html` with `dact-html` in `_quarto.yml` (works for books, websites,
and single documents):

```yaml
format:
  dact-html: default
```

Any regular HTML option can still be set under `dact-html`:

```yaml
format:
  dact-html:
    toc-depth: 3
    number-sections: true
```

For books, also set `reader-mode: true` under `book:` to get the wide
reader-mode layout the stylesheet expects.

### Disabling individual scripts

Each after-body script can be switched off from document or project metadata:

```yaml
dact:
  flowchart-layout: false
  solution-callouts: false
  exercise-numbering: false
  table-layout: false
```

### Overriding the theme

Setting `theme:` under `dact-html` replaces the bundled SCSS entirely. To
extend it instead, keep the bundled files first:

```yaml
format:
  dact-html:
    theme:
      light: [cosmo, _extensions/dact/scss/dact-theme.scss, my-tweaks.scss]
      dark: [darkly, _extensions/dact/scss/dact-theme-dark.scss, my-tweaks.scss]
```

## Layout

```
_extensions/dact/
  _extension.yml   format definition (theme, css, filter)
  dact.lua         injects the js/ files after <body>
  scss/            dact-theme.scss, dact-theme-dark.scss
  css/             component stylesheets
  js/              after-body scripts
example/           minimal book that uses the format
```

## Try the example

```bash
cd example
quarto add .. --no-prompt
quarto render
```

## Source of truth

These files originated in the `styles/` and `assets/` folders of the
`course-dact` repository. Edit them here and bump `version` in
`_extension.yml`; downstream projects pick the change up with `quarto update`.
