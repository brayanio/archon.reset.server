const Database = require("@replit/database")
const db = new Database()
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

const request = async (account) => {
  // See https://stripe.com/docs/api/checkout/sessions/create
  // for additional parameters to pass.
  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: 'price_1IqMrdFXArBepcYK2TUVoH74',
          // For metered billing, do not pass quantity
          quantity: 1,
        },
      ],
      // {CHECKOUT_SESSION_ID} is a string literal; do not change it!
      // the actual Session ID is returned in the query parameter when your customer
      // is redirected to the success page.
      success_url: 'https://www.essencials.page/?session_id={CHECKOUT_SESSION_ID}#success',
      cancel_url: 'https://www.essencials.page/#canceled',
    })

    account.paymentSessionId = session.id
    account.savetodb()
    console.log('request payment session id:', account.paymentSessionId)

    return account.exportable()
  } catch (e) {
    return {
      error: {
        message: e.message,
      }
    }
  }
}

const checkPaymentSession = async (account) => {
    try {
        const session = await stripe.checkout.sessions.retrieve(account.paymentSessionId)

        console.log('checkPaymentSession', session)
        if(session.customer){
            account.customer = session.customer
            delete account.paymentSessionId
            account.savetodb()
            console.log('account customer id:', account.customer)

            let customerTable = await db.get('customerTable')
            if(!customerTable) customerTable = {}
            customerTable[account.customer] = `user-${account.email}`
            await db.set('customerTable', customerTable)
        }

        return account.exportable()
    } catch (e) {
        return {
            error: {
                message: e.message,
            }
        }
    }
}

const checkSubscription = async (account) => {
    try {
        const subscriptions = await stripe.subscriptions.list({
            customer: account.customer,
            status: 'all',
            expand: ['data.default_payment_method'],
        });

        // console.log('checkSubscription', subscriptions)
        if(subscriptions.data.find(s => s.status === 'active')) {
            account.active = true
        } else {
            account.account = false
        }
        account.savetodb()

        return account.exportable()
    } catch (e) {
        return {
            error: {
                message: e.message,
            }
        }
    }
}

const review = async (req) => {
    let
    data = req.body.data,
    eventType = req.body.type

    console.log('Webhook:', eventType)
    if (eventType === "invoice.payment_succeeded") {
        console.log(`🔔  Payment received!`)
        let customerTable = await db.get('customerTable')
        if(customerTable){
            console.log(customerTable)
        }
        console.log(data)        
        return {msg: 'Subscription confirmed'}
    }
}

module.exports = {
    request, checkPaymentSession, checkSubscription, review
}