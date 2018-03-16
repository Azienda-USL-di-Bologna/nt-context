export class CustomLoadingFilterParams {

  private _filters: FieldFilter[] = [];
  // private filter: any[];

  constructor() {
  }

  public addFilter(targetField: string, filter: any[]) {
    this._filters.push({
        targetField: targetField,
        filter: filter
    });
  }

  public get filters() {
    return this._filters;
  }
}

export interface FieldFilter {
  targetField: string;
  filter: any[];
}
