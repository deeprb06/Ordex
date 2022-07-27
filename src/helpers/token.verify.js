import jwt from 'jsonwebtoken';
import UsersModel from "../models/user.model";
import message from "../message/api.message";
import config from '../config/index';

const authCheck = (req, res, next) => {

  const token = req.header('auth-token');

  if (!token) {
    return res.status(message.UNAUTHORIZE_CODE).send({ status: message.UNAUTHORIZE_CODE, message: message.TOKEN_NOT_PROVIDE, data: {} })
  }

  jwt.verify(token, config.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ status: message.ERROR_CODE, message: message.TOKEN_UNAUTHORIZED, data: {} });
    }
    else {
      console.log(decoded,'-decoded');
      req.user = decoded;
      next();
    }
  })
}
export default authCheck;