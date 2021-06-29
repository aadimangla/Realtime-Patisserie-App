function cartController() {
    return {
        cart(req, res) {
            
            res.render('customers/cart')
        },
        update(req, res) {
            // this is the structure of the cart object that we will store inside cart
            // let cart = {
            //     items: {
            //         cakeId: {item: cakeObject, qty:0}
            //     },
            //     totalQty: 0,
            //     totalPrice: 0
            // }
            //req.session.cart is not present fro the first time that's why we create it here
            if (!req.session.cart) {
                req.session.cart = {
                    items: {},
                    totalQty: 0,
                    totalPrice: 0
                }

            }
            // Once it's created we store it in cart. If it's not the first time we are adding things in cart we
            // check if the item is there in cart or not. If it's there we simply increase it's qty and if it's not there
            // we add it to the cart(req.session.cart)
            let cart = req.session.cart
            // console.log(req.body);
            //check if item does not exist in cart and if it doesn't add that item details to it
            if (!cart.items[req.body._id]) {
                cart.items[req.body._id] = {
                    item: req.body,
                    qty: 1

                }
                cart.totalQty = cart.totalQty + 1
                cart.totalPrice = cart.totalPrice + req.body.price
            }
            else {
                //else just increase it qty
                cart.items[req.body._id].qty = cart.items[req.body._id].qty + 1
                cart.totalQty = cart.totalQty + 1
                cart.totalPrice = cart.totalPrice + req.body.price
            }

            return res.json({ totalQty: req.session.cart.totalQty })
        },
        delete(req, res) {
            // console.log(req.body);
            let cart = req.session.cart;            
            let cakeId = req.body.id
            console.log(cart.items[cakeId].qty);
            console.log(cart.items[cakeId].item.price);

            cart.totalPrice = cart.totalPrice - (cart.items[cakeId].qty*cart.items[cakeId].item.price)
            cart.totalQty = cart.totalQty - cart.items[cakeId].qty;
            
            delete cart.items[cakeId]
            console.log(cart.items);

            return res.json({ id: cakeId, totalPrice: cart.totalPrice, totalQty: cart.totalQty})
        }
    }
}

module.exports = cartController;