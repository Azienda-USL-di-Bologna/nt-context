import { isArray } from "util";
import { arraysAreEqual } from "tslint/lib/utils";
import { Entity } from "..";
export abstract class ServerObject {

  constructor() { }
  /**
   * confronta 2 array usando come funzione di ugualianza isEquals()
   * @param array1
   * @param array2
   * @returns {boolean}
   */
  private static arrayEquals(array1: any[], array2: any[]): boolean {
    return arraysAreEqual(array1, array2, ServerObject.isEquals);
  }

  /**
   * da implementare nelle sottoclassi, deve tornare i dati che descrivono l'entità da inserire dentro l'oggetto OdataContext di DevExtreme
   */
  public abstract getOdataContextEntity(): any;

  /**
   * torna true se i due oggetti sono uguali (vengono controllate solo le proprietà, non i metodi), false altrimenti
   * @param obj1
   * @param obj2
   * @returns {boolean} Torna true se i due oggetti sono uguali, false altrimenti
   */
  public static isEquals(obj1: any, obj2: any) {
    const properties: string[] = Object.getOwnPropertyNames(obj1);

    for (const prop of properties) {
      // console.log("prop name:", prop, "value:", obj1[prop], "type:", typeof obj1[prop]);
      // console.log("prop", isArray(obj1[prop]));
      if (obj1[prop] && typeof obj1[prop] === "object") {
        if (isArray(obj1[prop])) {
          if (!isArray(obj2[prop])) {
            return false;
          } else {
            console.log(obj1[prop], obj2[prop]);
            if (!ServerObject.arrayEquals(obj1[prop], obj2[prop])) {
              return false;
            }
          }
        } else if (obj2[prop] && typeof obj2[prop] === "object" && obj1[prop] instanceof Date && obj2[prop] instanceof Date) {
          if (obj1[prop].getTime() !== obj2[prop].getTime()) {
            return false;
          }
        } else {
          if (!obj2[prop] || typeof obj2[prop] !== "object") {
            return false;
          } else if (!ServerObject.isEquals(obj1[prop], obj2[prop])) {
            return false;
          }
        }
      } else {
        if (obj1[prop] !== obj2[prop]) {
          return false;
        }
      }
    }
    return true;
  }

  /**
   * ritorna un set di campi modificati
   * i campi da controllare vengono passati nell'oggetto dataFieldDescription, dove la chiave è il nome del campo dell'oggetto e il valore è la descrizione da mostrare
   * @param datafieldsDescription 
   * @param obj1 
   * @param obj2 
   */
  public static compareObjs(datafieldsDescription: any, obj1: any, obj2: any): string[] {
    let differences: string[] = [];
    let propToCompare: string[] = Object.getOwnPropertyNames(datafieldsDescription);
    propToCompare.forEach(p => {
      // se sono tutti e due null o undefined -> sono uguali
      if ((obj1[p] === null || obj1[p] === undefined) && (obj2[p] === null || obj2[p] === undefined)) {
        return;
      }
      // se sono uno è valorizzato e l'altro no -> sono diversi
      else if (((obj1[p] === null || obj1[p] === undefined) && (obj2[p] !== null && obj2[p] !== undefined))
        || ((obj1[p] !== null && obj1[p] !== undefined) && (obj2[p] === null || obj2[p] === undefined))) {
        differences.push(datafieldsDescription[p]);
      }
      // se sono tutti e due valorizzati vado a confrontarli
      else if ((obj1[p] !== null && obj1[p] !== undefined) && (obj2[p] !== null && obj2[p] !== undefined)) {
        // tipo data
        if (obj1[p] instanceof Date) {
          if (obj1[p].toString() !== obj2[p].toString()) {
            differences.push(datafieldsDescription[p]);
          }
        }
        // tipo oggetto
        else if (typeof obj1[p] === "object") {
          if (!Entity.isEquals(obj1[p], obj2[p])) {
            differences.push(datafieldsDescription[p]);
          }
        }
        else {
          // altri tipi (stringhe o numeri)
          if (obj1[p] !== obj2[p]) {
            differences.push(datafieldsDescription[p]);
          }
        }
      }
    });
    return differences;
  }

  public static cloneObject(obj: any): any {
    let clone: any = {};
    for (let i in obj) {
      if (obj[i] && obj[i] instanceof Date)
        clone[i] = obj[i];
      else if (obj[i] != null && typeof (obj[i]) === "object")
        clone[i] = this.cloneObject(obj[i]);
      else
        clone[i] = obj[i];
    }
    return clone;
  }


  /**
   * costruisce l'oggetto a partire dai dati raw popolando le proprietà indicate nei fieldTypes dell'oggetto tornato dal metodo getOdataContextEntity()
   */
  public build(srcObj: any) {
    const properties: string[] = Object.getOwnPropertyNames(this.getOdataContextEntity().fieldTypes);
    for (const prop of properties) {
      (this as any)[prop] = (srcObj as any)[prop];
    }
  }

  /**
   * rappresenta il nome dell'entity così come è scritto nella risposta ODATA (= EDM)
   * (ad esempio: Aziendas, Strutturas, ...)
   */
  public abstract getName(): string;

}

export class OdataForeignKey {
  private targetEntity: string;
  private keyName: string;

  constructor(entityName: string, keyName: string) {
    this.keyName = keyName;
    this.targetEntity = entityName;
  }

  public getTargetEntity(): string {
    return this.targetEntity;
  }

  public getKeyName(): string {
    return this.keyName;
  }
}
