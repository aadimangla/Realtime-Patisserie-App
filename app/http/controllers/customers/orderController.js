require('dotenv').config()
const Order = require('../../../models/order');
const moment = require('moment');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

function orderController() {
    return {
        store(req, res) {
            //Validate Request
            const { phone, address, stripeToken, paymentType } = req.body;
            if (!phone || !address) {
                return res.status(422).json({ message: 'All fields are required!' })
                // req.flash('error', 'All fields are required!')
                // return res.redirect('/cart')
            }

            const order = new Order({
                customerId: req.user._id,
                items: req.session.cart.items,
                phone: phone,
                address: address
            });
            order.save().then(result => {
                Order.populate(result, { path: 'customerId' }, (err, placedOrder) => {
                    // req.flash('success', 'Order Placed successfully');

                    // Stripe Payment
                    if (paymentType === 'card') {
                        
                        stripe.charges.create({
                            amount: req.session.cart.totalPrice * 100,
                            source: stripeToken,
                            currency: 'inr',
                            description: `Cake order: ${placedOrder._id}`
                        }).then(() => {
                            
                            placedOrder.paymentStatus = true;
                            placedOrder.paymentType = paymentType ;
                            placedOrder.save().then((ord) => {
                                //Emit
                                const eventEmitter = req.app.get('eventEmitter');
                                eventEmitter.emit('OrderPlaced', ord);
                                delete req.session.cart;
                                return res.json({ message: 'Payment successfull, Order Placed successfully' })
                            }).catch(err => {
                                console.log(err);
                            });

                        }).catch((err) => {
                            delete req.session.cart;
                            return res.json({ message: 'OrderPlaced but Payment failed, You can pay at delivery time' })
                        });

                    }
                    else {
                        delete req.session.cart;
                        return res.json({ message: 'Order Placed Successfully' })
                    }
                    // delete req.session.cart;
                    // // Emit to admin
                    // const eventEmitter = req.app.get('eventEmitter');
                    // eventEmitter.emit('OrderPlaced', placedOrder);

                    // return res.json({ message: 'Payment successfull, Order Placed successfully' })
                    // return res.redirect('/customers/orders')
                })

            }).catch(err => {
                return res.status(500).json({ message: 'Something went wrong!' })
                // req.flash('error', 'Something went wrong')
                // return res.redirect('/cart')
            })

        },
        async index(req, res) {
            const orders = await Order.find(
                { customerId: req.user._id },
                null,
                { sort: { 'createdAt': -1 } }
            )
            res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-state=0, post-check=0, pre-check=0')
            return res.render('customers/orders', { orders: orders, moment: moment })
        },
        async show(req, res) {
            order = await Order.findById(req.params.id)
            // Authorize User
            if (req.user._id.toString() === order.customerId.toString()) {
                res.render('customers/singleOrder', { order: order })
            }
            else {
                res.redirect('/')
            }

        }
    }
}

module.exports = orderController