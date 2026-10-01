
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-competencies',
    imports: [TranslateModule],
    templateUrl: './competencies.component.html',
    styleUrl: './competencies.component.scss'
})
export class CompetenciesComponent {
isVisible = false;

/** Раскрыта только одна карточка услуг одновременно. */
openCard: string | null = null;

toggleCard(key: string) {
  this.openCard = this.openCard === key ? null : key;
}

/**
 * Список публикаций — наименования и DOI не переводятся, примечания берутся
 * из i18n (COMPETENCIES.RESEARCH.PUB_N_NOTE). `html` рендерится через
 * [innerHTML] — <strong> отмечает фамилии, выделенные жирным в исходном
 * документе (Материал для сайта ДНПИ.docx); содержимое статично и задаётся
 * только из кода, пользовательского ввода в нём нет.
 */
publications = [
  {
    html: '<strong>Bekniyaz B.</strong>; Zinabdin N.; <strong>Baisholanov S.; Vakassova G</strong>.; Rakhmetov I.; <strong>Ussenov D</strong>. Ecological risk assessment for phytomelioration planning of a dried sea-bed. Global Journal of Environmental Science and Management 2026, 12(3). Serial #47.',
    doi: 'https://doi.org/10.22034/gjesm.2026.03.07',
    tail: '(Quartiles: Scopus Q1, Percentile: 63, Cite Score: 4.9, WOS Impact Factor: 2.9)',
    noteKey: 'COMPETENCIES.RESEARCH.PUB_1_NOTE'
  },
  {
    html: 'Mukanov, Y.; Arystanova, R.; Sagin, J.; Samarkhanov, K.; Usmanov, T.; <strong>Baisholanov, S</strong>.; Arystanov, A.; Koshim, A.; Duisebek, B.; Zhukenova, A. A Statistical Analysis of Multi-Decadal Trends in Temperature, Precipitation and Drought Indices in Eastern and Southeastern Kazakhstan Between 1981 and 2023. Agronomy 2026, 16, 1097.',
    doi: 'https://doi.org/10.3390/agronomy16111097',
    tail: '(Quartiles: Scopus Q1, Percentile: 72, Cite Score: 6.7, WOS Impact Factor: 3.4)',
    noteKey: 'COMPETENCIES.RESEARCH.PUB_2_NOTE'
  },
  {
    html: '<strong>Barmakova, D.B.</strong>, Rodrigo-Ilarri, J., <strong>Shakibayev, I.I.,</strong> Rodrigo-Clavero M-E., Yerikuly Zh., Zavaley V.A. Long-term dynamics of groundwater levels under rice-based irrigation systems in South-East Kazakhstan. Paddy and Water Environment (Germany, Springer Nature) <strong>24</strong>, 139–153 (2026).',
    doi: 'https://doi.org/10.1007/s10333-026-01056-9',
    tail: '(Quartiles: Scopus Q2, Percentile: 66, Cite Score: 1.2, WOS Impact Factor: 2.1)',
    noteKey: 'COMPETENCIES.RESEARCH.PUB_3_NOTE'
  },
  {
    html: 'Kaimuldinova, K., Laiskhanov, S., Alimbekova, G., Sharapkhanova, Z., <strong>Kerimsheev, S.</strong> INTEGRAL ASSESSMENT OF SOIL SALINIZATION AND WATER RESOURCE USE CONDITION FOR THE PURPOSE OF SUSTAINABLE LAND USE. Journal of the Geographical Institute “Jovan Cvijić” SASA, 2026, 76(2), 225–242.',
    doi: 'https://ojs.gi.sanu.ac.rs/index.php/zbornik/article/view/1349',
    tail: '(Quartiles: Scopus Q2, Cite Score: 0.31, WOS Impact Factor: 1.4)',
    noteKey: 'COMPETENCIES.RESEARCH.PUB_4_NOTE'
  },
  {
    html: 'Кужинов М.Б., Акшалов К.А., Жұмабек Б., <strong>Байшоланов С.С.</strong>, Баймуканова О.Н. Агроклиматические ресурсы и продуктивность яровой пшеницы в засушливых условиях Казахстана: анализ, решения, потенциал // Евразийский агротехнический журнал, 2026. 1(129). 262-275.',
    doi: 'https://doi.org/10.51452/eaj.2026.1(129).2137',
    noteKey: 'COMPETENCIES.RESEARCH.PUB_5_NOTE'
  },
  {
    html: 'Жұмабек Б., Ақшалов Қ.А., Баймуканова О.Н., Бисетаев К.С., Пилипчук А.П., <strong>Байшоланов С.С.</strong> Топырақ өңдеу жүйелеріне байланысты топырақтың физикалық қасиеттерінің өзгерісі // Еуразиялық агротехникалық журнал, 2026. 2(130), 182-192.',
    doi: 'https://doi.org/10.51452/eaj.2026.2(130).2136',
    noteKey: 'COMPETENCIES.RESEARCH.PUB_6_NOTE'
  },
  {
    html: '<strong>Баймаханов Ө.С.,</strong> Абдукодирова М.Н., Ақылбаев Қ.И., <strong>Шегенбаев А.Т.,</strong> Олжабаев А.О. Қызылорда қаласы мысалында төгінді суларды ауыл шаруашылығында пайдалануды ғылыми-технологиялық тұрғыдан зерттеу // «Ізденістер, нәтижелер – Исследования, результаты» Научный журнал КазНАИУ, Том 28, 3 (111), 2026. С. 136-146.',
    doi: 'https://doi.org/10.37884/3-2026/11',
    noteKey: 'COMPETENCIES.RESEARCH.PUB_7_NOTE'
  },
  {
    html: 'Қазақстандық Арал өңірі суармалы жерлердің гидрогеологиялық-мелиоративтік жағдайлары және ұтымды пайдалану, жақсарту жолдарын ғылыми зерттеу (Ұсыным). Құрастырған <strong>Баймаханов Ө.С.</strong> Қазақстан Республикасы Су ресурстары және ирригация министрлігі «Қазгидрогеология» ұлттық гидрогеологиялық қызметі» «Қызылорда филиалы». Қызылорда, 2026. 68 бет.',
    noteKey: 'COMPETENCIES.RESEARCH.PUB_8_NOTE'
  },
  {
    html: '<strong>Бекнияз Б.К.</strong> Деятельность НАО «Национальная гидрогеологическая служба «Казгидрогеология». Международный геологический форум «GEOSCIENCE & EXPLORATION CENTRAL ASIA», Астана, 2–3 апреля 2026 года.',
    noteKey: 'COMPETENCIES.RESEARCH.PUB_9_NOTE'
  },
  {
    html: '<strong>Байшоланов С.С., Вакасова Г.Т.</strong> Оценка влияния весенних паводков на режим грунтовых вод (на примере р. Жабай). Совещание Казахстанского национального комитета Межправительственной гидрологической программы ЮНЕСКО (ЮНЕСКО-МГП), ООН Плаза, Алматы, 10 июня 2026 года.',
    noteKey: 'COMPETENCIES.RESEARCH.PUB_10_NOTE'
  },
  {
    html: '<strong>Байшоланов С.С.</strong> Глобальные и региональные климатические изменения и сельскохозяйственное производство. Международная научно-практическая конференция «Современная аграрная наука: инновационные решения в земледелии, растениеводстве и селекции», посвященной 70-летию ТОО «Научно-производственный центр зернового хозяйства им. А.И. Бараева» 23–24 июля 2026 года.',
    noteKey: 'COMPETENCIES.RESEARCH.PUB_11_NOTE'
  }
];

ngOnInit() {
  setTimeout(() => {
    this.isVisible = true;
  }, 50);
}
}
