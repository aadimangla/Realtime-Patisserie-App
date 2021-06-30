export class Cardwidget {

    stripe = null
    card = null
    style = {
        base: {
            color: '#32325d',
            fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
            fontSmoothing: 'antialiased',
            fontSize: '16px',
            '::placeholder': {
                color: '#aab7c4'
            }
        },
        invalid: {
            color: '#fa755a',
            iconColor: '#fa755a'
        }
    };


    constructor(stripe) {
        this.stripe = stripe;
    }

    mount() {
        const stripeElements = this.stripe.elements();
        this.card = stripeElements.create('card', { style: this.style, hidePostalCode: true });
        this.card.mount('#card-element');
    }

    destroy() {
        this.card.destroy();
    }

    async createToken() {
        try {
            const result = await this.stripe.createToken(this.card)
            return result.token
        } catch (err) {
            console.log(err);
        }

        //Verify Card
        // this.stripe.createToken(this.card).then((result) => {
        //     console.log(result);
        //     formObject.stripeToken = result.token.id;
        //     // console.log(formObject);
        //     placeOrder(formObject);
        // }).catch(err => {
        //     console.log(err);
        // });
    }
}