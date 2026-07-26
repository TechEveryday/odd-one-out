# odd-one-out

A card game to played with a minimum of 3 people.

Vue 3 + Pinia + Vite, wrapped by Capacitor 8 for iOS and Android. The game is **fully
offline** — nothing is fetched, no accounts, no analytics. Game state is kept on-device
with `@capacitor/preferences` so a round survives the app being backgrounded or killed.

## Local Environment (mac)

- Install nvm `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash`
- Install Node v22 `nvm install 22`

1. Run `nvm use` so that you'll use the the same version of node as the project
2. Run `npm i` to install dependencies
3. To get the application running, run `npm run dev`

**Node 22 is required, not just recommended.** On Node 20 or older, npm silently resolves
`@capacitor/cli` down to v7 against a v8 runtime and the iOS build breaks in ways that do
not point back at the Node version.

To lint do `npm run lint`
To format do `npm run format`

## Mobile

| Command | |
|---|---|
| `npm run cap:sync` | build the web bundle, then copy it into both native projects |
| `npm run cap:ios` | sync, then open the project in Xcode |
| `npm run cap:android` | sync, then open the project in Android Studio |

`cap sync` copies `dist/` into the native shells, so **a native run only ever shows the
last build** — `npm run dev` changes are not picked up until you sync again.

### Requirements

- **iOS**: Xcode. Capacitor 8 uses Swift Package Manager, so CocoaPods is not needed.
- **Android**: Android Studio and a JDK. Without a JDK, `cap add`/`cap sync` skips the
  Gradle sync and prints a warning; import the project in Android Studio once and it
  will sync itself.

### App identity

`capacitor.config.ts` holds the bundle id (`com.techeveryday.oddoneout`) and the display
name. The id is baked into the store listing and is painful to change after the first
publish — set it before shipping.

The background colour appears in four places that must agree, or the app flashes a
mismatched frame on launch: `--bg` in `src/assets/base.css`, `<meta name="theme-color">`
in `index.html`, and `ios.backgroundColor` / `android.backgroundColor` in
`capacitor.config.ts`.

### Layout notes

`index.html` sets `viewport-fit=cover`, which is what makes `env(safe-area-inset-*)`
resolve to anything other than zero. The shell in `src/assets/main.css` relies on those
insets to keep clear of the notch and the home indicator; drop the meta tag and the
layout runs under the hardware.

Routing uses **hash history**. Capacitor serves the bundle from a local origin with no
server-side rewrite, so a path like `/draw` has nothing to fall back to `index.html` on
reload.
