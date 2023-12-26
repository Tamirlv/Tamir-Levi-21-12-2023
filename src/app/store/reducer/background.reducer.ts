import { createReducer, on } from "@ngrx/store";
import { updateBackground } from "../actions/background.actions";

export interface Background {
    dark: boolean;
}

export const initialState: Background = {
    dark: false
};

export const currentBackgroundReducer = createReducer(
    initialState,
    on(updateBackground, (state) => {
        return { ...state, dark: !state.dark };
    })
);