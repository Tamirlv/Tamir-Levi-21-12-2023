import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { addToFavorites } from '../store/actions/favorites.actions';
import { Favorite } from '../store/reducer/favorites.reducer';
import { Router } from '@angular/router';
import { updateCity } from '../store/actions/current-city.actions';
import { HttpService } from '../services/http.service';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css'],
  // Animation for fading in and out
  animations: [
    trigger('fadeInOut', [
      state('in', style({ opacity: 1 })),
      transition(':enter', [style({ opacity: 0 }), animate('700ms ease-out')]),
    ]),]
})
export class FavoritesComponent implements OnInit {
  // Initialize component properties
  favoriteCities: Favorite[];
  favoriteCitiesWeather: any = [];
  celsius: boolean;
  isDarkTheme: boolean;
  constructor(
    private store: Store<any>,
    private router: Router,
    private httpService: HttpService,
  ) {
  }
  ngOnInit(): void {

    // Subscribe to the 'updateTemperature' state and update 'celsius'
    this.store.select('updateTemperature').subscribe((data) => {
      this.celsius = data.celsius;
    })

    // Subscribe to the 'updateBackground' state and update 'isDarkTheme'
    this.store.select('updateBackground').subscribe((data) => {
      this.isDarkTheme = data.dark;
    })

    // Subscribe to the 'favoritesCities' state and update 'favoriteCities' and 'favoriteCitiesWeather'
    this.store.select('favoritesCities').subscribe((data) => {
      this.favoriteCities = data;

      // Map favorite cities to include weather information
      this.favoriteCitiesWeather = data.map((city: any) => {
        return {
          ...city,
          currWeather: {
            C: null,
            F: null
          },
          currTextWeather: null,
        };
      });

      // Retrieve current weather for each favorite city
      this.favoriteCitiesWeather.forEach((city: any) => {
        this.getCurrentWeather(city.city_key).subscribe((weather: any) => {
          city.currWeather.C = weather[0].Temperature.Metric.Value
          city.currWeather.F = weather[0].Temperature.Imperial.Value
          city.currTextWeather = weather[0].WeatherText
        })
      })
    })
  }

  // Method to get current weather for a given city key
  getCurrentWeather(cityKey: string) {
    return this.httpService.getCurrentWeather(cityKey);
  }

  // Method to handle selection of a favorite city
  favoriteSelected(city: any) {
    // Remove unnecessary properties before navigating to main page
    delete city.currWeather;
    delete city.currTextWeather;
    this.store.dispatch(updateCity(city)); // Dispatch action to update current city in the store
    this.router.navigate([`/main/${city.city_key}/${city.name}`]); // Navigate to the main page
  }
}
