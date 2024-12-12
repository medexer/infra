import emailUtils from 'libs/common/src/utils/email.utils';
import { AccountType } from 'libs/common/src/constants/enums';
import { Account } from 'libs/common/src/models/account.model';
// import { EmailTemplatesHelper } from 'libs/common/src/emailTemplatesHBS';

export default function newAccountNotifications(account: Account) {
  const customerOnboardingGraphics =
    'https://medexer.s3.eu-north-1.amazonaws.com/public/blood+donation.jpg';

  return {
    newAccount: () => {
      let html = '';
      let image = '';

      switch (account.accountType) {
        case AccountType.INDIVIDUAL:
          image = customerOnboardingGraphics;
          html = `
          <div>
            <p>Hi ${account.firstName},<br/>Welcome to Medexer, your go-to platform for booking blood donations!</p>
            <ul>
              <li><strong>Browse Donation Centers/Hospitals</strong> Discover a variety of products from trusted vendors.</li>
              <li><strong>Book Securely</strong> Use our secure platform to book for donation appointments.</li>
              <li><strong>Track Your Health</strong> Stay updated with your health with free tests results.</li>
            </ul>
            <p><strong>Why You'll Love Medexer?</strong></p>
            <ul>
              <li>Convenient Appointment Booking</li>
              <li>Free blood tests</li>
              <li>Top-Notch Support</li>
            </ul>
            <p>Your next act of selflessness is just a few clicks away. Start donating now!</p>
          </div>`;
          break;
      }

      emailUtils.sendEmail({
        html: 'Welcome to Medexer!',
        // html: EmailTemplatesHelper.renderImageTitleBodyTemplate(
        //   image,
        //   html,
        //   'Get ready for a impactful experience with Medexer!',
        //   account.email,
        // ),
        sub: 'Welcome to Medexer!',
        to_email: account.email,
      });
    },
  };
}
