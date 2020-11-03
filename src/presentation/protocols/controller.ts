import { IRequest, IResponse } from './http';

export interface Controller {
  handle(request: IRequest): Promise<IResponse>;
}
