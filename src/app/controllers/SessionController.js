import jwt from 'jsonwebtoken';
import authConfig from '../../config/auth';
import Usuario from '../models/Usuario';
import Telefone from '../models/Telefone';
import Geolocation from '../models/Geolocation';

class SessionController {
  async store(req, res) {
    const { email, senha } = req.body;

    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) {
      return res.status(401).json({ mensagem: 'Usuário e/ou senha inválidos' });
    }

    if (!(await usuario.checaSenha(senha))) {
      return res.status(401).json({ mensagem: 'Usuário e/ou senha inválidos' });
    }

    const { id } = usuario;
    const token = jwt.sign({ id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });

    usuario.token = token;
    usuario.senha = senha;
    await usuario.save();

    const usuarioOBJ = usuario.toJSON();

    delete usuarioOBJ.senha_hash;
    usuarioOBJ.data_criacao = new Date(usuarioOBJ.data_criacao).valueOf();
    usuarioOBJ.ultimo_login = new Date(usuarioOBJ.ultimo_login).valueOf();
    usuarioOBJ.data_atualizacao = new Date(
      usuarioOBJ.data_atualizacao
    ).valueOf();

    const telefones = await Telefone.findAll({
      attributes: ['ddd', 'numero'],
      where: { usuario_id: id },
    });

    const { type, coordinates } = await Geolocation.findOne({
      where: { usuario_id: id },
    });

    return res.json({
      ...usuarioOBJ,
      senha,
      telefones,
      geolocation: {
        type,
        coordinates,
      },
      token,
    });
  }
}

export default new SessionController();
