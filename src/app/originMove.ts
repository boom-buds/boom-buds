// The game moved from mayerwin.github.io/Boom-Buds/ to boom-buds.github.io on 2026-11-23. Browsers keep saved data per
// site, so the redirect page left at the old address (repository mayerwin/mayerwin.github.io, Boom-Buds/index.html)
// reads the player's settings and level-editor schemes there and hands them over in the address fragment:
// #bb-move=<base64url of a JSON object { localStorage key: value }>. The fragment never reaches a server.
// Keys already present here are kept (they are newer than the old site's), and the fragment is then removed.

const PREFIX = '#bb-move=';
const KEPT = /^boombuds\.(settings|schemes)\./;

export function importFromOldSite(): void {
  try {
    if (!location.hash.startsWith(PREFIX)) return;
    const b64 = location.hash.slice(PREFIX.length).replace(/-/g, '+').replace(/_/g, '/');
    const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
    const data = JSON.parse(new TextDecoder().decode(bytes)) as Record<string, unknown>;
    for (const [k, v] of Object.entries(data)) {
      if (KEPT.test(k) && typeof v === 'string' && localStorage.getItem(k) === null) localStorage.setItem(k, v);
    }
  } catch (e) {
    console.warn('Could not bring the settings over from the old address', e);
  } finally {
    if (location.hash.startsWith(PREFIX)) history.replaceState(null, '', location.pathname + location.search);
  }
}
