import {ErrorState} from "../error";

// State

/**
 * A loading state when the data needs to be fetched.
 * E.g. from an API or from the client cache.
 */
export interface LoadingState {
    loading: boolean;
    error: ErrorState;
}

/**
 * Sets the state in to loading.
 * This means that loading will be true and error will be reset.
 *
 * @param state
 */
export const setToLoading = <T>(state: LoadingState): LoadingState => {
    return {
        ...state,
        loading: true,
        error: null
    }
};


// Selectors

/**
 * Selects the loading state by id.
 * This goes very well together with LoadMultipleCompleteAction
 *
 * @param state
 */
export const selectById = <T>(state: {[id: string]: T}) => (id: string) => state[id];

/**
 * Returns the loading status of a loading state
 *
 * @param state
 */
export const selectLoading = (state: LoadingState): boolean => state.loading;

/**
 * Returns the error status of a loading state
 *
 * @param state
 */
export const selectError = (state: LoadingState): ErrorState => state.error;