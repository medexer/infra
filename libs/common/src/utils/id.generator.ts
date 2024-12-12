export function ReferralCodeGenerator(): string {
  const length = 8;
  const charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

  let referralCode = '';
  const charsetLength = charSet.length;

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charsetLength);
    referralCode += charSet[randomIndex];
  }

  return 'MDX-' + referralCode.toUpperCase();
}
