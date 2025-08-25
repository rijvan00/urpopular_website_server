//  SIGNUP 
exports.createUser = async (req, res) => {
  try {
    res.status(201).json({
      success: true,
      message: "success",
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

//  VERIFY OTP 
