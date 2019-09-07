import { IKeyValue } from './kv';

export interface INamedConfig {
  statusCode: number | string;
  body?: IKeyValue | string;
  headers?: IKeyValue;
}

export interface IRoutesConfig {
  [key: string]: INamedConfig;
}

export interface IAPIMockConfig {
  latency?: {
    min?: number;
    max?: number;
  };

  routes?: IRoutesConfig;
}
