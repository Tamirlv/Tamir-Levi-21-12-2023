import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FavoritesComponent } from './favorites/favorites.component';
import { MainComponent } from './main/main.component';
const routes: Routes = [
  {
    path: 'favorites',
    component: FavoritesComponent
  },
  {
    path: 'main',
    component: MainComponent
  },
  {
    path: 'main/:city_key/:city_name',
    component: MainComponent
  },
  { path: '**', redirectTo: 'main' }
]

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }