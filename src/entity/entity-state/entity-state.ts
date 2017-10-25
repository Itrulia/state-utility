import {Action, ActionReducer} from "@ngrx/store";
import {ErrorState} from "../../error";
import {LoadingState, setToLoading} from "../../async-load/async-load";
import {LoadCompleteAction, LoadMultipleCompleteAction} from "../../async-load/load-complete";
import {LoadMultipleAction} from "../../async-load/load";
import {reduceReducers} from "../../queue-reducers/queue-reducers";

export interface EntityState<T> extends LoadingState {
    entity: T | null;
}

// State transformations

/**
 * Creates an empty entity state.
 * Needed when an entity has been loaded the first time.
 */
export const createEntityState = <T>(): EntityState<T> => {
    return {
        entity: null,
        loading: true,
        error: null
    };
};

/**
 * Sets the entity state to be finished loading.
 * Needed when the entity has finished loading either by success or error.
 *
 * @param state
 * @param action
 */
export const setToLoadingComplete = <T>(state: T, action: LoadCompleteAction<T>): T => {
    return {
        ...state as any,
        entry: action.payload,
        loading: false,
        error: action.error ? action.error : null
    };
};


// Reducers
export const createLoadReducer = (loading: string, complete: string): ActionReducer<any> => {
    return (state, action: Action) => {
        if (action.type === loading) {
            const loadingAction = action as LoadMultipleAction;

            return setToLoading(state || createEntityState());
        }

        if (action.type === complete) {
            const completeAction = action as LoadMultipleCompleteAction<any>;

            return setToLoadingComplete(state[completeAction.id], completeAction);
        }

        return state;
    };
};

// Selectors

/**
 * Selects the entity of an EntityState.
 *
 * @param state
 */
export const selectEntity = <T>(state: EntityState<T>): T => state.entity;