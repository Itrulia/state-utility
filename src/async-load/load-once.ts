import {Store, Action} from "@ngrx/store";
import {Actions} from "@ngrx/effects";
import {Observable} from "rxjs/Observable";
import {LoadMultipleAction} from "./load";

import "rxjs/add/operator/filter";
import "rxjs/add/operator/map";
import "rxjs/add/operator/first";

export type LoadOnceEffectFactory = (
    selector: (id: string) => any,
    state: Store<any>,
    actions: Actions
) => Observable<Action>;

export const createLoadOnceEffectFactory = (type: string): LoadOnceEffectFactory => {
    return (selector: (id: string) => any, state: Store<any>, actions: Actions): Observable<Action> => {
        return actions.ofType(type).mergeMap((action: LoadMultipleAction) => {
            return state.select(selector(action.id))
                .first()
                .filter(data => !Boolean(data))
                .map(data => action);
        });
    }
};