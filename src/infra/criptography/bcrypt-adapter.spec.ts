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

  test('Should returns a hashed value on success', async () => {
    const { sut } = makeSut();
    jest
      .spyOn(bcrypt, 'hash')
      .mockReturnValueOnce(new Promise(resolve => resolve('hashed_value')));
    const hashedValue = await sut.encrypt('any_value');
    expect(hashedValue).toBe('hashed_value');
  });
});
