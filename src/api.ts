import { get, has } from "lodash";

import { resolveAfter } from "./async";
import { IAPIMockConfig, INamedConfig } from "./config";
import { isDefined, isNumber, isObject, isString, isUndefined } from "./is";
import { IKeyValue } from "./kv";
import { DEFAULT_RESPONSE, IAPIMockResponse } from "./response";

const random = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1) + min);

interface IRequestData {
  body: IKeyValue;
  headers: IKeyValue;
}

export class APIMock {
  protected config: IAPIMockConfig;
  protected latencyMin: number = 0;
  protected latencyMax: number = 0;

  constructor(config: IAPIMockConfig) {
    this.config = config;

    this.latencyMin = get(this.config, "latency.min", 0);
    this.latencyMax = get(this.config, "latency.max", 0);
  }

  // @ts-ignore
  public async generateResponse(
    name: string,
    body: IKeyValue = {},
    headers: IKeyValue = {}
  ): Promise<IAPIMockResponse> {
    if (!has(this.config, `routes.${name}`)) {
      return DEFAULT_RESPONSE;
    }

    // @ts-ignore
    const requestData: IRequestData = { body, headers };
    // @ts-ignore
    const namedConfig: INamedConfig = this.config.routes[name];
    const response: IAPIMockResponse = DEFAULT_RESPONSE;

    response.statusCode = this.generateStatusCode(namedConfig);

    if (isDefined(namedConfig.body)) {
      response.body = this.generateBody(namedConfig);
    }

    if (isDefined(namedConfig.headers)) {
      response.headers = this.generateHeaders(namedConfig);
    }

    if (this.shouldSimulateLatency) {
      const randomLatency: number = random(this.latencyMin, this.latencyMax);
      if (randomLatency > 0) {
        return await resolveAfter(response, randomLatency);
      }
    }

    return response;
  }

  // @ts-ignore
  private generateStatusCode(
    config: INamedConfig,
    // requestData: IRequestData,
  ): number {
    const statusCode: number | string = config.statusCode;

    if (isNumber(statusCode)) {
      return statusCode as number;
    }

    if ((statusCode as string).startsWith("r:")) {
      // Generate random status code.
    }

    return parseInt(statusCode as string, 10);
  }

  // @ts-ignore
  private generateBody(
    config: INamedConfig,
    // requestData: IRequestData
  ): string | object {
    if (isUndefined(config.body)) {
      return "";
    }

    if (isString(config.body)) {
      // @ts-ignore
      return config.body;
    }

    const body: IKeyValue = {};

    if (isObject(config.body)) {
      Object.keys(config.body as object).forEach((key: string) => {
        // @ts-ignore
        body[key] = config.body[key];
      });
    }

    return body;
  }

  // @ts-ignore
  private generateHeaders(
    config: INamedConfig,
    // requestData: IRequestData
  ): IKeyValue {
    if (isUndefined(config.headers)) {
      return {};
    }

    const headers: IKeyValue = {};

    Object.keys(config.headers as object).forEach((key: string) => {
      // @ts-ignore
      headers[key] = config.headers[key];
    });

    return headers;
  }

  private get shouldSimulateLatency(): boolean {
    return this.latencyMax !== 0;
  }
}
