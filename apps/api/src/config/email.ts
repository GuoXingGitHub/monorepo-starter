import { argv } from 'yargs';

export default {
  account: argv.email_account || 'your email address like : nonpawit.tee@aginix.tech',
  password: argv.email_password || 'your email password',
  from: '"Title App" <nonpawit.tee@aginix.tech>',
  admin: 'nonpawit.tee@aginix.tech',
};
