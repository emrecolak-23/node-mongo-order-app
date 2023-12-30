// Email


// Notifications


// OTP
export const generateOTP = () => {

    const otp = Math.floor(100000 + Math.random() * 900000);
    let expiry = new Date();
    console.log(expiry, "expiry");
    expiry.setTime(new Date().getTime() + (30 * 60 * 1000));
    console.log(expiry, "expiry set time")
    return { otp, expiry }
}

export const onRequestOtp = async (otp: number, to: string) => {
  
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const from = process.env.TWILIO_PHONE_NUMBER;
    
    const client = require('twilio')(accountSid, authToken);
    
    const result = await client.messages.create({
        body: `Your OTP is ${otp}`,
        from,
        to: `+90${to}`
    })
    
    return result

}

// Payment Notification or Emails