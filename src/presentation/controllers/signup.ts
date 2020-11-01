import { IRequest, IResponse } from '../protocols/http';

export default class SignUpController {
  handle(request: IRequest): IResponse {
    if (!request.body.name) {
      return {
        statusCode: 400,
        body: new Error('Missing param: name'),
      };
    }

    if (!request.body.email) {
      return {
        statusCode: 400,
        body: new Error('Missing param: email'),
      };
    }

    return {
      statusCode: 200,
      body: 'ok',
    };
  }
}
