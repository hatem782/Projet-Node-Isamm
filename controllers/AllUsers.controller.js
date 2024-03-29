const UserModel = require("../models/user.module");
const bcrypt = require("bcrypt");
const Mailer = require("../mails/Mail_Sender");
const GeneratePassword = require("../functions/GeneratePass");
const FileUpload = require("../uploads/FileUpload");
const { filt_year_parser } = require("../functions/FiltYearParser");
const cvModel = require("../models/cv.model");
const NotifsModel = require("../models/notifs.model");

const CreateUser = async (req, res) => {
  try {
    const { phoneNumber, email, firstName, lastName } = req.body;
    const existEmail = await UserModel.findOne({ email });
    if (existEmail)
      return res.status(409).json({
        Message: "email error",
        Success: false,
      });
    const existPhoneNumber = await UserModel.findOne({ phoneNumber });

    if (existPhoneNumber)
      return res.status(409).json({
        Message: "phoneNumber error",
        Success: false,
      });
    const salt = Number(process.env.SALT);
    const cryptedMdp = await bcrypt.hash(phoneNumber.toString(), salt);

    const newUser = new UserModel({
      ...req.body,
      password: cryptedMdp,
      userName: phoneNumber,
    });
    const createdUser = await newUser.save();

    /* let subject = "Authentication information";
    let content = `
    <div>
    <h2>Welcome ${firstName} ${lastName} to our plateforme</h2>
    <p>here you will find the informations about new account</p>
    <p>your login is : <b>${phoneNumber}</b> </p>
    <p>your M-D-P is : <b>${phoneNumber}</b> </p>
    <p>please make sure to change your password after you access to your account</p>
    </div>`;
    await Mailer.Mail_Sender(email, content, subject);*/

    if (createdUser.role === "STUDENT" || createdUser === "ALUMINIE") {
      const newCv = await cvModel.create({
        student: createdUser._id,
        bio: "",
        localisation: "",
        linkedIn: "",
        style: 1,
        experiences: [],
        formations: [],
        languages: [],
        hard_skills: [],
        soft_skills: [],
        hobbys: [],
      });
      await newCv.save();
    }

    return res.status(200).json({
      Message: "user created suucessfully",
      Success: true,
      data: createdUser,
    });
  } catch (error) {
    console.log("##########:", error);
    res.status(500).send({ Message: "Server Error", Error: error.message });
  }
};

const GetAllUsersByRole = async (req, res) => {
  try {
    const { role, saison } = req.query;
    let filter = await filt_year_parser({ role }, saison);
    console.log(filter);
    const users = await UserModel.find(filter);
    return res.status(200).json({
      Message: `all ${role.toLowerCase()}`,
      Success: true,
      data: users,
    });
  } catch (error) {
    console.log("##########:", error);
    res.status(500).send({ Message: "Server Error", Error: error.message });
  }
};

const UpdateGeneralInfos = async (req, res) => {
  try {
    const { _id } = req.user;
    // firstName, lastName, phoneNumber, birthDate, sex
    const isStudent = await UserModel.findOne({ _id });
    if (isStudent && isStudent.diplomeDate) {
      return res.status(400).json({
        Message:
          "you are diplomated, you can't change that type of informations",
        Success: false,
      });
    }
    const updatedUser = await UserModel.findOneAndUpdate(
      { _id },
      {
        $set: req.body,
      },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(400).json({
        Message: "Failed to update",
        Success: false,
      });
    }
    return res.status(200).json({ Message: "User updated", data: updatedUser });
  } catch (error) {
    console.log("##########:", error);
    res.status(500).send({ Message: "Server Error", Error: error.message });
  }
};

const DeleteUser = async (req, res) => {
  try {
    const { _id } = req.params;
    const removedUser = await UserModel.deleteOne({ _id });
    if (!removedUser) {
      return res.status(400).json({ Message: "Failed to delete user" });
    }
    return res.status(200).json({ Message: "user deleted successfully" });
  } catch (error) {
    console.log("##########:", error);
    res.status(500).send({ Message: "Server Error", Error: error.message });
  }
};

const pub_priv_profile = async (req, res) => {
  try {
    const { _id, isPublic } = req.user;

    const updateUser = await UserModel.findOneAndUpdate(
      { _id },
      {
        $set: {
          isPublic: !isPublic,
        },
      },
      { new: true }
    );
    if (!updateUser) {
      return res.status(400).json({
        Message: "Failed to update user",
        Success: false,
        Data: updateUser,
      });
    }
    return res
      .status(200)
      .json({ Message: "user updated successfully", data: updateUser });
  } catch (error) {
    console.log("##########:", error);
    res.status(500).send({ Message: "Server Error", Error: error.message });
  }
};

const UploadProfileImg = async (req, res) => {
  try {
    const _id = req.user._id;
    const file = req.files.file;
    const userType = req.userType;
    const imageData = await FileUpload.FileUpload(file, `${userType}/images`);

    const updateUser = await UserModel.findOneAndUpdate(
      { _id },
      {
        $set: {
          profilImage: imageData.url,
        },
      },
      { new: true }
    );
    if (!updateUser) {
      return res.status(400).json({
        Message: "Failed to update",
        Success: false,
      });
    }
    return res
      .status(200)
      .json({ Message: "updated successfully", data: updateUser });
  } catch (error) {
    console.log("##########:", error);
    res.status(500).send({ Message: "Server Error", Error: error.message });
  }
};

const ChangePassword = async (req, res) => {
  try {
    const _id = req.user._id;
    const { password, oldpassword, confpassword } = req.body;

    const passMatch = await bcrypt.compare(oldpassword, req.user.password);
    if (!passMatch) {
      return res.status(400).json({
        Message: "old password is not correct",
        Success: false,
      });
    }

    if (password !== confpassword) {
      return res
        .status(400)
        .json({ Message: "Confirm your Password", Success: false });
    }

    const salt = process.env.SALT;
    const cryptedMdp = await bcrypt.hash(password, Number(salt));

    const updateUser = await UserModel.findOneAndUpdate(
      { _id },
      {
        $set: {
          password: cryptedMdp,
        },
      },
      { new: true }
    );
    if (!updateUser) {
      return res.status(400).json({
        Message: "Failed to update",
        Success: false,
      });
    }
    return res
      .status(200)
      .json({ Message: "updated successfully", data: updateUser });
  } catch (error) {
    console.log("##########:", error);
    res.status(500).send({ Message: "Server Error", Error: error.message });
  }
};

const ForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ Message: "email is required", Success: false });
    }
    const existUser = await UserModel.findOne({ email });

    if (!existUser) {
      return res.status(400).json({
        Message: "there's no user with that email",
        Success: false,
      });
    }

    const password = GeneratePassword.GeneratePass();
    const salt = process.env.SALT;
    const cryptedMdp = await bcrypt.hash(password, Number(salt));

    const updateUser = await UserModel.findOneAndUpdate(
      { _id: existUser._id },
      {
        $set: {
          password: cryptedMdp,
        },
      },
      { new: true }
    );
    if (!updateUser) {
      return res.status(400).json({
        Message: "Failed to update",
        Success: false,
      });
    }

    // SENDING THE LOGIN AND PASSWORD TO USER WITH MAIL
    let subject = "Password Recover";
    let content = `
          <div>
          <h2>Welcome ${existUser.firstName} ${existUser.lastName} to our plateforme</h2>
          <p>we recieved a request to recover your password</p>
          <p>your new password is : <b>${password}</b> </p>
          <p>please make sure to change your password after you access to your account</p>
          </div>`;
    await Mailer.Mail_Sender(existUser.email, content, subject);

    return res
      .status(200)
      .json({ Message: "new password sent to your mail box" });
  } catch (error) {
    console.log("##########:", error);
    res.status(500).send({ Message: "Server Error", Error: error.message });
  }
};

const ChangeEmail = async (req, res) => {
  try {
    const _id = req.user._id;
    const email = req.body.email;

    if (!email) {
      return res
        .status(406)
        .json({ Message: "email field is emtpy", Success: false });
    }

    const existUser = await UserModel.findOne({ email });

    if (existUser) {
      return res.status(409).json({
        Message: "user already exists with that email",
        Success: false,
      });
    }

    const updateUser = await UserModel.findOneAndUpdate(
      { _id },
      {
        $set: {
          email: email,
        },
      },
      { new: true }
    );
    if (!updateUser) {
      return res.status(400).json({
        Message: "Failed to update",
        Success: false,
      });
    }
    return res
      .status(200)
      .json({ Message: "updated successfully", data: updateUser });
  } catch (error) {
    console.log("##########:", error);
    res.status(500).send({ Message: "Server Error", Error: error.message });
  }
};

const GetMyNotifs = async (req, res) => {
  try {
    const _id = req.user._id;

    const notifs = await NotifsModel.find({ user: _id });

    return res
      .status(200)
      .json({ Message: "updated successfully", data: notifs });
  } catch (error) {
    console.log("##########:", error);
    res.status(500).send({ Message: "Server Error", Error: error.message });
  }
};

module.exports = {
  CreateUser,
  GetAllUsersByRole,
  UpdateGeneralInfos,
  pub_priv_profile,
  UploadProfileImg,
  ChangePassword,
  ChangeEmail,
  ForgotPassword,
  DeleteUser,
  GetMyNotifs,
};
