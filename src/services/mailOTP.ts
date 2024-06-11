const nodemailer = require('nodemailer');

const sendMailOTP = async (email: string, OTP: number) => {
   const transporter = nodemailer.createTransport({
      service: 'gmail',
      port: 465,
      secure: true,
      secureConnection: false,
      name: "Agri",
      auth: {
         user: 'ngovietthanh680@gmail.com',
         pass: process.env.PASS_MAIL
      },
      tls: {
         rejectUnauthorized: true
      }
   });

   const mailOptions = {
      from: '"Supply chain 👻" ngovietthanh680@gmail.com',
      to: email,
      subject: 'OTP for Registration',
      text: `Your OTP is: ${OTP}`,
   };

   await transporter.sendMail(mailOptions, (error: any, info: any) => {
      if (error) {
         return error;
      } else {
         console.log(info)
         return info;
      }
   });
}

export default sendMailOTP;