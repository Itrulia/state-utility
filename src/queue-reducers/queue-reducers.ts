import {ActionReducer, Action} from "@ngrx/store";

/**
 * Creates a new action reducer that invokes all reducers specified.
 * This is very useful when you want to make many lean reducers instead of 1 big reducer.
 *
 * @param reducers
 */
export const reduceReducers = <T>(reducers: ActionReducer<T>[]): ActionReducer<T> => {
    return (state: T, action: Action) => reducers.reduce((newState, reducer) => reducer(newState, action), state);
};