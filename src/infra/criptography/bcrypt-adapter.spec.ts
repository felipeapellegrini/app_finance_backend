import bcrypt from 'bcrypt';
import { BcryptAdapter } from './bcrypt-adapter';

interface SutTypes {
  sut: BcryptAdapter;
  salt: number;
}

const makeSut = (): SutTypes => {
  const salt = 12;
  const sut = new BcryptAdapter(salt);

  return {
    sut,
    salt,
  };
};

describe('Bcrypt Adapter', () => {
  test('Should call Bcrypt with correct value', async () => {
    const { sut, salt } = makeSut();
    const hashPsy = jest.spyOn(bcrypt, 'hash');
    await sut.encrypt('any_value');
    expect(hashPsy).toHaveBeenCalledWith('any_value', salt);
  });
});
