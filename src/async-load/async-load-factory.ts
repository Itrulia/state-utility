import {Action, ActionReducer} from "@ngrx/store";
import {Actions} from "@ngrx/effects";
import {actionType} from "../action-type/action-type";
import {ErrorState} from "../error";
import {EntityState, createLoadReducer} from "../entity/entity-state/entity-state";

import {createLoadMultipleCompleteActionFactory, createLoadCompleteEffectFactory, LoadMultipleCompleteAction, LoadCompleteEffectFactory} from "./load-complete";
import {createLoadEffectFactory, createLoadMultipleActionFactory, LoadEffectFactory, multipleReducer} from "./load";
import {createLoadOnceEffectFactory, LoadOnceEffectFactory} from "./load-once";
import {MultipleAction} from "../multiple";

export interface LoadMultiplePackage<T> {
    load: {
        type: string;
        action: MultipleAction;
        effect: LoadEffectFactory<T>
    };
    loadOnce: {
        type: string;
        action: MultipleAction;
        effect: LoadOnceEffectFactory;
    };
    loadComplete: {
        type: string;
        action: LoadMultipleCompleteAction<T>;
        effect: LoadCompleteEffectFactory<T>;
    };
    reducer: ActionReducer<any>;
}

export const createLoadMultiple = <T>(entityType: string, subEntityType?: string) => {
    const loadType = actionType(`[${entityType}] Load ${subEntityType}`);
    const loadOnceType = actionType(`[${entityType}] Load ${subEntityType} Once`);
    const loadCompleteType = actionType(`[${entityType}] Load ${subEntityType} Complete`);

    const loadCompleteAction = createLoadMultipleCompleteActionFactory<T>(loadCompleteType);

    return {
        load: {
            type: loadType,
            action: createLoadMultipleActionFactory(loadType),
            effect: createLoadEffectFactory<T>(loadType, loadCompleteAction)
        },
        loadOnce: {
            type: loadOnceType,
            action: createLoadMultipleActionFactory(loadOnceType),
            effect: createLoadOnceEffectFactory(loadOnceType)
        },
        loadComplete: {
            type: loadCompleteType,
            action: loadCompleteAction,
            effect: createLoadCompleteEffectFactory<T>(loadCompleteType)
        },
        reducer: multipleReducer(createLoadReducer(loadType, loadCompleteType)),
        selector: () => {}
    };
};