import {Injectable} from "@angular/core";
@Injectable()
export class OdataUtilities {

  private buildCustomQueryParamsFromCurrentFilter(currentFilter: any[], searchExpr: string[], customQueryParams: any): any {
    if (Array.isArray(currentFilter[0])) {
      for (const currentFilterElement of currentFilter) {
        this.buildCustomQueryParamsFromCurrentFilter(currentFilterElement, searchExpr, customQueryParams);
      }
    } else {
      if (Array.isArray(currentFilter)) {
        const currentField = currentFilter[0];
        const currentValue = currentFilter[2];

        if (this.isFieldContained(currentField, searchExpr)) {
          customQueryParams[currentField] = currentValue;
          return customQueryParams;
        }
      }
    }
    return customQueryParams;
  }

  private isFieldContained(currentField: string, searchExpr: string[]): boolean {
    return searchExpr.filter((e) => e === currentField).length > 0;
  }

  public filterToCustomQueryParams(searchExpr: string[], loadOptions: any): void {
    if (loadOptions.filter) {
      const buildedCustomQueryParams: any = this.buildCustomQueryParamsFromCurrentFilter(loadOptions.filter, searchExpr, {});

      for (const e of searchExpr) {
        if (buildedCustomQueryParams[e]) {
          loadOptions.customQueryParams[e] = buildedCustomQueryParams[e];
        } else {
          delete loadOptions.customQueryParams[e];
        }
      }
      delete loadOptions.filter;
    } else {
      for (const e of searchExpr) {
        delete loadOptions.customQueryParams[e];
      }
    }
  }
}
