# Vynpad website

Public product website in Brazilian Portuguese, English and Spanish. Product source is maintained in a separate private repository. The site is static, contains no analytics, and does not connect to a user's input receiver.

```sh
npm run check
npm run build
npm run preview
```

The preview runs at http://127.0.0.1:4180. GitHub Actions builds and publishes `dist/` to GitHub Pages on main. Copy lives in `src/copy.js`; HTML is rendered for each language by `build.mjs`. The interactive touchpad demonstration is restricted to a simulated cursor inside the page.

This is a development preview. Do not describe untested platforms, universal Bluetooth compatibility or store availability as released features. Binaries published in Releases must state their signing and validation status.
