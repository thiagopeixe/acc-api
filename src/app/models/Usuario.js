import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import authConfig from '../../config/auth';

class Usuario extends Model {
  static init(sequelize) {
    super.init(
      {
        nome: Sequelize.STRING,
        email: Sequelize.STRING,
        senha: Sequelize.VIRTUAL,
        senha_hash: Sequelize.STRING,
        cep: Sequelize.STRING,
        token: Sequelize.STRING,
        ultimo_login: Sequelize.DATE,
      },
      {
        createdAt: 'data_criacao',
        updatedAt: 'data_atualizacao',
        sequelize,
        modelName: 'usuario',
      }
    );
    this.addHook('beforeSave', async usuario => {
      usuario.senha_hash = await bcrypt.hash(usuario.senha, 8);
    });
    this.addHook('beforeCreate', async usuario => {
      usuario.ultimo_login = new Date();
      usuario.token = jwt.sign({ id: usuario.id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      });
    });

    return this;
  }

  checaSenha(senha) {
    return bcrypt.compare(senha, this.senha_hash);
  }
}

export default Usuario;
