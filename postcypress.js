const nodemailer = require('nodemailer');
const marge = require('mochawesome-report-generator');
const merge = require('mochawesome-merge');
const fs = require('fs');
const path = './cypress/reports/merged-report.json';

async function generateAndSendReport() {
  // Merge JSON reports
  const report = await merge({ files: ['./cypress/reports/*.json'] });
  fs.writeFileSync(path, JSON.stringify(report));

  // Generate HTML report
  await marge.create(report, {
    reportDir: 'cypress/reports',
    reportFilename: 'final-report',
  });

  // Send report email
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'msdhanan98@gmail.com', // replace with environment variables for security
      pass: 'your-email-password',
    },
  });

  const mailOptions = {
    from: 'msdhanan98@gmail.com',
    to: 'msdhanan98@example.com',
    subject: 'Cypress Test Report',
    text: 'Please find attached the Cypress test report.',
    attachments: [
      {
        filename: 'final-report.html',
        path: './cypress/reports/final-report.html',
      },
    ],
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Report emailed successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

generateAndSendReport();
