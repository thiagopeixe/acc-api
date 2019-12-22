import Sequelize, { Model } from 'sequelize';

class Geolocation extends Model {
  static init(sequelize) {
    super.init(
      {
        usuario_id: Sequelize.STRING,
        type: Sequelize.STRING,
        latitude: Sequelize.REAL,
        longitude: Sequelize.REAL,
        coordinates: {
          type: Sequelize.VIRTUAL,
          get() {
            const coords = [
              this.getDataValue('latitude'),
              this.getDataValue('longitude'),
            ];
            return coords;
          },
        },
      },
      {
        timestamps: false,
        sequelize,
        modelName: 'geolocation',
      }
    );

    return this;
  }
}

export default Geolocation;
