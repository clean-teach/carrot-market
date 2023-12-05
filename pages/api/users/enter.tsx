import { NextApiRequest, NextApiResponse } from 'next';
import client from '../../../libs/server/client';
import withHandler, { ResponseType } from '@libs/server/withHandler';
import Twilio from 'twilio';
import mail from '@sendgrid/mail';
import smtpTransport from '@libs/server/email';

const twilioClient = Twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
mail.setApiKey(process.env.SENDGRID_KEY!);

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>,
) {
  const { email, phone } = req.body;
  const user = phone ? { phone: +phone } : email ? { email } : null;
  if (!user) return res.status(400).json({ ok: false });
  const payload = Math.floor(100000 + Math.random() * 900000) + '';
  const token = await client.token.create({
    data: {
      payload,
      user: {
        connectOrCreate: {
          where: {
            ...user,
          },
          create: {
            name: 'Anonymous',
            ...user,
          },
        },
      },
    },
  });
  console.log('token : ', token);
  if (phone) {
    const message = await twilioClient.messages.create({
      messagingServiceSid: process.env.TWILIO_MSID,
      to: process.env.MY_PHONE!,
      body: `Your login token is ${payload}.`,
    });
    console.log('message : ', message);
    // } else if (email) {
    //   const email = await mail.send({
    //     from: 'nico@nomadcoders.co',
    //     to: 'nico@nomadcoders.co',
    //     subject: 'Your Carrot Market Verification Email',
    //     text: `Your token is ${payload}`,
    //     html: `<strong>Your token is ${payload}</strong>`,
    //   });
    //   console.log(email);
    // }
  } else if (email) {
    const mailOptions = {
      from: process.env.MAIL_ID,
      to: email,
      subject: 'Nomad Carrot Authentication Email',
      text: `Authentication Code : ${payload}`,
    };
    const result = await smtpTransport.sendMail(
      mailOptions,
      (error, responses) => {
        if (error) {
          console.log(error);
          return null;
        } else {
          console.log(responses);
          return null;
        }
      },
    );
    smtpTransport.close();
    console.log('email result : ', result);
  }
  return res.json({
    ok: true,
  });
}

export default withHandler('POST', handler);
