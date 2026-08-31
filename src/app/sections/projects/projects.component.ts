
import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
    selector: 'app-projects',
    imports: [],
    templateUrl: './projects.component.html',
    styleUrl: './projects.component.scss'
})
export class ProjectsComponent  {
isVisible = false;
projects = [
  {
    title: 'Система мониторинга подземных вод Южного Казахстана',
    description: 'Создание автоматизированной системы мониторинга 50 наблюдательных скважин с передачей данных в реальном времени.',
    location: 'Туркестанская область',
    period: '2024–2026',
    status: 'В процессе',
    progress: 75,
    image: 'assets/images/projects/project1.png'
  },
  {
    title: 'Оценка запасов подземных вод Алматинской агломерации',
    description: 'Комплексная оценка эксплуатационных запасов подземных вод для обеспечения водоснабжения.',
    location: 'Алматинская область',
    period: '2025–2027',
    status: 'В процессе',
    progress: 45,
    image: 'assets/images/projects/project2.png'
  },
  {
    title: 'Модернизация аналитической лаборатории',
    description: 'Установка нового оборудования для анализа воды.',
    location: 'Астана',
    period: '2025–2026',
    status: 'В процессе',
    progress: 60,
    image: 'assets/images/projects/project3.png'
  },
  {
    title: 'Гидрогеологическая карта Казахстана',
    description: 'Создание цифровой карты с использованием ГИС.',
    location: 'Вся территория РК',
    period: '2020–2023',
    status: 'Завершен',
    progress: 100,
    image: 'assets/images/projects/project4.png'
  },
  {
    title: 'Программа защиты подземных вод',
    description: 'Разработка мероприятий по защите вод от загрязнения.',
    location: 'Карагандинская область',
    period: '2022–2024',
    status: 'Завершен',
    progress: 100,
    image: 'assets/images/projects/project5.png'
  },
  {
    title: 'Исследование водоносных горизонтов',
    description: 'Фундаментальные исследования гидрогеологии региона.',
    location: 'Атырауская область',
    period: '2027–2029',
    status: 'Планируется',
    progress: 0,
    image: 'assets/images/projects/project6.png'
  }
];
 safeUrl: SafeResourceUrl;
 constructor(private sanitizer: DomSanitizer) {
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      'https://hydro.krpro.kz/'
    );
  }
ngOnInit() {
  setTimeout(() => {
    this.isVisible = true;
  }, 50);
}

}
