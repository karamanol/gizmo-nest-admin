export function isValidEmail(email: string) {
  if (typeof email !== "string") return false;
  const emailReg = /\S+@\S+\.\S+/;
  return emailReg.test(email);
}
