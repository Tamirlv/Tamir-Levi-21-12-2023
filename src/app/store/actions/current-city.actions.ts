import { createAction, props } from "@ngrx/store";


export const updateCity = createAction('[Item] Update Current City', props<{ id: number, name: string, city_key: string }>());