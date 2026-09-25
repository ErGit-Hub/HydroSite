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
 * Картинка для карточки новости: реальное фото, если оно есть, иначе — тематическая
 * иллюстрация, подобранная по ключевым словам в заголовке/тексте (без ИИ, без затрат).
 */
export function pickTopicImage(item: NewsItem, lang: string): string {
  if (item.image !== NEWS_PLACEHOLDER_IMAGE) {
    return item.image;
  }

  const text = `${pickLang(item.title, lang)} ${pickLang(item.preview, lang)}`.toLowerCase();
  const topic = TOPICS.find(t => t.keywords.some(k => text.includes(k)));
  return topic?.image ?? DEFAULT_TOPIC_IMAGE;
}
