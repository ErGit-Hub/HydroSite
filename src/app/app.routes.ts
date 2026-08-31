import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './sections/about/about.component';
import { ServicesComponent } from './sections/services/services.component';
import { StructureComponent } from './sections/structure/structure.component';
import { ContactsComponent } from './sections/contacts/contacts.component';
import { ReceptionComponent } from './sections/reception/reception.component';
import { ProjectsComponent } from './sections/projects/projects.component';
import { VacanciesComponent } from './sections/vacancies/vacancies.component';
import { NewsComponent } from './sections/news/news.component';
import { NewsDetailsComponent } from './sections/news/news-details/news-details.component';
import { ActivityComponent } from './sections/activity/activity.component';
import { GovementComponent } from './sections/govement/govement.component';
import { AntiCorruptionComponent } from './sections/anti-corruption/anti-corruption.component';
import { OmbucmenComponent } from './sections/ombucmen/ombucmen.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'activity', component: ActivityComponent },
  { path: 'govement', component: GovementComponent },
  { path: 'services', component: ServicesComponent },
  { path: 'structure', component: StructureComponent },
  { path: 'reception', component: ReceptionComponent },
  { path: 'contacts', component: ContactsComponent },
  { path: 'projects', component: ProjectsComponent },
  { path: 'vacancies', component: VacanciesComponent },
  { path: 'anti-corruption', component: AntiCorruptionComponent },
  { path: 'ombucmen', component: OmbucmenComponent },
 {
  path: 'news',
  component: NewsComponent
},
{
  path: 'news/:id',
  component: NewsDetailsComponent
}
  
];