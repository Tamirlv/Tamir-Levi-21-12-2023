import { HttpClient } from '@angular/common/http';
import { FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Store } from '@ngrx/store';
import { Favorite } from '../store/reducer/favorites.reducer';
import { addToFavorites, removeFromFavorites } from '../store/actions/favorites.actions';
import { GeolocationService } from '../services/geolocation.service';
import { updateCity } from '../store/actions/current-city.actions';
import { HttpService } from '../services/http.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  // Animation for fadeInOut effect
  animations: [
    trigger('fadeInOut', [
      state('in', style({ opacity: 1 })),
      transition(':enter', [style({ opacity: 0 }), animate('700ms ease-out')]),
    ]),]
})
export class MainComponent implements OnInit {
  myControl = new FormControl();  // FormControl for autocomplete input
  AutoCompleteCities: any = []; // Array to store autocomplete city suggestions
  selectedCity: any; // Selected city details
  city: string = 'Tel Aviv'; // Default city name
  casts: any = []; // Array to store forecast data for the next 5 days
  dates: any = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']; // Days of the week (ENUM)
  id: any; // City ID
  favoriteCities: Favorite[]; // Array to store favorite cities
  celsius: boolean; // Flag to toggle between Celsius and Fahrenheit
  isDarkTheme: boolean; // Flag to toggle between light and dark theme

  // Current weather details
  currentWeather: any = {
    temp: {
      C: 0,
      F: 0
    },
    condition: 'Sunny'
  };

  // Constructor with injected services
  constructor(
    private store: Store<any>,
    private geolocationSerivce: GeolocationService,
    private httpService: HttpService,
    private MatSnackBar: MatSnackBar,
    private route: ActivatedRoute

  ) { }

  // Initialization logic
  ngOnInit(): void {
    // Subscribe to updates in the store for favorite cities, temperature unit, and theme
    this.store.select('favoritesCities').subscribe((data) => {
      this.favoriteCities = data;
    })
    this.store.select('updateTemperature').subscribe((data) => {
      this.celsius = data.celsius;
    })
    this.store.select('updateBackground').subscribe((data) => {
      this.isDarkTheme = data.dark;
    })

    // Checking if got a city from favorites 
    this.route.params.subscribe((params: any) => {
      if (params.city_key) {
        this.getCurrentWeather(params.city_key);
        this.get5DaysForecasts(params.city_key);
        this.city = params.city_name;
      } else {
        // Attempt to get user's location and set the default city
        try {
          this.geolocationSerivce.getCurrentLocation().subscribe((data) => {
            this.getCityByLocation(`${data.latitude},${data.longitude}`).subscribe((city: any) => {
              let obj = {
                id: 1,
                name: city.EnglishName,
                city_key: city.Key
              }
              this.store.dispatch(updateCity(obj));
              this.getCurrentCity();
              this.MatSnackBar.open(`Default city by your location`, "", { duration: 2000, verticalPosition: "bottom" });
            }
            );
          })
        } catch (err) {
          this.getCurrentCity();
          this.MatSnackBar.open(`Failed to get your city by location`, "", { duration: 2000, verticalPosition: "bottom" });
        }
      }

    })



    // Subscribe to changes in the autocomplete input value
    this.myControl.valueChanges.subscribe((value) => {
      this.autoComplete(value);
    })
  }

  getCurrentCity() {
    this.store.select('currentCity').subscribe((data) => {
      this.city = data.name;
      this.id = data.city_key
      this.getCurrentWeather(data.city_key);
      this.get5DaysForecasts(data.city_key);
    })
  }
  // Check if the current city is in the list of favorite cities
  checkIfItsFavorite() {
    return this.favoriteCities.find((city) => city.name == this.city)
  }

  // Auto-complete functionality based on user input
  autoComplete(value: any) {
    this.AutoCompleteCities = [];
    if (value.length > 2) {
      this.autoCompleteApi(value).subscribe((cities: any) => {
        this.AutoCompleteCities = cities;
      });
    }
  }

  // Add the current city to the list of favorite cities
  addToFavorites() {
    console.log(this.city);
    let obj = {
      id: this.favoriteCities.length + 1,
      name: this.city,
      city_key: this.id
    }
    try {
      this.store.dispatch(addToFavorites(obj))
      this.MatSnackBar.open(`City added to favorites`, "", { duration: 2000, verticalPosition: "bottom" });
    } catch (error) {
      this.MatSnackBar.open(`Problem with adding the city to favorites`, "", { duration: 2000, verticalPosition: "bottom" });
    }
  }

  // Remove the current city from the list of favorite cities
  removeFromFavorites() {
    try {
      this.store.dispatch(removeFromFavorites({ name: this.city }))
      this.MatSnackBar.open(`City removed from favorites`, "", { duration: 2000, verticalPosition: "bottom" });
    } catch (err) {
      this.MatSnackBar.open(`Problem with removing the city from favorites`, "", { duration: 2000, verticalPosition: "bottom" });
    }
  }

  // Fetch city suggestions from the autocomplete API
  autoCompleteApi(value: any) {
    return this.httpService.autoCompleteApi(value);
  }

  // Get city details based on geolocation
  getCityByLocation(geolocation: string) {
    return this.httpService.getCityByLocation(geolocation)
  }

  // Get current weather details for the specified city
  getCurrentWeather(cityKey: string) {
    this.httpService.getCurrentWeather(cityKey).subscribe((data: any) => {
      console.log(data);
      this.currentWeather.temp.C = data[0].Temperature.Metric.Value;
      this.currentWeather.temp.F = data[0].Temperature.Imperial.Value;
      this.currentWeather.condition = data[0].WeatherText;
    })
  }

  // Get 5-days forecast for the specified city
  get5DaysForecasts(cityKey: string) {
    this.casts = [];
    this.httpService.get5DaysForecasts(cityKey).subscribe((data: any) => {
      console.log(data);
      data.DailyForecasts.forEach((element: any) => {
        let date = new Date(element.Date);
        let day = this.dates[date.getUTCDay()];

        const CelTemp = element.Temperature.Minimum.Value + element.Temperature.Maximum.Value / 2;
        const FarTemp = (CelTemp * 9 / 5) + 32;

        let obj = {
          day,
          temperature: {
            C: CelTemp.toFixed(1),  // Round to one decimal place
            F: FarTemp.toFixed(1)   // Round to one decimal place
          }
        };
        this.casts.push(obj);
      });
    });
  }

  // Handle the selection of an item from the autocomplete list
  onSelect(event: MatAutocompleteSelectedEvent) {
    this.city = event.option.value.LocalizedName;
    const id = event.option.value.Key;
    this.id = id;
    this.getCurrentWeather(id);
    this.get5DaysForecasts(id);
  }
}
