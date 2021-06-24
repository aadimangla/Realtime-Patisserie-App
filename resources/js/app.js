import axios from 'axios'
import Noty from 'noty'

let addToCart = document.querySelectorAll('.add-to-cart');
let cartCounter = document.querySelector('#cartCounter');

function updateCart(cake) {
    axios.post('/update-cart', cake).then(res => {
        // console.log(res);
        cartCounter.innerHTML = res.data.totalQty;
        new Noty({
            type: 'success',
            timeout: 1000,
            progressBar: false,
            text: 'Item added to Cart'
        }).show();
    }).catch(err => {
        new Noty({
            type: 'error',
            timeout: 1000,
            text: 'Something went Worng!',
            progressBar: false
        }).show();
    })
}

addToCart.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        // console.log(e);
        let cake = JSON.parse(btn.dataset.cake);
        updateCart(cake)
        // console.log(cake.name);
    })
})

// Remove alert message after X seconds
const alertMsg = document.querySelector('#success-alert');

if (alertMsg) {
    setTimeout(() => {
        alertMsg.remove();
    }, 2000);
}