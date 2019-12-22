import request from 'supertest';
const uuidv4 = require('uuid/v4');
import app from '../../src/app';
import truncate from '../util/truncate';
import Usuario from '../../src/app/models/Usuario';

describe('Signin', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should be not possible signin with invalid password', async () => {
    const response = await request(app)
      .post('/signin')
      .send({
        email: 'thiagopeixe.exe@gmail.com',
        senha: '1',
      });

    expect(response.status).toBe(401);
  });

  it('should be not possible signin with invalid e-mail', async () => {
    const response = await request(app)
      .post('/signin')
      .send({
        email: '',
        senha: '123456',
      });

    expect(response.status).toBe(401);
  });
});
