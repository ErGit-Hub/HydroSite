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
    title: 'HEADER.ABOUT_PAGE',
    loadComponent: () => import('./sections/about/about.component').then(m => m.AboutComponent)
  },
  {
    path: 'activity',
    title: 'HEADER.ACTIVITY',
    loadComponent: () => import('./sections/activity/activity.component').then(m => m.ActivityComponent)
  },
  {
    path: 'services',
    title: 'HEADER.SERVICES',
    loadComponent: () => import('./sections/services/services.component').then(m => m.ServicesComponent)
  },
  {
    path: 'structure',
    title: 'HEADER.STRUCTURE',
    loadComponent: () => import('./sections/structure/structure.component').then(m => m.StructureComponent)
  },
  {
    path: 'reception',
    title: 'HEADER.RECEPTION',
    loadComponent: () => import('./sections/reception/reception.component').then(m => m.ReceptionComponent)
  },
  {
    path: 'contacts',
    title: 'HEADER.CONTACTS',
    loadComponent: () => import('./sections/contacts/contacts.component').then(m => m.ContactsComponent)
  },
  {
    path: 'projects',
    title: 'HEADER.PROJECTS',
    loadComponent: () => import('./sections/projects/projects.component').then(m => m.ProjectsComponent)
  },
  {
    path: 'vacancies',
    title: 'HEADER.VACANCIES',
    loadComponent: () => import('./sections/vacancies/vacancies.component').then(m => m.VacanciesComponent)
  },
  {
    path: 'anti-corruption',
    title: 'HEADER.ANTI_CORRUPTION',
    loadComponent: () =>
      import('./sections/anti-corruption/anti-corruption.component').then(m => m.AntiCorruptionComponent)
  },
  {
    path: 'ombucmen',
    title: 'HEADER.OMBUDSMAN',
    loadComponent: () => import('./sections/ombucmen/ombucmen.component').then(m => m.OmbucmenComponent)
  },
  {
    path: 'security',
    title: 'HEADER.SECURITY',
    loadComponent: () => import('./sections/security/security.component').then(m => m.SecurityComponent)
  },
  {
    path: 'news',
    title: 'HEADER.NEWS',
    loadComponent: () => import('./sections/news/news.component').then(m => m.NewsComponent)
  },
  {
    path: 'news/:id',
    title: 'HEADER.NEWS',
    loadComponent: () =>
      import('./sections/news/news-details/news-details.component').then(m => m.NewsDetailsComponent)
  },

  // Адресуемая 404: на неё уходят страницы, не нашедшие свои данные.
  { path: '404', title: 'NOT_FOUND.TITLE', loadComponent: notFound },

  // Неизвестный путь: адрес в строке сохраняем, чтобы была видна опечатка.
  { path: '**', title: 'NOT_FOUND.TITLE', loadComponent: notFound }
];
