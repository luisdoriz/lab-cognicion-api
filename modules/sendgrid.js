const sgMail = require('@sendgrid/mail')

const sendEmail = (to, text, html) => {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    const msg = {
        to, 
        from: 'luis.doriz@udem.edu', // Change to your verified sender
        subject: 'Sending with SendGrid is Fun',
        text,
        html,
      }
      console.log(msg)
      sgMail
        .send(msg)
        .then(() => {
          console.log('Email sent')
        })
        .catch((error) => {
            // console.error(error)
            console.log(error.response.body.errors)
        })
}

const sendEmailTest = async (email, token) => {
    html = `<strong>Test ${token}</strong>`
    text = "Nueva prueba"
    await sendEmail(email, text, html)
}

const sendEmailSurvey = async (email, token) => {
  html = `<strong>Test ${token}</strong>`
  text = "NuevCuestionario"
  await sendEmail(email, text, html)
}

module.exports = {
    sendEmail,
    sendEmailTest,
    sendEmailSurvey,
};

