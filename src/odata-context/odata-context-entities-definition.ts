import {OdataContextDefinition} from "./odata-context-definition";
import {ContextModuleConfig} from "../context-module-config";
export class OdataContextEntitiesDefinition extends OdataContextDefinition {

    constructor() {
        super();
    }

    public buildOdataContext(config: ContextModuleConfig): void {
        if (!this.odataContext) {
            super.buildCommonOdataContext(config, config.entities);
            const entities: string[] = Object.getOwnPropertyNames(config.entities);
            for (const entity of entities) {
              (this.odataContext as any)[config.entities[entity].getName()].on("updating", (keys: any, values: any) => {
                    super.fixUpdate(keys, values, config.entities[entity].getName());
                });
              (this.odataContext as any)[config.entities[entity].getName()].on("inserting", (values: any) => {
                    super.fixUpdate(null, values, config.entities[entity].getName());
                });
            }
        }
    }
}
