import { Injectable } from "@angular/core";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";


export declare type SubjectSharedObject = {
    [key: string]: Subject<any>;
};

export declare type SharedObject = {
    [key: string]: any;
};

@Injectable()
export class GlobalContextService {


    // private _buttonBarVisible: BehaviorSubject<boolean> = new BehaviorSubject(true);
    // get buttonBarVisible(): Observable<boolean>{
    //     return this._buttonBarVisible.asObservable();
    // }
    //
    // setButtonBarVisible(visible: boolean) {
    //     this._buttonBarVisible.next(visible);
    // }

    private _subjectSharedObject: SubjectSharedObject = {};

    public getSubjectInnerSharedObject(name: string): Observable<any>{
        return this._subjectSharedObject[name].asObservable();
    }

    public setSubjectInnerSharedObject(name: string, innerSharedObject:any): void{
        if (!this._subjectSharedObject[name]){
            this._subjectSharedObject[name] = new BehaviorSubject(null);
        }
        this._subjectSharedObject[name].next(innerSharedObject);
    }

    private _innerSharedObject: SharedObject = {};
    getInnerSharedObject(name: string): any {
        return this._innerSharedObject[name];
    }
    public setInnerSharedObject(name: string, innerSharedObject: any): void {
        if (!this._innerSharedObject) {
            this._innerSharedObject[name] = {};
        }
        this._innerSharedObject[name] = innerSharedObject;
    }

    constructor() { }
}
