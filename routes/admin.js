const express = require('express')
let bcrypt = require('bcryptjs');
const AdminBro = require('admin-bro')
const AdminBroExpress = require('@admin-bro/express')
let router = express.Router()
const AdminBroMongoose = require('@admin-bro/mongoose')
const articles = require('../models/article')
const User = require('../models/user');
AdminBro.registerAdapter(AdminBroMongoose)
const adminBro = new AdminBro({
    resources: [{
      resource: User,
      options: {
        properties: {
          encryptedPassword: {
            isVisible: false,
          },
          password: {
            type: 'string',
            isVisible: {
              list: false, edit: true, filter: false, show: false,
            },
          },
        },
        actions: {
          new: {
            before: async (request) => {
              if(request.payload.password) {
                request.payload = {
                  ...request.payload,
                  encryptedPassword: await bcrypt.hash(request.payload.password, 10),
                  password: undefined,
                }
              }
              return request
            },
          }
        }
      }
    }, {
      resource: articles,
      options: {
        properties: {
          slug: {
            isVisible: false
          },
          createdAt: {
            isVisible: false
          },
          markdown: {
            type: 'textarea'
          },
          sanitizedHtml: {
            type: 'textarea',
            isVisible: true,

          }
      
        },
      }
    }],
    rootPath: '/admin',
  })
  router = AdminBroExpress.buildRouter(adminBro,  router)
module.exports = router