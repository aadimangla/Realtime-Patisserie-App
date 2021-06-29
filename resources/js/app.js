import axios from 'axios'
import Noty from 'noty'
import initAdmin from './admin'
import moment from 'moment'

let addToCart = document.querySelectorAll('.add-to-cart');
let cartCounter = document.querySelector('#cartCounter');
let deleteItem = document.querySelectorAll('#deleteItem');
let totalPrice = document.getElementById('totalPrice');

function deleteCartItem(cakeId) {
    console.log(cakeId)
    axios.post('/delete-item', cakeId).then(res => {
        // console.log(res.data.id);
        document.getElementById(`${res.data.id}`).remove();
        totalPrice.innerHTML = res.data.totalPrice;
        cartCounter.innerHTML = res.data.totalQty;
        new Noty({
            type: 'success',
            timeout: 1000,
            progressBar: false,
            text: 'Item Deleted from Cart'
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

deleteItem.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        // console.log(btn.dataset.cakeid);
        let deleteCakeId = {id: btn.dataset.cakeid }
        deleteCartItem(deleteCakeId)
    })
})


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



// Change Order status
let statuses = document.querySelectorAll('.status_line')
let hiddenInput = document.querySelector('#hiddenInput')
let order = hiddenInput ? hiddenInput.value : null
order = JSON.parse(order)
let time = document.createElement('small')

function updateStatus(order) {
    statuses.forEach((status) => {
        status.classList.remove('step-completed')
        status.classList.remove('current')
    })
    let stepCompleted = true;
    statuses.forEach((status) => {
        let dataProp = status.dataset.status
        if (stepCompleted) {
            status.classList.add('step-completed')
        }
        if (dataProp === order.status) {
            stepCompleted = false
            time.innerHTML = moment(order.updatedAt).format('hh:mm A')
            status.appendChild(time)
            if (status.nextElementSibling) {
                status.nextElementSibling.classList.add('current')
            }
        }
    })

}

updateStatus(order);

// Socket

let socket = io()


// Join
if (order) {
    socket.emit('join', `order_${order._id}`)
}

let adminAreaPath = window.location.pathname;
if (adminAreaPath.includes('admin')) {
    initAdmin(socket);
    socket.emit('join', 'adminRoom')
}


socket.on('orderUpdated', (data) => {
    const updatedOrder = { ...order }
    updatedOrder.updatedAt = moment().format()
    updatedOrder.status = data.status
    // console.log(data);
    updateStatus(updatedOrder)
    new Noty({
        type: 'success',
        timeout: 1000,
        progressBar: false,
        text: 'Status Updated'
    }).show();

})



