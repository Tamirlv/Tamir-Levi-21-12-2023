import { createReducer, on } from "@ngrx/store";
import { updateCity } from "../actions/current-city.actions";

export interface City {
    id: number,
    name: string,
    city_key: string
}

export const initialState: City = {
    "id": 1,
    "name": "Tel Aviv",
    "city_key": "215854"
}

export const currentCityReducer = createReducer(
    initialState,
    on(updateCity, (state, action) => {
        return { ...state, id: action.id, name: action.name, city_key: action.city_key };
    })
);