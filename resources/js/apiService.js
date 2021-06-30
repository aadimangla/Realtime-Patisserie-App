import axios from 'axios'
import Noty from 'noty'

export function placeOrder(formObject) {
    axios.post('/orders', formObject).then(res => {
        console.log(res);
        new Noty({
            type: 'success',
            timeout: 1000,
            progressBar: false,
            text: res.data.message
        }).show();
        setTimeout(() => {
            window.location.href = '/customers/orders'
        }, 1000);
    }).catch(err => {
        console.log(err);
        new Noty({
            type: 'error',
            timeout: 1000,
            progressBar: false,
            text: 'Something went wrong'
        }).show();
    })
}