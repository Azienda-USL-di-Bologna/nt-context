export class CustomLoadingFilterParams {

  private targetField: string;
  private filter: any[];

  constructor(targetField: string) {
    this.targetField = targetField;
  }

  public addFilter(filter: any[]) {
    this.filter = filter;
  }

  public getTargetField(): string {
    return this.targetField;
  }

  public getFilter() {
    return this.filter;
  }
}
