import { IRequest, IResponse } from '../protocols/http';
import MissingParamError from '../errors/missing-param-errors';
import { badRequest } from '../helpers/http-helper';

export default class SignUpController {
  handle(request: IRequest): IResponse {
    if (!request.body.name) {
      return badRequest(new MissingParamError('name'));
    }

    if (!request.body.email) {
      return badRequest(new MissingParamError('email'));
    }

    return {
      statusCode: 200,
      body: 'ok',
    };
  }
}
