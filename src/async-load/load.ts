import {Action, ActionReducer} from "@ngrx/store";
import {Actions} from "@ngrx/effects";
import {Observable} from "rxjs/Observable";
import {LoadMultipleCompleteAction, LoadMultipleCompleteActionFactory} from "./load-complete";
import "rxjs/add/operator/takeUntil";
import "rxjs/add/operator/filter";
import "rxjs/add/operator/skip";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/mergeMap";
import {MultipleAction} from "../multiple";

export type LoadMultipleActionFactory = (id: string) => MultipleAction;

export const createLoadMultipleActionFactory = (type: string): LoadMultipleActionFactory => {
    return (id: string): MultipleAction => ({
        id: id,
        type: type
    });
};

export const multipleReducer = <T>(reducers: ActionReducer<any>): ActionReducer<any> => {
    return (state = {}, action: Action) => {
        const multipleAction = action as MultipleAction;

        if (multipleAction.id) {
            const newState = reducers(
                state[multipleAction.id],
                action
            );

            return {...state,...newState};
        }

        return state;
    };
};

export type LoadEffectFactory<T> = (
    actions: Actions,
    innerObservable: (action: MultipleAction) => Observable<T>
) => Observable<LoadMultipleCompleteAction<T>>;

export const createLoadEffectFactory = <T>(
    loadType: string,
    loadCompleteFactory: LoadMultipleCompleteActionFactory<T>
): LoadEffectFactory<T> => {
    return (actions: Actions, innerObservable: (action: MultipleAction) => Observable<T>) => {
        const obs$ = actions.ofType(loadType) as Observable<MultipleAction>;

        return obs$.mergeMap(action => {
            const nextSearch$ = obs$.filter(action2 =>  action.id === action2.id).skip(1);
            return innerObservable(action).takeUntil(nextSearch$)
                .map((data: T) => loadCompleteFactory(action.id, data))
                .catch(error => [loadCompleteFactory(action.id, null, error)]);
        });
    };
};