import App from "./app.ts";

let g_app: App | null = null;

window.addEventListener("DOMContentLoaded", () => {
  let canvas = document.querySelector("#canvas") as HTMLCanvasElement;
  g_app = new App(canvas);
  run();

  function run() {
    g_app?.render();
    requestAnimationFrame(run);
  }
});

let g_timeout = 0;
window.addEventListener('resize', function () {
  const delay = 50;

  // Only resize some time after the last resize event
  // https://web.archive.org/web/20220714020647/https://bencentra.com/code/2015/02/27/optimizing-window-resize.html
  clearTimeout(g_timeout);
  g_timeout = setTimeout(resize, delay);

  function resize() {
    const maxDim = 400;

    let dim = Math.max(maxDim, Math.min(window.innerWidth, window.innerHeight));
    if (g_app) {
      g_app.setSize(dim - 100);
    }
  }
});
