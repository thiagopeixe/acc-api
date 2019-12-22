import Sequelize from 'sequelize';

import databaseConfig from '../config/database';

import Usuario from '../app/models/Usuario';
import Telefone from '../app/models/Telefone';
import Geolocation from '../app/models/Geolocation';

const models = [Usuario, Telefone, Geolocation];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }
}

export default new Database();
