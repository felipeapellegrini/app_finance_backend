import { IRequest, IResponse } from '../protocols/http';
import MissingParamError from '../errors/missing-param-errors';

export default class SignUpController {
  handle(request: IRequest): IResponse {
    if (!request.body.name) {
      return {
        statusCode: 400,
        body: new MissingParamError('name'),
      };
    }

    if (!request.body.email) {
      return {
        statusCode: 400,
        body: new MissingParamError('email'),
      };
    }

    return {
      statusCode: 200,
      body: 'ok',
    };
  }
}
