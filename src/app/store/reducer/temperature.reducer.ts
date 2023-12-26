import { createReducer, on } from "@ngrx/store";
import { updateTepmerature } from "../actions/temperature.actions";

export interface Temperature {
    celsius: boolean;
}

export const initialState: Temperature = {
    celsius: true
};

export const currentTemperatureReducer = createReducer(
    initialState,
    on(updateTepmerature, (state) => {
        return { ...state, celsius: !state.celsius };
    })
);