const sg = require('sendgrid')(process.env.SENDGRID_API_KEY);

'use strict';

exports.handler = (event, context, callback) => {

  const name = event.name;
  const helper = require('sendgrid').mail;
  const from_email = new helper.Email(event.from_email);
  const to_email = new helper.Email('tommy.gaessler@me.com');
  const subject = `New Message From ${name}`;
  const content = new helper.Content('text/plain', `${event.message}`);
  const mail = new helper.Mail(from_email, subject, to_email, content);

  const request = sg.emptyRequest({
    method: 'POST',
    path: '/v3/mail/send',
    body: mail.toJSON()
  });

  sg.API(request, function(err, res) {
    if (res) {
      const response = {
          statusCode: 200,
          body: `${name}, thanks for contacting me! I will get back to you asap!`
      }
      callback(null, response);
      return;
    } else {
      const error = {
          statusCode: 400,
          body: `${name}, your email failed to send.`
      }
      callback(null, error);
      return;
    }

  });
};
