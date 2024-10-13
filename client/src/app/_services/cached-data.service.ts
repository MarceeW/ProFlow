import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CachedDataService {
  private readonly _valueMap = new Map<string, any>();

  registerData(key: string, data: any) {
    this._valueMap.set(key, data);
  }

  deleteData(key: string) {
    this._valueMap.delete(key);
  }

  getData<T>(key: string): T {
    return this._valueMap.get(key);
  }
}
