import { createAction, props } from "@ngrx/store";


export const addToFavorites = createAction('[Item] Add To Favorites', props<{ id: number, name: string, city_key: string }>());
export const removeFromFavorites = createAction('[Item] Remove From Favorites', props<{ name: string }>());