// Controllers
const homeController = require('../app/http/controllers/homeController');
const authController = require('../app/http/controllers/authController');
const cartController = require('../app/http/controllers/customers/cartController');
const orderController = require('../app/http/controllers/customers/orderController');
const adminOrderController = require('../app/http/controllers/admin/orderController');
const statusController = require('../app/http/controllers/admin/statusController');
const menuController = require('../app/http/controllers/admin/menuController');

//Middlewares
const guest = require('../app/http/middleware/guest')
const auth = require('../app/http/middleware/auth')
const admin = require('../app/http/middleware/admin')


//Routes
function initRoutes(app) {    
    app.get('/', homeController().index)

    app.get('/cart', cartController().cart)

    app.get('/login', guest , authController().login)

    app.get('/register', guest ,authController().register)

    app.post('/update-cart', cartController().update)

    app.post('/delete-item', cartController().delete)
    
    app.post('/register', authController().postRegister)

    app.post('/login', authController().postLogin)

    app.post('/logout', authController().logout)
    // Customer routes
    app.post('/orders', auth, orderController().store)
    
    app.get('/customers/orders', auth, orderController().index)

    app.get('/customers/orders/:id', auth, orderController().show)


    //Admin routes
    app.get('/admin/orders', admin, adminOrderController().index)

    app.get('/admin/menu', admin, menuController().index)

    app.post('/admin/menu', admin, menuController().store)

    app.post('/admin/orders/status', admin, statusController().update)
}

module.exports = initRoutes;

//mongodb://localhost:27017/cakesDB ,  { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: true }