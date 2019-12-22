import Sequelize, { Model } from 'sequelize';

class Telefone extends Model {
  static init(sequelize) {
    super.init(
      {
        usuario_id: Sequelize.STRING,
        ddd: Sequelize.STRING,
        numero: Sequelize.STRING,
      },
      {
        timestamps: false,
        sequelize,
        modelName: 'telefone',
      }
    );
    return this;
  }
}

export default Telefone;
