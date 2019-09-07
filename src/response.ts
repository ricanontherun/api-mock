export interface IAPIMockResponse {
  statusCode: number;
  body?: string | object;
  headers?: object;
}

export const DEFAULT_RESPONSE: IAPIMockResponse = {
  body: 'Ok',
  headers: {},
  statusCode: 200,
};
