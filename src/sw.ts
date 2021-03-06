const isLocalhost = (): boolean =>
  window.location.hostname === "localhost" ||
  window.location.hostname === "[::1]" ||
  Boolean(
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
  );

// Ideas drawn from this blog.
// https://krishankantsinghal.medium.com/pwa-how-to-create-a-pwa-react-app-using-typescript-95564ab6390c
const register = () => {
  if (!("serviceWorker" in navigator)) {
    return;
  }
  const pubUrl = new URL(process.env.PUBLIC_URL, window.location.toString());
  if (pubUrl.origin !== window.location.origin) {
    // Our service worker won't work if PUBLIC_URL is on a different origin
    // from what our page is served on. This might happen if a CDN is used to
    // serve assets; see https://github.com/facebookincubator/create-react-app/issues/2374
    return;
  }
  window.addEventListener("load", () => {
    const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;
    if (isLocalhost()) {
    }
  });
};

export default register;
