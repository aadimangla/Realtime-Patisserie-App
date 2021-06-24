const homeController = require('../app/http/controllers/homeController');
const authController = require('../app/http/controllers/authController');
const cartController = require('../app/http/controllers/customers/cartController');
const orderController = require('../app/http/controllers/customers/orderController');
const guest = require('../app/http/middleware/guest')
// const

function initRoutes(app) {    
    app.get('/', homeController().index)

    app.get('/cart', cartController().cart)

    app.get('/login', guest , authController().login)

    app.get('/register', guest ,authController().register)

    app.post('/update-cart', cartController().update)
    
    app.post('/register', authController().postRegister)

    app.post('/login', authController().postLogin)

    app.post('/logout', authController().logout)

    app.post('/orders', orderController().store)
    
    app.get('/customers/orders', orderController().index)
}

module.exports = initRoutes;

//mongodb://localhost:27017/cakesDB ,  { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: true }