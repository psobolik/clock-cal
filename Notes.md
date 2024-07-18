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
This command compiles the TypeScript source and bundles the website with `vite` and builds the executable and installers with `tauri`. 

The website files are placed in `.\dist` and the executable in `.\src-tauri\target\release`.

On Windows, installers are placed in `.\src-tauri\target\release\bundle\msi` and `.\src-tauri\target\release\bundle\nsis`.

On macOS, the DMG will be in `./src-tauri/target/release/bundle/dmg` and the bundled Mac App will be in `./src-tauri/target/release/bundle/macos`.

On Linux, the installers will be in `./src-tauri/target/release/appimage` and `./src-tauri/target/release/deb`. 

