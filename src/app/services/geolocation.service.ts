import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {

  constructor() { }

  getCurrentLocation(): Observable<GeolocationData> {
    return new Observable<GeolocationData>((observer) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Success callback
          const geolocationData: GeolocationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          observer.next(geolocationData);
          observer.complete();
        },
        (error) => {
          // Error callback
          console.error('Error getting geolocation:', error.message);
          observer.error(error);
        }
      );
    });
  }
}

interface GeolocationData {
  latitude: number;
  longitude: number;
}