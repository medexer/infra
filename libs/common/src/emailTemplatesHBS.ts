// import * as fs from 'fs';
// import * as path from 'path';
// import handlebars from 'handlebars';

// const templatesDir = path.join(__dirname, '../email-templates/compiled');

// console.log('[TEMPLATES-DIR] : ', templatesDir);

// interface RenderFunction {
//   (data: Record<'email' | 'preview' | string, string | any>): string;
// }

// const emailTemplatesHBS: Record<string, RenderFunction> = {};

// fs.readdirSync(templatesDir).forEach((file) => {
//   if (path.extname(file) === '.html') {
//     const templateName = path.basename(file, '.html');
//     const templatePath = path.join(templatesDir, file);

//     const templateContent = fs.readFileSync(templatePath, 'utf-8');
//     const compiledTemplate = handlebars.compile(templateContent);

//     emailTemplatesHBS[templateName] = (data: Record<string, any>) =>
//       compiledTemplate(data);
//   }
// });

// export const EmailTemplatesHelper = {
//   renderTemplate(templateName: 'otp_template', data: Record<string, any>) {
//     const renderFunction = emailTemplatesHBS[templateName];
//     if (!renderFunction) {
//       throw new Error(`Template '${templateName}' not found`);
//     }
//     return renderFunction(data);
//   },

//   renderOTPTemplate(otp: string, firstName: string, email) {
//     return emailTemplatesHBS['otp_template']({
//       otp,
//       preview: `Your Medexer OTP is ${otp}`,
//       firstName,
//       email,
//     });
//   },

//   renderTitleBodyTemplate(
//     title: string,
//     body: string,
//     preview: string,
//     email: string,
//   ) {
//     return emailTemplatesHBS['title_body_template']({
//       title,
//       body,
//       preview: preview,
//       email,
//     });
//   },
//   renderWelcomeTemplate(
//     image: string,
//     body: string,
//     preview: string,
//     email: string,
//   ) {
//     return emailTemplatesHBS['welcome_template']({
//       image,
//       body,
//       preview: preview,
//       email,
//     });
//   },
//   renderImageTitleBodyTemplate(
//     image: string,
//     body: string,
//     preview: string,
//     email: string,
//   ) {
//     return emailTemplatesHBS['image_body_template']({
//       image,
//       body,
//       preview: preview,
//       email,
//     });
//   },
//   renderBodyTemplate(body: string, preview?: string, email?: string) {
//     return emailTemplatesHBS['body_template']({
//       body,
//       preview: preview,
//       email,
//     });
//   },
//   renderBodyLinkTemplate(
//     body: string,
//     link: string,
//     linkText: string,
//     nextBody?: string,
//     preview?: string,
//     email?: string,
//   ) {
//     return emailTemplatesHBS['body_link_template']({
//       body,
//       link,
//       linkText,
//       nextBody,
//       preview: preview,
//       email,
//     });
//   },
// };

// export default emailTemplatesHBS;
