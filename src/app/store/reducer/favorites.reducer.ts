import { createReducer, on } from "@ngrx/store";
import { addToFavorites, removeFromFavorites } from "../actions/favorites.actions";

export interface Favorite {
    id: number,
    name: string,
    city_key: string
}


export const initialState: Favorite[] =
    [
        {
            "id": 1,
            "name": "Tel Aviv",
            "city_key": "215854"
        },
        {
            "id": 2,
            "name": "Washington",
            "city_key": "327659"
        }
    ]


export const favoritesReducer = createReducer(
    initialState,
    on(addToFavorites, (state, action) => {
        console.log(state);
        const newItem: Favorite = {
            id: action.id,
            name: action.name,
            city_key: action.city_key
        };

        console.log('Item added to favorites:', newItem);

        return [...state, newItem]; // Return a new array with the existing items and the new item
    }),
    on(removeFromFavorites, (state, action) => {
        const cityNameToRemove = action.name; // Assuming you have cityName in your action

        console.log('Removing city from favorites:', cityNameToRemove);

        // Use filter to create a new array without the item to remove
        const newState = state.filter(item => item.name !== cityNameToRemove);

        return newState;
    })
);