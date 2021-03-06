import express from 'express'
import multer from 'multer'
import {celebrate, Joi} from 'celebrate'
import multerConfig from './config/multer'

import PointsController from './controller/PointsController'
import ItemsController from './controller/ItemsController'

const routes = express.Router()
const upload = multer(multerConfig)

routes.get('/items', ItemsController.index)

routes.get('/points', PointsController.index)
routes.get('/point/:id', PointsController.show)
routes.get('/list', PointsController.listAllPoints)

routes.post('/points', 
    upload.single('image'), 
    celebrate({
      body: Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().required().email(),
        whatsapp: Joi.number().required(),
        latitude: Joi.number().required(),
        longitude: Joi.number().required(),
        city: Joi.string().required(),
        uf: Joi.string().required().max(2),
        items: Joi.string().required(),
        description: Joi.string().required(),
    }), 
  }, {
    abortEarly: false,
  }),
  PointsController.create
)

export default routes