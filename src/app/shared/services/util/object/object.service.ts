import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ObjectService {
  isEmpty(object: any) {
    for (const key in object) {
      if (key) return false;
    }
    return true;
  }

  isError(object: any) {
    return (
      object?.stack &&
      object?.message &&
      typeof object.stack === 'string' &&
      typeof object.message === 'string'
    );
  }

  deepFind(obj: any, path: string) {
    try {
      return path.split('.').reduce((a, b) => a && a[b], obj);
    } catch (error) {
      return '';
    }
  }

  deepInsert(value: any, path: string, obj: any) {
    const keys = path.split('.');
    let temp: any = obj;

    for (let i = 0; i < keys.length - 1; i++) {
      temp = temp[keys[i]];
    }

    temp[keys[keys.length - 1]] = value;
  }

  deepCopy(obj: unknown) {
    return JSON.parse(JSON.stringify(obj));
  }

  showIf(document: any, condition: any): boolean {
    let mutatedCondition: any = {};
    if (condition) {
      if (Object.keys(condition).length > 1) {
        mutatedCondition['$and'] = [];
        for (const key in condition) {
          mutatedCondition['$and'].push({ [key]: condition[key] });
        }
      } else {
        mutatedCondition = condition;
      }
      if ('$or' in mutatedCondition) {
        return this._isAnySubConditionMet(document, mutatedCondition['$or']);
      }

      if ('$and' in mutatedCondition) {
        return this._areAllSubConditionsMet(document, mutatedCondition['$and']);
      }

      return this._isDocumentConditionMet(document, mutatedCondition);
    } else {
      return false;
    }
  }

  private _isAnySubConditionMet(document: any, subConditions: any[]): boolean {
    return subConditions.some((subCondition: any) =>
      this.showIf(document, subCondition),
    );
  }

  private _areAllSubConditionsMet(document: any, subConditions: any[]) {
    return subConditions.every((subCondition: any) =>
      this.showIf(document, subCondition),
    );
  }

  private _isDocumentConditionMet(document: any, condition: any) {
    for (const key in condition) {
      const documentValue = this._getValueByPath(document, key);
      const conditionValue = condition[key];
      if (typeof conditionValue === 'object' && conditionValue !== null) {
        if (!this._evaluateComplexCondition(documentValue, conditionValue)) {
          return false;
        }
      } else {
        if (documentValue !== conditionValue) {
          return false;
        }
      }
    }

    return true;
  }

  private _getValueByPath(obj: any, path: string) {
    return path.split('.').reduce((acc, key) => acc && acc[key], obj);
  }

  private _evaluateComplexCondition(actualValue: any, conditionValue: any) {
    if (typeof conditionValue === 'object' && conditionValue !== null) {
      for (const operator in conditionValue) {
        let isConditionMet;
        switch (operator) {
          case '$eq':
            isConditionMet = actualValue === conditionValue[operator];
            break;
          case '$ne':
            isConditionMet = actualValue !== conditionValue[operator];
            break;
          case '$gt':
            isConditionMet = actualValue > conditionValue[operator];
            break;
          case '$gte':
            isConditionMet = actualValue >= conditionValue[operator];
            break;
          case '$lt':
            isConditionMet = actualValue < conditionValue[operator];
            break;
          case '$lte':
            isConditionMet = actualValue <= conditionValue[operator];
            break;
          case '$in':
            isConditionMet = Array.isArray(actualValue)
              ? actualValue.some((val) =>
                  conditionValue[operator].includes(val),
                )
              : conditionValue[operator].includes(actualValue);
            break;
          case '$nin':
            isConditionMet = Array.isArray(actualValue)
              ? !actualValue.some((val) =>
                  conditionValue[operator].includes(val),
                )
              : !conditionValue[operator].includes(actualValue);
            break;
          default:
        }
        if (!isConditionMet) {
          return false;
        }
      }
      return true;
    } else {
      return actualValue === conditionValue;
    }
  }
}
