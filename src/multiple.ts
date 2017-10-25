import {Action} from "@ngrx/store";

export interface MultipleAction extends Action {
    id: string;
}