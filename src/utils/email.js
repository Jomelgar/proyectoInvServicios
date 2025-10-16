import emailjs from 'emailjs-com';

export async function sendVerificationCode(email, code) {
  return await fetch(import.meta.env.VITE_URL_CODE, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: email,
    verification_code: code
  })
});
}
