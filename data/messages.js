export default {
  user_not_found: 'User does not exist',
  user_updated: 'User has been sucessfully updated',
  confirm_email: 'Please confirm email to login',
  invalid_password: 'The password is invalid',
  account_deleted: 'Your account has been sucessfully deleted',
  login_sucess: 'You have been sucessfully loggedin',
  account_registered: 'You have been sucessfully registered',
  email_confirmation: 'Please check your email',
  no_auth_header: 'Please login as request does not include auth header',
  login_session_expired: 'Session has expired please login again',
  cant_access_resource: 'Please login to view this resource',
  cant_reuse_password: 'The same password cannot be used more than once',
  password_reset_success: 'Congratulations, your password has been reset, you can now log in',

  userAlreadyExists(user) {
    return `User ${user.email} already has been registered, login or reset password`
  },
  passwordResetSuccess(user) {
    return `The link to reset your password has been sent to ${user.email}, please check your email`
  },
  passwordResetFail(user) {
    return `No such email ${user.email} exists in our database, please register for an account`
  },
  validation_errors: {},

}