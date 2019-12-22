import '../../bootstrap';
import axios from 'axios';

class MapsController {
  async getCoordinates(cep) {
    const API_KEY = process.env.MAPS_API_KEY;
    const API_URL = process.env.MAPS_API_URL;

    let url = `${API_URL}address=${cep}&key=${API_KEY}`;
    const data = await axios.get(url);
    return await data.data.results[0].geometry.location;
  }
}

export default new MapsController();
