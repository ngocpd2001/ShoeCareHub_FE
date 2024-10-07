const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.sendVerificationCode = functions.https.onCall(async (data, context) => {
  const phoneNumber = data.phoneNumber;

  // Generate a random 6-digit code
  const code = Math.floor(100000 + Math.random() * 900000);

  // Save the code to the Firestore database
  await admin.firestore().collection("verificationCodes").doc(phoneNumber).set({
    code: code,
  });

  // Send the code to the provided phone number
  // You can use a third-party SMS service for this

  return { success: true };
});
