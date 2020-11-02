import { IRequest, IResponse } from '../protocols/http';
import MissingParamError from '../errors/missing-param-errors';
import { badRequest } from '../helpers/http-helper';
import { Controller } from '../protocols/controller';

export default class SignUpController implements Controller {
  handle(request: IRequest): IResponse {
    const requiredFields = [
      'name',
      'email',
      'password',
      'passwordConfirmation',
    ];

    for (const field of requiredFields) {
      if (!request.body[field]) {
        return badRequest(new MissingParamError(field));
      }
    }

    return {
      statusCode: 200,
      body: 'ok',
    };
  }
}
