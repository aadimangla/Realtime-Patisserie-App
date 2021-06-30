import { loadStripe } from '@stripe/stripe-js';
import { placeOrder } from './apiService';
import { Cardwidget } from './CardWidget';

async function initStripe() {

    const stripe = await loadStripe('pk_test_51J7kHkSHbyfcoTwuCyYqcqiT4rK5aygMwEXHwJHPR5Z0wpo5TrWyjRDfj7mij943e8iO6Csyz0VUqq5UtvrBpGny00lsKvJIPf');
    let card = null;

    const paymentType = document.getElementById('paymentType');
    if (!paymentType) {
        return;
    }
    paymentType.addEventListener('change', (e) => {
        // console.log(e.target.value);
        if (e.target.value === 'card') {
            //Display widget 
            card = new Cardwidget(stripe);
            card.mount();
            // mountWidget();


        } else {
            card.destroy();
        }
    });

    // Ajax Call
    const paymentForm = document.getElementById('payment-form');
    if (paymentForm) {
        paymentForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            let formData = new FormData(paymentForm);
            let formObject = {}
            for (let [key, value] of formData.entries()) {
                formObject[key] = value
            }
            
            if (!card) {
                // Ajax
                placeOrder(formObject);
                // console.log(formObject);
            }

            const token = await card.createToken();
            formObject.stripeToken = token.id;
            placeOrder(formObject);
            // //Verify Card
            // stripe.createToken(card).then((result) => {
            //     console.log(result);
            //     formObject.stripeToken = result.token.id;
            //     // console.log(formObject);
            //     placeOrder(formObject);
            // }).catch(err => {
            //     console.log(err);
            // });

            // console.log(formObject);
        })
    }


}

export default initStripe;