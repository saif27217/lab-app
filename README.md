# lab-app — bare-bones Expo (SDK 58) React Native starter

Minimal multi-screen Expo app used as a from-scratch reference scaffold
(built and run on a headless Linux box, tested in Expo Go on Android).

## Layout

```
src/
  app/
    _layout.tsx        ThemeProvider (light/dark) + StatusBar
    index.tsx          /        home screen, links to /stats
    stats.tsx          /stats   second routed screen
  hooks/
    use-stopwatch.ts   RN-style custom hook (seconds since render)
  utils/
    format.ts          pure logic (formatReading) — unit-testable
    format.test.ts     node:test suite
```

## Run

```bash
npm test                          # node --test on the pure utils layer
npx tsc -p tsconfig.json --noEmit # full project typecheck
npx expo start --port 8081        # dev server (Metro)
```

Phone side (Expo Go, when the server runs on a remote box):

```bash
ssh -N -L 8081:localhost:8081 user@vps   # from Termux / laptop
# then in Expo Go: "Enter URL manually" -> http://localhost:8081
```

## Notes

- `create-expo --template empty` resolves to an unrelated npm package; the
  default template + manual reset (`scripts/reset-project.js` or rm) is the
  reliable path.
- expo-router v58 `Link` prop is `href`, not `to`.
- Test files are excluded from the app build (`tsconfig` exclude) because TS6
  resolves `node:test`/`node:assert` types via package.json `types` field, not
  `@types/node` alone.
- Signed Expo tour tunnels require expo.dev login; an SSH port-forward works
  with zero credentials.
