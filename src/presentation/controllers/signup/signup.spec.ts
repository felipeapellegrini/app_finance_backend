import SignUpController from './signup';
import {
  EmailValidator,
  AddAccount,
  AddAccountModel,
  AccountModel,
} from './signup-protocols';
import {
  InvalidParamError,
  MissingParamError,
  ServerError,
} from '../../errors';

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }
  return new EmailValidatorStub();
};

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    add(account: AddAccountModel): AccountModel {
      const fakeAccount = {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email@mail.com',
        password: 'valid_password',
      };

      return fakeAccount;
    }
  }
  return new AddAccountStub();
};

interface SutTypes {
  sut: SignUpController;
  emailValidatorStub: EmailValidator;
  addAccountStub: AddAccount;
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator();
  const addAccountStub = makeAddAccount();
  const sut = new SignUpController(emailValidatorStub, addAccountStub);

  return {
    sut,
    emailValidatorStub,
    addAccountStub,
  };
};

describe('SignUp Controller', () => {
  test('Should return 400 if no name is provided', () => {
    const { sut } = makeSut();
    const request = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };

    const response = sut.handle(request);
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual(new MissingParamError('name'));
  });

  test('Should return 400 if no email is provided', () => {
    const { sut } = makeSut();
    const request = {
      body: {
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };

    const response = sut.handle(request);
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual(new MissingParamError('email'));
  });

  test('Should return 400 if no password is provided', () => {
    const { sut } = makeSut();
    const request = {
      body: {
        email: 'any_email@mail.com',
        name: 'any_name',
        passwordConfirmation: 'any_password',
      },
    };

    const response = sut.handle(request);
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual(new MissingParamError('password'));
  });

  test('Should return 400 if no passwordConfirmation is provided', () => {
    const { sut } = makeSut();
    const request = {
      body: {
        email: 'any_email@mail.com',
        name: 'any_name',
        password: 'any_password',
      },
    };

    const response = sut.handle(request);
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual(
      new MissingParamError('passwordConfirmation'),
    );
  });

  test('Should return 400 if an invalid passwordConfirmation is provided', () => {
    const { sut } = makeSut();
    const request = {
      body: {
        email: 'any_email@mail.com',
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'invalid_password',
      },
    };

    const response = sut.handle(request);
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual(
      new InvalidParamError('passwordConfirmation'),
    );
  });

  test('Should return 400 if an invalid email is provided', () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);
    const request = {
      body: {
        name: 'any_name',
        email: 'invalid@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };

    const response = sut.handle(request);
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual(new InvalidParamError('email'));
  });

  test('Should call email validator with correct e-mail', () => {
    const { sut, emailValidatorStub } = makeSut();
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');
    const request = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };

    sut.handle(request);
    expect(isValidSpy).toHaveBeenCalledWith(request.body.email);
  });

  test('Should return 500 if email validator throws', () => {
    const { sut, emailValidatorStub } = makeSut();

    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error();
    });
    const request = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };

    const response = sut.handle(request);
    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual(new ServerError());
  });

  test('Should call AddAccount with correct values', () => {
    const { sut, addAccountStub } = makeSut();
    const addSpy = jest.spyOn(addAccountStub, 'add');
    const request = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };

    sut.handle(request);
    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password',
    });
  });
});