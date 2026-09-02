import { Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';

/** Ленивая загрузка страницы 404: маршрут `**` и программный переход на `/404`. */
const notFound = () =>
  import('./pages/not-found/not-found.component').then(m => m.NotFoundComponent);

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  // Главная — в начальном бандле: её открывает каждый посетитель.
  { path: 'home', component: HomeComponent },

  {
    path: 'about',
    title: 'О предприятии',
    loadComponent: () => import('./sections/about/about.component').then(m => m.AboutComponent)
  },
  {
    path: 'activity',
    title: 'Направления деятельности',
    loadComponent: () => import('./sections/activity/activity.component').then(m => m.ActivityComponent)
  },
  {
    path: 'govement',
    title: 'Государственный уровень',
    loadComponent: () => import('./sections/govement/govement.component').then(m => m.GovementComponent)
  },
  {
    path: 'services',
    title: 'Услуги',
    loadComponent: () => import('./sections/services/services.component').then(m => m.ServicesComponent)
  },
  {
    path: 'structure',
    title: 'Структура',
    loadComponent: () => import('./sections/structure/structure.component').then(m => m.StructureComponent)
  },
  {
    path: 'reception',
    title: 'Приём граждан',
    loadComponent: () => import('./sections/reception/reception.component').then(m => m.ReceptionComponent)
  },
  {
    path: 'contacts',
    title: 'Контакты',
    loadComponent: () => import('./sections/contacts/contacts.component').then(m => m.ContactsComponent)
  },
  {
    path: 'projects',
    title: 'Проекты',
    loadComponent: () => import('./sections/projects/projects.component').then(m => m.ProjectsComponent)
  },
  {
    path: 'vacancies',
    title: 'Вакансии',
    loadComponent: () => import('./sections/vacancies/vacancies.component').then(m => m.VacanciesComponent)
  },
  {
    path: 'anti-corruption',
    title: 'Противодействие коррупции',
    loadComponent: () =>
      import('./sections/anti-corruption/anti-corruption.component').then(m => m.AntiCorruptionComponent)
  },
  {
    path: 'ombucmen',
    title: 'Корпоративный омбудсмен',
    loadComponent: () => import('./sections/ombucmen/ombucmen.component').then(m => m.OmbucmenComponent)
  },
  {
    path: 'news',
    title: 'Новости',
    loadComponent: () => import('./sections/news/news.component').then(m => m.NewsComponent)
  },
  {
    path: 'news/:id',
    title: 'Новости',
    loadComponent: () =>
      import('./sections/news/news-details/news-details.component').then(m => m.NewsDetailsComponent)
  },

  // Адресуемая 404: на неё уходят страницы, не нашедшие свои данные.
  { path: '404', title: 'Страница не найдена', loadComponent: notFound },

  // Неизвестный путь: адрес в строке сохраняем, чтобы была видна опечатка.
  { path: '**', title: 'Страница не найдена', loadComponent: notFound }
];
