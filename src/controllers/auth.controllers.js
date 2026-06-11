const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const emailService = require("../services/email.service");
const tokenBlackListModel = require("../models/blackList.model");
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

const userLoginController = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(401).json({
      message: "email and password are required!",
    });
  }
  const user = await userModel.findOne({ email }).select("+password");
  if (!user) {
    return res.status(401).json({
      message: "Email or password is invalid!",
    });
  }
  const isValidPassword = await user.comparePassword(password);

  if (!isValidPassword) {
    return res.status(401).json({
      message: "Email or password is invalid!",
    });
  }

  const token = jwt.sign(
    {
      userId: user._id,
    },
    process.env.JWT_SECRET,
    { expiresIn: "3d" },
  );
  res.cookie("token", token);
  res.status(200).json({
    message: "User logined sucessfully!",
    user: {
      id: user._id,
      name: user.name,
      email,
    },
    token,
    status: "success",
  });
};
const userLogoutController = async (req, res) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(200).json({
      message: "User logged out sucessfully!",
    });
  }

  await tokenBlackListModel.create({
    token,
  });
  res.clearCookie("token");
  res.status(200).json({
    message: "User logged out sucessfully!",
  });
};
module.exports = {
  userRegisterController,
  userLoginController,
  userLogoutController,
};
