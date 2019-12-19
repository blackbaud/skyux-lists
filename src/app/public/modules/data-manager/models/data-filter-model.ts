export class DataManagerFilterModel {
  public name: string;
  public defaultValue: any;
  public label: string;
  public dismissible: boolean = true;
  public value: any;
  public filterFunction: Function;

  // constructor(data?: any) {
  //   if (data) {
  //     this.name = data.name;
  //     this.label = data.label;
  //     this.filterFunction = data.filterFunction;
  //     this.value = data.value;
  //     this.dismissible = data.dismissible;
  //     this.defaultValue = data.defaultValue;
  //   }
  // }
}
