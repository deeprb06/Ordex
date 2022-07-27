import message from '../message/api.message.js';

const validateCheck = (schema) => (req, res, next) => {
    let bodyData = req.body || req.query || req.params;
    const { error } = schema.validate(bodyData);
    if (error) {
        return res.status(message.BAD_REQUEST_CODE).send({ status: message.BAD_REQUEST_CODE, message: error.details[0].message });
    }
    next();
};
export default validateCheck;