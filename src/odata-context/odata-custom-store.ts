/**
 * Created by gdm on 05/03/2018.
 */

import OdataStore from "devextreme/data/odata/store"
import {Entity} from "../model/entity";
import {OdataContextDefinition} from "./odata-context-definition";

export class OdataCustomStore {
    private odataStore: OdataStore;
    private odataContextDefinition: OdataContextDefinition;

    constructor(odataStore: OdataStore, odataContextDefinition: OdataContextDefinition) {
        this.odataStore = odataStore;
        this.odataContextDefinition = odataContextDefinition;
    }

    public update(key: any, value: Entity): void {
        console.log("update:", key, value);

        const body: any = this.odataContextDefinition.createFixedValues(value, value.getName());

        console.log("body", body);
    }
}
