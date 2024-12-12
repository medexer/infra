export const donor_update_account_email_html_content = (
  donor: string,
  activationCode: string,
) => {
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
  <html dir="ltr" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">
  <head>
    <meta charset="UTF-8">
    <meta content="width=device-width, initial-scale=1" name="viewport">
    <meta name="x-apple-disable-message-reformatting">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta content="telephone=no" name="format-detection">
      <style type="text/css">
      a {text-decoration: none;}
      </style>
    <link href="https://fonts.googleapis.com/css2?family=Barlow&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Montserrat&display=swap" rel="stylesheet"><!--<![endif]-->
    <style type="text/css">
  .rollover:hover .rollover-first {
    max-height:0px!important;
    display:none!important;
  }
  .rollover:hover .rollover-second {
    max-height:none!important;
    display:block!important;
  }
  .rollover span {
    font-size:0px;
  }
  u + .body img ~ div div {
    display:none;
  }
  #outlook a {
    padding:0;
  }
  span.MsoHyperlink,
  span.MsoHyperlinkFollowed {
    color:inherit;
    mso-style-priority:99;
  }
  a.es-button {
    mso-style-priority:100!important;
    text-decoration:none!important;
  }
  a[x-apple-data-detectors],
  #MessageViewBody a {
    color:inherit!important;
    text-decoration:none!important;
    font-size:inherit!important;
    font-family:inherit!important;
    font-weight:inherit!important;
    line-height:inherit!important;
  }
  .es-desk-hidden {
    display:none;
    float:left;
    overflow:hidden;
    width:0;
    max-height:0;
    line-height:0;
    mso-hide:all;
  }
  .es-button-border:hover {
    border-color:#42d159 #42d159 #42d159 #42d159!important;
    background:#f4a3c1!important;
  }
  .es-button-border:hover a.es-button,
  .es-button-border:hover button.es-button {
    background:#f4a3c1!important;
  }

  @media only screen and (max-width: 600px) {
    .remove-padding-mobile {
            padding-top: 0 !important;
            padding-bottom: 0 !important;
            border-top-left-radius: 0px !important;
            border-top-right-radius: 0px !important;
            border-bottom-left-radius: 0px !important;
            border-bottom-right-radius: 0px !important;
        }
    } 

  @media only screen and (max-width:600px) {.es-m-p0r { padding-right:0px!important } .es-m-p20b { padding-bottom:20px!important } .es-m-p15r { padding-right:15px!important } .es-p-default { } *[class="gmail-fix"] { display:none!important } p, a { line-height:150%!important } h1, h1 a { line-height:120%!important } h2, h2 a { line-height:120%!important } h3, h3 a { line-height:120%!important } h4, h4 a { line-height:120%!important } h5, h5 a { line-height:120%!important } h6, h6 a { line-height:120%!important } .es-header-body p { } .es-content-body p { } .es-footer-body p { } .es-infoblock p { } h1 { font-size:46px!important; text-align:center } h2 { font-size:26px!important; text-align:center } h3 { font-size:20px!important; text-align:center } h4 { font-size:24px!important; text-align:left } h5 { font-size:20px!important; text-align:left } h6 { font-size:16px!important; text-align:left } .es-header-body h1 a, .es-content-body h1 a, .es-footer-body h1 a { font-size:46px!important } .es-header-body h2 a, .es-content-body h2 a, .es-footer-body h2 a { font-size:26px!important } .es-header-body h3 a, .es-content-body h3 a, .es-footer-body h3 a { font-size:20px!important } .es-header-body h4 a, .es-content-body h4 a, .es-footer-body h4 a { font-size:24px!important } .es-header-body h5 a, .es-content-body h5 a, .es-footer-body h5 a { font-size:20px!important } .es-header-body h6 a, .es-content-body h6 a, .es-footer-body h6 a { font-size:16px!important } .es-menu td a { font-size:16px!important } .es-header-body p, .es-header-body a { font-size:16px!important } .es-content-body p, .es-content-body a { font-size:16px!important } .es-footer-body p, .es-footer-body a { font-size:16px!important } .es-infoblock p, .es-infoblock a { font-size:12px!important } .es-m-txt-c, .es-m-txt-c h1, .es-m-txt-c h2, .es-m-txt-c h3, .es-m-txt-c h4, .es-m-txt-c h5, .es-m-txt-c h6 { text-align:center!important } .es-m-txt-r, .es-m-txt-r h1, .es-m-txt-r h2, .es-m-txt-r h3, .es-m-txt-r h4, .es-m-txt-r h5, .es-m-txt-r h6 { text-align:right!important } .es-m-txt-j, .es-m-txt-j h1, .es-m-txt-j h2, .es-m-txt-j h3, .es-m-txt-j h4, .es-m-txt-j h5, .es-m-txt-j h6 { text-align:justify!important } .es-m-txt-l, .es-m-txt-l h1, .es-m-txt-l h2, .es-m-txt-l h3, .es-m-txt-l h4, .es-m-txt-l h5, .es-m-txt-l h6 { text-align:left!important } .es-m-txt-r img, .es-m-txt-c img, .es-m-txt-l img { display:inline!important } .es-m-txt-r .rollover:hover .rollover-second, .es-m-txt-c .rollover:hover .rollover-second, .es-m-txt-l .rollover:hover .rollover-second { display:inline!important } .es-m-txt-r .rollover span, .es-m-txt-c .rollover span, .es-m-txt-l .rollover span { line-height:0!important; font-size:0!important; display:block } .es-spacer { display:inline-table } a.es-button, button.es-button { font-size:18px!important; padding:10px 20px 10px 20px!important; line-height:120%!important } a.es-button, button.es-button, .es-button-border { display:inline-block!important } .es-m-fw, .es-m-fw.es-fw, .es-m-fw .es-button { display:block!important } .es-m-il, .es-m-il .es-button, .es-social, .es-social td, .es-menu { display:inline-block!important } .es-adaptive table, .es-left, .es-right { width:100%!important } .es-content table, .es-header table, .es-footer table, .es-content, .es-footer, .es-header { width:100%!important; max-width:600px!important } .adapt-img { width:100%!important; height:auto!important } .es-mobile-hidden, .es-hidden { display:none!important } .es-desk-hidden { width:auto!important; overflow:visible!important; float:none!important; max-height:inherit!important; line-height:inherit!important } tr.es-desk-hidden { display:table-row!important } table.es-desk-hidden { display:table!important } td.es-desk-menu-hidden { display:table-cell!important } .es-menu td { width:1%!important } table.es-table-not-adapt, .esd-block-html table { width:auto!important } .h-auto { height:auto!important } }
  @media screen and (max-width:384px) {.mail-message-content { width:414px!important } }
  </style>
  </head>
  <body class="body" style="width:100%;height:100%;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0">
    <div dir="ltr" class="es-wrapper-color" lang="en" style="background-color:#FFFFFF"><!--[if gte mso 9]>
        <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
          <v:fill type="tile" color="#ffffff"></v:fill>
        </v:background>
      <![endif]-->
    <table width="100%" cellspacing="0" cellpadding="0" class="es-wrapper" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top;background-color:#FFFFFF">
            <tr>
        <td valign="top" class="remove-padding-mobile" style="padding-top:50px;Margin:0;background-color:#efefef;">
        
        <table cellspacing="0" cellpadding="0" align="center" class="es-content remove-padding-mobile" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:600px;background-color:#ffffff;border-top-left-radius: 15px;border-top-right-radius: 15px;table-layout:fixed !important">
              <tr>
                <td align="left" bgcolor="#fdfdfe" style="padding:20px;Margin:0;background-color:#fdfdfe;border-top-left-radius: 15px;border-top-right-radius: 15px;" data-custom-paddings="true">
                <table cellspacing="0" cellpadding="0" width="100%" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;border-top-left-radius: 15px;border-top-right-radius: 15px;">
                  <tr>
                    <td valign="top" align="center" class="es-m-p0r es-m-p20b" style="padding:0;Margin:0;width:560px">
                    <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                      <tr>
                            <div style="display:flex;justify-content:center;align-items:center">
                                <img src="https://fryrscb.stripocdn.email/content/guids/1cfe28ce-3b7b-495d-8288-2c2a2d2b65ef/images/dexer_2.png" 
                                    alt="Logo" 
                                    width="35" 
                                    height="35"
                                    style="display:block;border:0;outline:none;text-decoration:none;height:20;width:20;"
                                >
                            </div>
                            <td align="center" bgcolor="#fefdfd" style="padding:0;Margin:0"><h1 style="Margin:0;font-family:Barlow, sans-serif;mso-line-height-rule:exactly;letter-spacing:0;font-size:26px;font-style:normal;font-weight:normal;line-height:55.2px;color:#1C3B4E"><strong>Verify Email</strong></h1></td>
                      </tr>
                      <tr>
                        <td align="left" bgcolor="#fefdfd" class="es-m-p15r" style="Margin:0;padding-top:15px;padding-right:10px;padding-bottom:5px;padding-left:10px">
                          <p style="Margin:0;mso-line-height-rule:exactly;font-family:Barlow, sans-serif;line-height:27px;letter-spacing:0;color:#1C3B4E;font-size:18px">Hello ${donor},<br><br>We received a request to update the email for your Medexer account. To proceed, verify your new email address with this activation code:</p>
                        </td>
                      </tr>
                       <tr>
                        <td align="left" bgcolor="#fefdfd" class="es-m-p15r" style="Margin:0;padding-top:15px;padding-right:10px;padding-bottom:5px;padding-left:10px">
                          <p style="Margin:0;mso-line-height-rule:exactly;font-family:Barlow, sans-serif;line-height:27px;letter-spacing:0;color:#1C3B4E;font-size:18px;padding: 10px 4px 10px 4px; background-color:#f8f9fa;width:fit-content;"><strong>${activationCode}</strong></p>
                          </br>
                          <p style="Margin:0;mso-line-height-rule:exactly;font-family:Barlow, sans-serif;line-height:27px;letter-spacing:0;color:#1C3B4E;font-size:18px">This code is valid for the next 1 hour. Please enter it on the password verification page to authorize your request.</p>
                           </br>
                         
                        </td>
                      </tr>
                      
                    </table></td>
                  </tr>
                </table></td>
              </tr>
              <tr>
                <td align="left" data-custom-paddings="true" style="padding:0;Margin:0;padding-right:5px;padding-left:5px">
                <table cellpadding="0" cellspacing="0" width="100%" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                  <tr>
                    <td align="center" valign="top" style="padding:0;Margin:0;width:590px">
                    <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                      <tr>
                        <td align="center" height="5" style="padding:0;Margin:0"></td>
                      </tr>
                    </table></td>
                  </tr>
                </table></td>
              </tr>
            </table></td>
            </tr>
        </table>

        <table cellpadding="0" cellspacing="0" align="center" class="es-footer" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important;background-color:transparent;background-repeat:repeat;background-position:center top">
          <tr>
            <td align="center" bgcolor="#efefef" class="remove-padding-mobile"  style="padding-bottom:50px;Margin:0;background-color:#efefef">
            <table bgcolor="#ffffff" align="center" cellpadding="0" cellspacing="0" class="es-footer-body remove-padding-mobile" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px;border-bottom-left-radius: 15px;border-bottom-right-radius: 15px;">
              <tr>
                <td align="left" data-custom-paddings="true" style="Margin:0;padding-top:20px;padding-bottom:20px;padding-right:20px;padding-left:20px">
                <table cellpadding="0" cellspacing="0" width="100%" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                  <tr>
                    <td align="left" style="padding:0;Margin:0;width:560px">
                    <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                      <tr>
                        <td align="center" style="padding:0;Margin:0;padding-top:10px;padding-bottom:10px;font-size:0">
                        <table cellpadding="0" cellspacing="0" class="es-table-not-adapt es-social" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                          <tr>
                            <td align="center" valign="top" style="padding:0;Margin:0;padding-right:20px"><a target="_blank" href="https://www.facebook.com/medexerlimited" style="mso-line-height-rule:exactly;text-decoration:underline;color:#1C3B4E;font-size:14px"><img title="Facebook" src="https://fryrscb.stripocdn.email/content/assets/img/social-icons/rounded-black/facebook-rounded-black.png" alt="Fb" width="24" height="24" style="display:block;font-size:18px;border:0;outline:none;text-decoration:none"></a></td>
                            <td align="center" valign="top" style="padding:0;Margin:0;padding-right:20px"><a target="_blank" href="https://twitter.com/medexerLTD" style="mso-line-height-rule:exactly;text-decoration:underline;color:#1C3B4E;font-size:14px"><img title="X" src="https://fryrscb.stripocdn.email/content/assets/img/social-icons/rounded-black/x-rounded-black.png" alt="X" width="24" height="24" style="display:block;font-size:18px;border:0;outline:none;text-decoration:none"></a></td>
                            <td align="center" valign="top" style="padding:0;Margin:0"><a target="_blank" href="https://www.linkedin.com/company/medexer-limited" style="mso-line-height-rule:exactly;text-decoration:underline;color:#1C3B4E;font-size:14px"><img title="LinkedIn" src="https://fryrscb.stripocdn.email/content/assets/img/social-icons/rounded-black/linkedin-rounded-black.png" alt="In" width="24" height="24" style="display:block;font-size:18px;border:0;outline:none;text-decoration:none"></a></td>
                          </tr>
                        </table></td>
                      </tr>
                      
                      <tr>
                        <td align="center" style="padding:0;Margin:0;padding-top:10px;padding-bottom:10px"><p style="Margin:0;mso-line-height-rule:exactly;font-family:Barlow, sans-serif;line-height:21px;letter-spacing:0;color:#1c3b4e;font-size:14px">For assistance, contact <strong><a target="_blank" href="mailto:info@medexer.com.ng" style="mso-line-height-rule:exactly;text-decoration:none;color:#4895ef;font-size:14px">info@medexer.com.ng</a></strong></p></td>
                      </tr>
                      
                      <tr>
                        <td align="center" style="padding:0;Margin:0;padding-top:10px;padding-bottom:10px"><p style="Margin:0;mso-line-height-rule:exactly;font-family:Barlow, sans-serif;line-height:21px;letter-spacing:0;color:#1c3b4e;font-size:14px"><strong><a target="_blank" href="https://medexer.com.ng/privacy-policy/" style="mso-line-height-rule:exactly;text-decoration:none;color:#1C3B4E;font-size:14px">Privacy policy</a></strong></p></td>
                      </tr>
                    </table></td>
                  </tr>
                </table></td>
              </tr>
              <tr>
                <td align="left" data-custom-paddings="true" style="Margin:0;padding-top:20px;padding-bottom:20px;padding-right:20px;padding-left:20px">
                <table cellpadding="0" cellspacing="0" width="100%" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                  <tr>
                    <td align="left" style="padding:0;Margin:0;width:560px">
                    <table cellpadding="0" cellspacing="0" width="100%" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                      <tr>
                        <td align="center" style="padding:0;Margin:0;display:none"></td>
                      </tr>
                    </table></td>
                  </tr>
                </table></td>
              </tr>
            </table></td>
          </tr>
        </table></td>
      </tr>
    </table>
    </div>
  </body>
</html>
`;
};
