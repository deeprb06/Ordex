import { Router } from 'express'
import { createUser, activateUser, signInUser, getUserInfo, resetLinkSend, resetUserPassword, addUserPreferences, resendActivationSend } from '../controller/user.controller';
import validateCheck from '../helpers/validator';
import authCheck from '../helpers/token.verify';
import { signUp, activate, signIn, resendActivateLink } from '../validator/user.validation'

const router = Router()

// Register User Routes
router.post('/signup', validateCheck(signUp), createUser);
router.post('/signin', validateCheck(signIn), signInUser);
router.post('/resend-activate', validateCheck(resendActivateLink), resendActivationSend);
router.post('/activate', validateCheck(activate), activateUser);

router.get('/info', authCheck, getUserInfo);
router.post('/resetlinksend', resetLinkSend);
router.post('/resetpassword', resetUserPassword);
router.put('/add-preferences', authCheck, addUserPreferences);

// router.post('/demo', validateCheck(signUp), demoUser)

export default router