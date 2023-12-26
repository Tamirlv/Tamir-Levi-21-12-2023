import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { updateTepmerature } from './store/actions/temperature.actions';
import { updateBackground } from './store/actions/background.actions';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  // Initialize component properties
  isMenuOpen: boolean = false;
  celsius: boolean = true;
  isDarkTheme: boolean = false;
  temperatureIcon: string = '°C';
  firstTemp: boolean = true;
  firstDark: boolean = true;

  // Constructor to inject dependencies (Router and Store)
  constructor(
    public router: Router,
    private store: Store<any>,
    private MatSnackBar: MatSnackBar
  ) {

  }
  ngOnInit(): void {
    // Subscribe to the 'updateBackground' state and update 'isDarkTheme' accordingly
    this.store.select('updateBackground').subscribe((data) => {
      this.isDarkTheme = data.dark;
      if (!this.firstDark)
        this.MatSnackBar.open(`${this.isDarkTheme ? 'Changed to dark mode successfully' : 'Changed to light mode successfully'}`, "", { duration: 2000, verticalPosition: "bottom" });
      this.firstDark = false;
    })
    this.store.select('updateTemperature').subscribe((data) => {
      this.celsius = data.celsius;
      if (!this.firstTemp)
        this.MatSnackBar.open(`${this.celsius ? 'Changed to celsius successfully' : 'Changed to fahrenheit successfully'}`, "", { duration: 2000, verticalPosition: "bottom" });
      this.firstTemp = false;
    })

  }

  // Method to update temperature unit and dispatch the 'updateTemperature' action
  updateTemp() {
    try {
      this.celsius = !this.celsius;
      this.temperatureIcon = this.celsius ? '°C' : '°F';
      this.store.dispatch(updateTepmerature())
    } catch (error) {
      console.error('Error during dispatching updateTemperature action:', error);
    }
  }

  // Method to dispatch the 'updateBackground' action to toggle dark/light theme
  updateBackground() {
    try {
      this.store.dispatch(updateBackground())
    } catch (error) {
      console.error('Error during dispatching updateBackground action:', error);

    }
  }
}
