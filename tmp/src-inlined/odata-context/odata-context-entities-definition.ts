import {OdataContextDefinition} from "./odata-context-definition";
import {ContextModuleConfig} from "../context-module-config";
import {ServerObject} from "../model/server-object";
export class OdataContextEntitiesDefinition extends OdataContextDefinition {

    constructor() {
        super();
    }

    public buildOdataContext(config: ContextModuleConfig): void {
        if (!this.odataContext) {
            super.buildCommonOdataContext(config, config.entities());
            const entities: ServerObject[] = config.entities().getServerObjectsList();
            for (const entity of entities) {
              (this.odataContext as any)[entity.getName()].on("updating", (keys: any, values: any) => {
                    super.fixUpdate(keys, values, entity.getName());
                });
              (this.odataContext as any)[entity.getName()].on("inserting", (values: any) => {
                    super.fixUpdate(null, values, entity.getName());
                });
            }
        }
    }
}
