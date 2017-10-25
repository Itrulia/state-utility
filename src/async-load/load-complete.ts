import {ErrorState} from "../error";
import {Action} from "@ngrx/store";
import {Actions} from "@ngrx/effects";
import {Observable} from "rxjs/Observable";

import "rxjs/add/operator/takeUntil";
import "rxjs/add/operator/filter";
import "rxjs/add/operator/skip";
import "rxjs/add/operator/mergeMap";
import {MultipleAction} from "../multiple";

/**
 * Action to complete the loading of an entity.
 * This action is used when there can be only one entity.
 * E.g. logged in user.
 */
export interface LoadCompleteAction<T> extends Action {
    payload: T;
    error?: ErrorState;
}

/**
 * Action to complete the loading of one of many entities.
 * This action is used when there can be more than one entity.
 * E.g. loading one user.
 */
export interface LoadMultipleCompleteAction<T> extends LoadCompleteAction<T>, MultipleAction {}

export type LoadCompleteEffectFactory<T> = (
    actions: Actions,
    innerObservable: (action: LoadMultipleCompleteAction<T>) => Observable<Action>
) => Observable<Action>;

export const createLoadCompleteEffectFactory = <T>(loadType: string): LoadCompleteEffectFactory<T> => {
    return (
        actions: Actions,
        innerObservable: (action: LoadMultipleCompleteAction<T>) => Observable<Action>
    ): Observable<Action> => {
        const obs$ = actions.ofType(loadType) as Observable<LoadMultipleCompleteAction<T>>;

        return obs$.mergeMap(action => {
            const nextSearch$ = obs$.filter(action2 =>  action.id === action2.id).skip(1);
            return innerObservable(action).takeUntil(nextSearch$);
        });
    };
};

export type LoadMultipleCompleteActionFactory<T> = (id: string, payload: T, error?: ErrorState) =>
    LoadMultipleCompleteAction<T>;

export const createLoadMultipleCompleteActionFactory = <T>(type: string): LoadMultipleCompleteActionFactory<T> => {
    return (id: string, payload: T, error: ErrorState = null): LoadMultipleCompleteAction<T> => ({
        id: id,
        type: type,
        payload: payload,
        error: error
    });
};
