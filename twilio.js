const accountSid = "ACbbe39eb6bfad9a4f938241c5fed778e2";
const authToken = "321b24cfdb722bdd526959f485153fbe";
const verifySid = "VAa27f315a7d3c2d1e7571188a71b7e78e";
const client = require("twilio")(accountSid, authToken);

const express = require('express')
// Download the helper library from https://www.twilio.com/docs/node/install
// Set environment variables for your credentials
// Read more at http://twil.io/secure


module.exports = {
  sentotp: (number) => {
    client.verify.v2
      .services(verifySid)
      .verifications.create({ to: `+91 ${number} `, channel: "sms" })
  },
  check: async (otpCode, number) => {
    try {
      const status = await client.verify.v2
        .services(verifySid)
        .verificationChecks.create({ to: `+91 ${number}`, code: otpCode });
      return status
    } catch (err) {
      console.log(err);
    }
  }
}
