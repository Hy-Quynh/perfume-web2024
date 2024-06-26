const nodemailer = require("nodemailer");
require('dotenv').config();
const NODE_MAILER_USER = process.env.NODE_MAILER_USER || "";
const MAILER_CLIENT_ID = process.env.MAILER_CLIENT_ID || "";
const MAILER_CLIENT_SECRET = process.env.MAILER_CLIENT_SECRET || ""
const MAILER_REFRESH_TOKEN = process.env.MAILER_REFRESH_TOKEN || ""
const MAILER_ACCESS_TOKEN = process.env.MAILER_ACCESS_TOKEN || ""

// configure option
const option = {
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    type: "OAuth2",
    user: NODE_MAILER_USER,
    accessToken: MAILER_ACCESS_TOKEN,
    clientId: MAILER_CLIENT_ID,
    clientSecret: MAILER_CLIENT_SECRET,
    refreshToken: MAILER_REFRESH_TOKEN
  },
};

const transporter = nodemailer.createTransport(option);

const sendEmail = async ({ to, subject, text, html, ...rest }) => {
  try {
    const res = await transporter.verify();
    if (res) {
      const mail = {
        from: '"Perfume Store" <no-reply@accounts.perfume-store.com>',
        //receiver access
        to,
        //subject
        subject,
        //content text
        text,
        //html
        html,
        //others
        ...rest,
      };
      //Tiến hành gửi email
      const info = await transporter.sendMail(mail);
      if (info) {
        return true;
      }
    }
  } catch (err) {
    console.error("ERROR MAILER: ", err);
    return false;
  }
};
const headerHtmlMail = `<h1 style="color: #4c649b; font-size: 48px; border-bottom: solid 2px #ccc;padding-bottom: 10px">
      Perfume Store<br />
    </h1>`;
const footerHtmlVerifyMail = `<h3 style="color: red">
        Chú ý: Không đưa mã này cho bất kỳ ai,
        có thể dẫn đến mất tài khoản.<br />
        Mã chỉ có hiệu lực <i>10 phút </i> từ khi bạn nhận được mail.
    </h3>
    <h1>Cảm ơn.</h1>`;

// gửi mã xác nhận
const htmlSignupAccount = (token) => {
  return `<div>
      ${headerHtmlMail}
      <h2 style="padding: 10px 0; margin-bottom: 10px;">
          Xin chào anh (chị),<br />
          Mã xác nhận đăng ký tài khoản cho website Perfume Store của anh (chị).<br />
          Cảm ơn vì đã ghé thăm ND Store <3
      </h2>
      <h3 style="background: #eee;padding: 10px;">
        <i><b>${token}</b></i>
      </h3>
    ${footerHtmlVerifyMail}
    </div>`;
};

// gửi mã đổi mật khẩu
const htmlResetPassword = (token) => {
  return `<div>
      <h2 style="padding: 10px 0; margin-bottom: 10px;">
          Xin chào anh (chị),<br />
          Cửa hàng Perfume Store đã nhận được yêu cầu lấy lại mật khẩu từ quý anh (chị).<br />
          Anh (chị) vui lòng nhập mã sau đây để đặt mật khẩu mới:
      </h2>
      <h1 style="background: #eee;padding: 10px;">
        <i><b>${token}</b></i>
      </h1>
    </div>`;
};

// gửi thông báo đăng nhập sai quá nhiều
const htmlWarningLogin = () => {
  return `<div>
     ${headerHtmlMail}
      <h2 style="padding: 10px 0; margin-bottom: 10px;">
          Xin Chào anh (chị),<br />
          Cửa hàng nghi ngờ có ai đó đã cố gắng đăng nhập vào tài khoản của quý khách.<br />
          Nếu quý khác không nhớ mật khẩu hãy nhấn vào "Quên mật khẩu" để lấy lại mật khẩu<br/>
      </h2>
      <h1>Cảm ơn.</h1>
    </div>`;
};

module.exports = {
    sendEmail,
    htmlSignupAccount,
    htmlResetPassword,
    htmlWarningLogin,
  };
  