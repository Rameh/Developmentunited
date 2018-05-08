import { RegisterModel } from './register.model';

describe('Register Model', () => {
  it('has email', () => {
    let registerModel: RegisterModel = { email: 'test@test.test', password: 'Super Cat' };
    expect(registerModel.email).toEqual('test@test.test');
  });
  it('has password', () => {
    let registerModel: RegisterModel = { email: 'test@test.test', password: 'Super Cat' };
    expect(registerModel.password).toEqual('Super Cat');
  });
});
