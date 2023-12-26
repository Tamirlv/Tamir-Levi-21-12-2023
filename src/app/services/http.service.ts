import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private apiKey = 'pnAbCK0DFWTgixontZwJ0pppQRKdyKeO';
  constructor(private http: HttpClient) { }

  getCurrentWeather(cityKey: string) {
    const params = new URLSearchParams();
    params.set('apikey', this.apiKey);
    params.set('details', this.apiKey);
    const apiUrl = `http://dataservice.accuweather.com/currentconditions/v1/${cityKey}?` + params.toString()
    return this.http.get(apiUrl);
  }

  get5DaysForecasts(cityKey: string) {
    const params = new URLSearchParams();
    params.set('apikey', this.apiKey);
    params.set('details', 'true');
    params.set('metric', 'true');
    const apiUrl = `http://dataservice.accuweather.com/forecasts/v1/daily/5day/${cityKey}?` + params.toString();
    return this.http.get(apiUrl);
  }

  getCityByLocation(geolocation: string) {
    const params = new URLSearchParams;
    params.set('apikey', this.apiKey);
    params.set('q', geolocation);
    const apiUrl = `http://dataservice.accuweather.com/locations/v1/cities/geoposition/search?` + params.toString()
    return this.http.get(apiUrl)
  }

  autoCompleteApi(value: any) {
    const params = new URLSearchParams();
    params.set('apikey', this.apiKey);
    params.set('q', value);
    const apiUrl = `http://dataservice.accuweather.com/locations/v1/cities/autocomplete?` + params.toString()
    return this.http.get(apiUrl);
  }
}