import { NewsItem, NEWS_PLACEHOLDER_IMAGE } from '../models/news.model';
import { pickLang } from './news-lang.util';

const BASE = 'assets/images/news-topics';

/**
 * Категории идут в порядке проверки — первое совпадение побеждает,
 * поэтому более специфичные темы (дети, предприятия) стоят раньше общей «воды».
 */
const TOPICS: { image: string; keywords: string[] }[] = [
  {
    image: `${BASE}/education.svg`,
    keywords: ['дет', 'школ', 'учащ', 'студент', 'балалар', 'мектеп', 'оқушы']
  },
  {
    image: `${BASE}/industry.svg`,
    keywords: ['предприят', 'завод', 'производ', 'промышлен', 'кәсіпорын', 'зауыт']
  },
  {
    image: `${BASE}/agriculture.svg`,
    keywords: ['сельск', 'аграр', 'ирригац', 'орошен', 'полив', 'егіс', 'ауыл шаруашылығ', 'суару']
  },
  {
    image: `${BASE}/ecology.svg`,
    keywords: ['эколог', 'природ', 'окружающ', 'қоршаған орта', 'табиғат']
  },
  {
    image: `${BASE}/civic.svg`,
    keywords: ['день', 'праздник', 'траур', 'памят', 'күні', 'аза тұту', 'указ', 'жарлық', 'юбилей']
  },
  {
    image: `${BASE}/water.svg`,
    keywords: ['вода', 'воды', 'водн', 'гидро', 'водоём', 'водоснаб', 'водохран', 'су ', 'суды', 'сумен', 'өзен', 'көл']
  }
];

const DEFAULT_TOPIC_IMAGE = `${BASE}/water.svg`;

/**
 * Картинка для карточки новости: реальное фото, если оно есть и подтверждено
 * рабочим (см. preloadImage), иначе — тематическая иллюстрация, подобранная
 * по ключевым словам в заголовке/тексте (без ИИ, без затрат).
 *
 * `treatAsUnverified` заставляет вернуть иконку, даже если реальное фото есть —
 * используется, пока ссылка (часто временная, из Telegram CDN) ещё не проверена
 * на загрузку, чтобы не показывать фото, которое тут же сменится на иконку.
 */
export function pickTopicImage(item: NewsItem, lang: string, treatAsUnverified = false): string {
  if (item.image !== NEWS_PLACEHOLDER_IMAGE && !treatAsUnverified) {
    return item.image;
  }

  const text = `${pickLang(item.title, lang)} ${pickLang(item.preview, lang)}`.toLowerCase();
  const topic = TOPICS.find(t => t.keywords.some(k => text.includes(k)));
  return topic?.image ?? DEFAULT_TOPIC_IMAGE;
}

/** Пробует загрузить картинку в память, не показывая её — резолвится в true/false. */
export function preloadImage(url: string): Promise<boolean> {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
}

/**
 * Проверяет в фоне картинки новостей, которых ещё нет в `verified`, и заносит туда
 * те, что реально загрузились; битые — сразу помечает плейсхолдером (см. news.model).
 * Пока проверка не завершена, thumbSrc() отдаёт иконку — фото появится, только когда
 * подтвердится, что оно живое (без «мигания» фото → плейсхолдер на глазах у пользователя).
 */
export function trackVerifiedImages(items: NewsItem[], verified: Set<NewsItem['id']>): void {
  for (const item of items) {
    if (item.image === NEWS_PLACEHOLDER_IMAGE || verified.has(item.id)) {
      continue;
    }
    preloadImage(item.image).then(ok => {
      if (ok) {
        verified.add(item.id);
      } else {
        item.image = NEWS_PLACEHOLDER_IMAGE;
      }
    });
  }
}
