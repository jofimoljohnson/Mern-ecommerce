import paypal from 'paypal-rest-sdk'

paypal.configure({
    mode:'sandbox',
    client_id:'ARyPM4o5yeygJRghZtSngR6UegTD0MAKzkYqvq4AO6yC55fexUYyA1-XGi03-iMsWy4T0__PkFVQXg65',
    client_secret:'EEE9KGeBbXFYT4PRC3JReKlgYs3JT-q1h4lxvluYYnJkjT3ZP7m8jpVrJ79Cxf76_SECCipwWKmUJ27r'
})

export default paypal