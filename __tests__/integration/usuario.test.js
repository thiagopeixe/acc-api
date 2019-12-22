import request from 'supertest';
import bcrypt from 'bcryptjs';
import app from '../../src/app';
const uuidv4 = require('uuid/v4');
import Usuario from '../../src/app/models/Usuario';
import truncate from '../util/truncate';

describe('Usuario', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should encrypt user password when new user created.', async () => {
    const usuario = await Usuario.create({
      id: uuidv4(),
      nome: 'Thiago Peixe',
      email: 'thiagopeixe.exe@gmail.com',
      senha: '123456',
      telefones: [
        {
          numero: '993314415',
          ddd: '81',
        },
      ],
      cep: '51030-065',
    });

    const compareHash = await bcrypt.compare('123456', usuario.senha_hash);

    expect(compareHash).toBe(true);
  });

  it('should function checaSenha() return false to wrong password.', async () => {
    const usuario = await Usuario.create({
      id: uuidv4(),
      nome: 'Thiago Peixe',
      email: 'thiagopeixe.exe@gmail.com',
      senha: '123456',
      telefones: [
        {
          numero: '993314415',
          ddd: '81',
        },
      ],
      cep: '51030-065',
    });

    const senhaFalsa = await usuario.checaSenha('123');

    expect(senhaFalsa).toBe(false);
  });

  it('should function checaSenha() return true to correct password.', async () => {
    const usuario = await Usuario.create({
      id: uuidv4(),
      nome: 'Thiago Peixe',
      email: 'thiagopeixe.exe@gmail.com',
      senha: '123456',
      telefones: [
        {
          numero: '993314415',
          ddd: '81',
        },
      ],
      cep: '51030-065',
    });

    const senhaCorreta = await usuario.checaSenha('123456');

    expect(senhaCorreta).toBe(true);
  });

  it('should be able to register', async () => {
    const response = await request(app)
      .post('/usuarios')
      .send({
        nome: 'Thiago Peixe',
        email: 'thiagopeixe.exe@gmail.com',
        senha: '123456',
        telefones: [
          {
            numero: '993314415',
            ddd: '81',
          },
        ],
        cep: '51030-065',
      });

    expect(response.body).toHaveProperty('id');
  });

  it('should not be able to register with duplicated email', async () => {
    await request(app)
      .post('/usuarios')
      .send({
        nome: 'Thiago Peixe',
        email: 'thiagopeixe.exe@gmail.com',
        senha: '123456',
        telefones: [
          {
            numero: '993314415',
            ddd: '81',
          },
        ],
        cep: '51030-065',
      });

    const response = await request(app)
      .post('/usuarios')
      .send({
        nome: 'Thiago Peixe',
        email: 'thiagopeixe.exe@gmail.com',
        senha: '123456',
        telefones: [
          {
            numero: '993314415',
            ddd: '81',
          },
        ],
        cep: '51030-065',
      });

    expect(response.status).toBe(409);
  });

  it('should be not possible create user without at least one phone number', async () => {
    const response = await request(app)
      .post('/usuarios')
      .send({
        nome: 'Thiago Peixe',
        email: 'thiagopeixe.exe@gmail.com',
        senha: '123456',
        telefones: [],
        cep: '51030-065',
      });

    expect(response.status).toBe(400);
  });

  it('should be not possible create user without email', async () => {
    const response = await request(app)
      .post('/usuarios')
      .send({
        nome: 'Thiago Peixe',
        email: '',
        senha: '123456',
        telefones: [
          {
            numero: '993314415',
            ddd: '81',
          },
        ],
        cep: '51030-065',
      });

    expect(response.status).toBe(400);
  });

  it('should be not possible create user without password', async () => {
    const response = await request(app)
      .post('/usuarios')
      .send({
        nome: 'Thiago Peixe',
        email: 'thiagopeixe.exe@gmail.com',
        telefones: [
          {
            numero: '993314415',
            ddd: '81',
          },
        ],
        cep: '51030-065',
      });

    expect(response.status).toBe(400);
  });

  it('should be not possible create user without cep', async () => {
    const response = await request(app)
      .post('/usuarios')
      .send({
        nome: 'Thiago Peixe',
        email: 'thiagopeixe.exe@gmail.com',
        senha: '123456',
        telefones: [
          {
            numero: '993314415',
            ddd: '81',
          },
        ],
      });

    expect(response.status).toBe(400);
  });

  it('should be not possible create user without name', async () => {
    const response = await request(app)
      .post('/usuarios')
      .send({
        nome: '',
        email: 'thiagopeixe.exe@gmail.com',
        senha: '123456',
        telefones: [
          {
            numero: '993314415',
            ddd: '81',
          },
        ],
        cep: '51030-065',
      });

    expect(response.status).toBe(400);
  });

  it('should be not possible create user with invalid phone number and area code format', async () => {
    const response = await request(app)
      .post('/usuarios')
      .send({
        nome: 'Thiago Peixe',
        email: 'thiagopeixe.exe@gmail.com',
        senha: '123456',
        telefones: [
          {
            numero: '993314415',
            ddd: '8',
          },
        ],
        cep: '51030-065',
      });

    expect(response.status).toBe(400);
  });

  it('should be not possible search user without token', async () => {
    const usuario = await Usuario.create({
      id: uuidv4(),
      nome: 'Thiago Peixe',
      email: 'thiagopeixe.exe@gmail.com',
      senha: '123456',
      telefones: [
        {
          numero: '993314415',
          ddd: '81',
        },
      ],
      cep: '51030-065',
    });

    const response = await request(app).get(`/search/${usuario.id}`);

    expect(response.status).toBe(401);
  });

  it('should be not possible search user with wrong token', async () => {
    const usuario = await Usuario.create({
      id: uuidv4(),
      nome: 'Thiago Peixe',
      email: 'thiagopeixe.exe@gmail.com',
      senha: '123456',
      telefones: [
        {
          numero: '993314415',
          ddd: '81',
        },
      ],
      cep: '51030-065',
    });

    const response = await request(app)
      .get(`/search/${usuario.id}`)
      .set('authorization', 'bearer 0000_wrongToken');

    expect(response.status).toBe(401);
  });
});
