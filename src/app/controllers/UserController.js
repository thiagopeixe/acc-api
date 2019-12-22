const uuidv4 = require('uuid/v4');
import autoConfig from '../../config/auth';
import Usuario from '../models/Usuario';
import Telefone from '../models/Telefone';
import Geolocation from '../models/Geolocation';
import MapController from '../controllers/MapsController';

class UserController {
  async store(req, res) {
    const { telefones, ...userData } = req.body;

    if (!userData.email || userData.email === '') {
      return res.status(400).json({ mensagem: 'O campo email é necessário' });
    }
    if (!userData.nome || userData.nome === '') {
      return res.status(400).json({ mensagem: 'O campo nome é necessário' });
    }
    if (!userData.senha || userData.senha === '') {
      return res.status(400).json({ mensagem: 'O campo senha é necessário' });
    }
    if (!userData.cep || userData.cep === '') {
      return res.status(400).json({ mensagem: 'O campo cep é necessário' });
    }

    if (!telefones || telefones.length <= 0) {
      return res
        .status(400)
        .json({ mensagem: 'É necessário ao menos um número de telefone.' });
    }

    const telefonesValidos = telefones.map(telefone => {
      const { ddd, numero } = telefone;
      const dddValido = /\d{2}/.test(ddd) && ddd.length === 2;
      const numeroValido = /\d{9}/.test(numero) && numero.length === 9;
      return dddValido && numeroValido;
    });
    if (telefonesValidos.includes(false)) {
      return res
        .status(400)
        .json({ mensagem: 'Formato do telefone inválido.' });
    }

    const emailExists = await Usuario.findOne({
      where: { email: userData.email },
    });
    if (emailExists) {
      return res
        .status(409)
        .json({ mensagem: 'Este e-mail já foi utilizado.' });
    }

    const uuid = uuidv4();
    const usuario = await Usuario.create({ id: uuid, ...userData });

    const usuarioOBJ = usuario.toJSON();

    await telefones.map(telefone => {
      telefone.usuario_id = usuarioOBJ.id;
      return telefone;
    });
    await Telefone.bulkCreate(telefones, {
      returning: false,
    });
    const telefonesCriados = await Telefone.findAll({
      attributes: ['ddd', 'numero'],
      where: { usuario_id: usuarioOBJ.id },
    });

    const coordenadas = await MapController.getCoordinates(usuarioOBJ.cep);
    const { type, coordinates } = await Geolocation.create({
      usuario_id: usuarioOBJ.id,
      latitude: coordenadas.lat,
      longitude: coordenadas.lng,
    });
    const geolocation = { type, coordinates };

    delete usuarioOBJ.senha_hash;

    usuarioOBJ.data_criacao = new Date(usuarioOBJ.data_criacao).valueOf();
    usuarioOBJ.ultimo_login = new Date(usuarioOBJ.ultimo_login).valueOf();
    usuarioOBJ.data_atualizacao = new Date(
      usuarioOBJ.data_atualizacao
    ).valueOf();
    usuarioOBJ.geolocation = geolocation;
    usuarioOBJ.telefones = telefonesCriados;

    return res.status(201).json(usuarioOBJ);
  }

  async show(req, res) {
    const { user_id } = req.params;
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ mensagem: 'Não autorizado.' });
    }

    const usuario = await Usuario.findByPk(user_id);
    if (!usuario) {
      return res.status(401).json({ mensagem: 'Usuário não encontrado.' });
    }

    const [, token] = authHeader.split(' ');
    if (token !== usuario.token) {
      return res.status(401).json({ mensagem: 'Não autorizado.' });
    }

    const limiteDaSessao =
      usuario.ultimo_login.valueOf() + autoConfig.sessionTime;
    if (Date.now() > limiteDaSessao) {
      return res.status(401).json({ mensagem: 'Sessão inválida.' });
    }

    const usuarioOBJ = usuario.toJSON();

    const telefonesCriados = await Telefone.findAll({
      attributes: ['ddd', 'numero'],
      where: { usuario_id: usuarioOBJ.id },
    });

    const coordenadas = await MapController.getCoordinates(usuarioOBJ.cep);
    const { type, coordinates } = await Geolocation.create({
      usuario_id: usuarioOBJ.id,
      latitude: coordenadas.lat,
      longitude: coordenadas.lng,
    });
    const geolocation = { type, coordinates };

    delete usuarioOBJ.senha_hash;

    usuarioOBJ.data_criacao = new Date(usuarioOBJ.data_criacao).valueOf();
    usuarioOBJ.ultimo_login = new Date(usuarioOBJ.ultimo_login).valueOf();
    usuarioOBJ.data_atualizacao = new Date(
      usuarioOBJ.data_atualizacao
    ).valueOf();
    usuarioOBJ.geolocation = geolocation;
    usuarioOBJ.telefones = telefonesCriados;

    return res.status(201).json(usuarioOBJ);
  }
}

export default new UserController();
