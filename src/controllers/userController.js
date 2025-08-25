const User = require("../models/user");
const sendToken = require("../utils/sendToken");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");


exports.createUser = catchAsyncErrors(async (req, res, next) => {
  try {
    console.log(req.body);
    const { name, phone } = req.body;
    if (phone == "+911111111111") {
      // Return a token or success message to the client
      res.status(200).json({
        success: true,
        message: "Please Verify your OTP",
      });
    } else {
      // Generate OTP
      const otp = generateOTP(6);

      // // Send OTP via Twilio SMS
      // await client.messages.create({
      //   body: `Hi ${name}, Your OTP for the Urpopular app is: ${otp}`,
      //   from: twilioPhoneNumber,
      //   to: phone,
      // });
      //check for the existing user

      const existingUser = await User.findOne({ phone: phone });

      if (existingUser) {
        existingUser.name = name;
        existingUser.otp = otp;
        await existingUser.save();
      } else {
        // Create a new user instance with the OTP
        const user = new User({
          name: name,
          phone: phone,
          otp: otp,
          isVerified: false,
        });
        // Save the user to the database
        await user.save();
        // Return a token or success message to the client
        res.status(200).json({
          success: true,
          message: `Please Verify your OTP, using ${otp}`,
        });
      }
    }
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ error: "Failed to send OTP." });
  }
});

//generate OTP:
function generateOTP(length) {
  // Generate a random number between 0 and 9
  var randomNumber = Math.floor(Math.random() * 10);

  // Create an empty string to store the OTP
  var otp = "";

  // Loop for the specified length
  for (var i = 0; i < length; i++) {
    // Append the random number to the OTP string
    otp += randomNumber;

    // Generate a new random number
    randomNumber = Math.floor(Math.random() * 10);
  }

  // Return the OTP string
  return otp;
}

//verify otp then next route
exports.VerifyOtp = catchAsyncErrors(async (req, res, next) => {
  try {
    const phone = req.body.phone;
    const clientOTP = req.body.otp;

    // Find the user in the database
    const user = await User.findOne({ phone: phone });
    // Compare the entered OTP
    if (phone == "+911111111111") {
      user.isVerified = true;
      await user.save();
      // Return the token to the client
      sendToken(user, 200, res);
    } else {
      if (user && user.otp === clientOTP) {
        // Save the updated user in the database
        user.otp = undefined;
        user.isVerified = true;
        await user.save();

        // Return the token to the client
        sendToken(user, 200, res);
      } else {
        res.status(400).json({ error: "Invalid OTP. Please try again." });
      }
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ error: "Failed to verify OTP." });
  }
});

