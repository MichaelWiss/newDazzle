# newDazzle

## Development

- Run dev server: `npm run dev`
- Build for production: `npm run build`
- Validate media references: `npm run check:media-paths`

## CI

GitHub Actions runs build + media-path validation on every push and pull request via [ci.yml](./.github/workflows/ci.yml).

## Build artifact policy

- [dist](./dist) is a generated build output and is not committed.
- Recreate it locally with `npm run build` when needed.

## Media asset source of truth

- Runtime project media is served from [public/assets/img](./public/assets/img).
- All project media paths in [assets/js/data.js](./assets/js/data.js) must point to `/assets/img/...` files that exist in `public/assets/img`.
- Static image references use `.webp` and videos use `.webm` (or `.mp4` when needed).

