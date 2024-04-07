## Create
```
⫸ cd C:\Users\psobo\Development\rust
⫸ pnpm create tauri-app
✔ Project name · clock-cal
✔ Choose which language to use for your frontend · TypeScript / JavaScript - (pnpm, yarn, npm, bun)
✔ Choose your package manager · pnpm
✔ Choose your UI template · Vanilla
✔ Choose your UI flavor · TypeScript

Template created! To get started run:
  cd clock-cal
  pnpm install
  pnpm tauri dev
```
## Develop
```
> pnpm tauri dev
```
Except to run the app on the desktop, this program doesn't use Rust at all, so it can also be run as a web page: 
```
> pnpm dev
```
## Deploy
```
> pnpm tauri build
```
This command compiles the TypeScript and builds the website with `vite` and the executable with `tauri`. The processed web site is placed in `.\dist`. The exeutable is placed in `.\src-tauri\release` and the installers are placed in `.\src-tauri\target\release\bundle`.