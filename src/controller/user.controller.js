import UsersModel from "../models/user.model";
import message from "../message/api.message";
import { genHash } from "../helpers/common";
import config from "../config";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { preferences } from "joi";

const secreteKey = config.JWT_SECRET;

/**
 * Create a new user
 */

export const createUser = async (req, res) => {
  // get data from body
  const { email, full_name, password, birth_date, preferences } = req.body;
  try {
    // check for user exits or not
    const exitsuser = await UsersModel.findOne({ email: email });
    if (exitsuser) {
      return res.status(message.ERROR_CODE).send({ status: message.ERROR_CODE, message: message.ERROR_USER_EXITS });
    }

    const activation_hash = genHash();

    // create a new user object
    let newuser = new UsersModel({
      full_name: full_name,
      email: email,
      birth_date: new Date(birth_date),
      password: password,
      activation_hash: activation_hash,
      preferences: preferences
    })

    const saveuser = await newuser.save();

    return res.status(message.SUCCESS_CODE).send({ status: message.SUCCESS_CODE, message: message.SUCCESS, data: saveuser });

  } catch (error) {
    console.log(error, '-error')
    return res.status(message.INTERNAL_SERVER_ERROR_CODE).send({ status: message.INTERNAL_SERVER_ERROR_CODE, message: message.ERROR, data: {} });
  }
}

/**
 * User account activation
 */

export const activateUser = async (req, res) => {
  const { email, activation_hash } = req.body;

  try {
    // check for user exits or not
    const exitsuser = await UsersModel.findOne({ email: email });
    if (!exitsuser) {
      return res.status(message.ERROR_CODE).send({ status: message.ERROR_CODE, message: message.ERROR_NOT_USER });
    }
    if (exitsuser.is_active == 1) {
      return res.status(message.ERROR_CODE).send({ status: message.ERROR_CODE, message: message.ALREADY_ACTIVE });
    }

    if (exitsuser.activation_hash != activation_hash) {
      return res.status(message.ERROR_CODE).send({ status: message.ERROR_CODE, message: message.ERROR_LINK });
    }

    await UsersModel.updateOne({ _id: exitsuser._id }, { $set: { is_active: 1, activation_hash: '' } })

    return res.status(message.SUCCESS_CODE).send({ status: message.SUCCESS_CODE, message: message.ACCOUNT_ACTIVATE });

  } catch (error) {
    console.log(error, '-error')
    return res.status(message.INTERNAL_SERVER_ERROR_CODE).send({ status: message.INTERNAL_SERVER_ERROR_CODE, message: message.ERROR, data: {} });
  }
}

/** *
 * User Log in
 */

export const signInUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // check for user exits or not
    const exitsuser = await UsersModel.findOne({ email: email });

    if (!exitsuser) {
      return res.status(message.ERROR_CODE).send({ status: message.ERROR_CODE, message: message.ERROR_NOT_USER });
    }

    if (exitsuser.is_active != 1) {
      return res.status(message.ERROR_CODE).send({ status: message.ERROR_CODE, message: message.ACCOUNT_NOT_ACTIVE });
    }

    let checkPassword = await exitsuser.comparePassword(password);

    if (!checkPassword) {
      return res.status(message.UNAUTHORIZE_CODE).send({ status: message.UNAUTHORIZE_CODE, message: message.ERROR_WRONG_PASSWORD });
    }

    const token = jwt.sign({
      _id: exitsuser._id,
      email: exitsuser.email
    }, secreteKey, {});

    let response = {
      _id: exitsuser._id,
      email: exitsuser.email,
      token: token
    }

    return res.status(message.SUCCESS_CODE).send({ status: message.SUCCESS_CODE, message: message.SUCCESS, data: response });

  } catch (error) {
    console.log(error, '-error')
    return res.status(message.INTERNAL_SERVER_ERROR_CODE).send({ status: message.INTERNAL_SERVER_ERROR_CODE, message: message.ERROR, data: {} });
  }
}

export const resendActivationSend = async (req, res) => {
  const { email } = req.body;
  try {
    const exitsuser = await UsersModel.findOne({ email: email });

    if (!exitsuser) {
      return res.status(message.ERROR_CODE).send({ status: message.ERROR_CODE, message: message.ERROR_NOT_USER });

    }

    let response = {
      activation_hash: exitsuser.activation_hash,
      email: exitsuser.email
    }

    return res.status(message.SUCCESS_CODE).send({ status: message.SUCCESS_CODE, message: message.SUCCESS, data: response });
  } catch (error) {
    console.log(error, '-error')
    return res.status(message.INTERNAL_SERVER_ERROR_CODE).send({ status: message.INTERNAL_SERVER_ERROR_CODE, message: message.ERROR, data: {} });

  }
}

/** *
 * User reset password functionality
 */

export const resetLinkSend = async (req, res) => {
  const { email } = req.body;
  try {
    const exitsuser = await UsersModel.findOne({ email: email });

    if (!exitsuser) {
      return res.status(message.ERROR_CODE).send({ status: message.ERROR_CODE, message: message.ERROR_NOT_USER });

    }

    let reset_hash = genHash();

    await UsersModel.updateOne({ _id: exitsuser._id }, { $set: { reset_hash: reset_hash } });

    let response = {
      reset_hash: reset_hash,
      email: exitsuser.email
    }

    return res.status(message.SUCCESS_CODE).send({ status: message.SUCCESS_CODE, message: message.SUCCESS, data: response });
  } catch (error) {
    console.log(error, '-error')
    return res.status(message.INTERNAL_SERVER_ERROR_CODE).send({ status: message.INTERNAL_SERVER_ERROR_CODE, message: message.ERROR, data: {} });

  }
}

export const resetUserPassword = async (req, res) => {
  const { reset_hash, email, password } = req.body;
  console.log(reset_hash, email, password)
  try {
    const exitsuser = await UsersModel.findOne({ email: email, reset_hash: reset_hash });

    if (!exitsuser) {
      return res.status(message.ERROR_CODE).send({ status: message.ERROR_CODE, message: message.NOT_FOUND_MESSAGE });
    }
    let hashPassword = await bcrypt.hash(password, 10);

    await UsersModel.updateOne({ _id: exitsuser._id }, { $set: { password: hashPassword, reset_hash: '' } });

    return res.status(message.SUCCESS_CODE).send({ status: message.SUCCESS_CODE, message: message.SUCCESS, data: {} });
  } catch (error) {
    console.log(error, '-error')
    return res.status(message.INTERNAL_SERVER_ERROR_CODE).send({ status: message.INTERNAL_SERVER_ERROR_CODE, message: message.ERROR, data: {} });

  }
}

/** *
 * Get single user information with his preferences
 */

export const getUserInfo = async (req, res) => {
  const userId = req.user._id;
  try {

    const userInfo = await UsersModel.findOne({ _id: userId }, {activation_hash: 0, password: 0, reset_hash:0})
    return res.status(message.SUCCESS_CODE).send({ status: message.SUCCESS_CODE, message: message.SUCCESS_USER_INFO, data: userInfo });
  }
  catch (error) {
    console.log(error, '-error')
    return res.status(message.INTERNAL_SERVER_ERROR_CODE).send({ status: message.INTERNAL_SERVER_ERROR_CODE, message: message.ERROR, data: {} });

  }
}
/** *
 * Add user preferences
 */
export const addUserPreferences = async (req, res) => {
  const { email, preferences } = req.body;
  const userId = req.user._id;

  try {
    const exitsuser = await UsersModel.findOne({ _id: userId });

    if (!exitsuser) {
      return res.status(message.BAD_REQUEST_CODE).send({ status: message.BAD_REQUEST_CODE, message: message.ERROR_NOT_USER, data: {} })
    }

    const userPrefUpdate = await UsersModel.updateOne({ email: exitsuser.email }, { $set: { preferences: preferences } });

    return res.status(message.SUCCESS_CODE).send({ status: message.SUCCESS_CODE, message: message.SUCCESS_USER_PREF_ADD});
  }
  catch (error) {
    console.log(error, '-error')
    return res.status(message.INTERNAL_SERVER_ERROR_CODE).send({ status: message.INTERNAL_SERVER_ERROR_CODE, message: message.ERROR, data: {} });

  }
}


