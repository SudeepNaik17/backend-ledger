const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const emailService = require("../services/email.service");

const userRegisterController = async (req, res) => {
  const { email, password, name } = req.body;

  const isExists = await userModel
    .findOne({
      email,
    })
    .select("+password");
  if (isExists) {
    return res.status(422).json({
      message: "User already registered with same email!",
      status: "failed",
    });
  }
  try {
    const user = await userModel.create({
      email,
      name,
      password,
    });

    const token = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "3d" },
    );
    res.cookie("token", token);
    res.status(201).json({
      message: "User created sucessfully!",
      user: {
        id: user._id,
        name,
        email,
      },
      token,
      status: "success",
    });

    await emailService.sendRegistrationEmail(user.email, user.name);
  } catch (e) {
    console.log("error", e);
    res.status(500).json({
      message: "User not created!",
      status: "failed",
    });
  }
};

module.exports = { userRegisterController };
