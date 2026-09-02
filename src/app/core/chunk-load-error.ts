import { NavigationError } from '@angular/router';

/**
 * Продакшн-сборка хэширует имена чанков, поэтому после деплоя открытая у
 * пользователя вкладка просит старый чанк. SPA-fallback отдаёт на него
 * index.html со статусом 200, и динамический import падает на разборе HTML.
 */
const CHUNK_LOAD_ERROR =
  /ChunkLoadError|Loading chunk|dynamically imported module|Importing a module script failed|Unexpected token '<'/i;

const RELOAD_KEY = 'hydro-site:chunk-reload';

/** Защита от цикла: если после перезагрузки чанк всё ещё не грузится. */
const RELOAD_COOLDOWN_MS = 10_000;

export function isChunkLoadError(error: unknown): boolean {
  const message = error instanceof Error ? `${error.name} ${error.message}` : String(error);
  return CHUNK_LOAD_ERROR.test(message);
}

/**
 * Единственный способ подтянуть новые чанки — перезагрузить страницу
 * по тому же адресу, чтобы браузер получил свежий index.html.
 */
export function handleNavigationError(event: NavigationError): void {
  if (!isChunkLoadError(event.error)) {
    console.error('Navigation error:', event.error);
    return;
  }

  if (!recentlyReloaded()) {
    location.assign(event.url);
  }
}

function recentlyReloaded(): boolean {
  try {
    const last = Number(sessionStorage.getItem(RELOAD_KEY) ?? 0);
    if (Date.now() - last < RELOAD_COOLDOWN_MS) {
      return true;
    }
    sessionStorage.setItem(RELOAD_KEY, String(Date.now()));
  } catch {
    // приватный режим — просто не защищаемся от цикла
  }
  return false;
}
