import { Router } from 'express';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';

const routes = new Router();
routes.get('/', (req, res) => {
  return res.status(404).json({ mensagem: 'Este endpoint não existe.' });
});
routes.post('/usuarios', UserController.store);
routes.post('/signin', SessionController.store);

routes.get('/all', UserController.index);
routes.get('/search/:user_id', UserController.show);

routes.all('*', function(req, res) {
  res.redirect('/');
});

export default routes;
