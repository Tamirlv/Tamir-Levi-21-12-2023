import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { FavoritesComponent } from './favorites/favorites.component';
import { MainComponent } from './main/main.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { favoritesReducer } from './store/reducer/favorites.reducer';
import { MatTableModule } from '@angular/material/table';
import { currentCityReducer } from './store/reducer/current-city.reducer';
import { GeolocationService } from './services/geolocation.service';
import { currentTemperatureReducer } from './store/reducer/temperature.reducer';
import { currentBackgroundReducer } from './store/reducer/background.reducer';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  declarations: [
    AppComponent,
    FavoritesComponent,
    MainComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSlideToggleModule,
    MatSidenavModule,
    MatToolbarModule,
    RouterModule,
    MatListModule,
    MatIconModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatTableModule,
    MatSnackBarModule,
    StoreModule.forRoot({
      favoritesCities: favoritesReducer,
      currentCity: currentCityReducer,
      updateTemperature: currentTemperatureReducer,
      updateBackground: currentBackgroundReducer
    }, {}),
    EffectsModule.forRoot([])
  ],
  providers: [
    GeolocationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
