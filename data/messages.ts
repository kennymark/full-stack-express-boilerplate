export default {
  user_not_found: 'User does not have an account registered. Please signup in order to login',
  user_updated: 'User has been sucessfully updated',
  user_update_error: 'Could not update user, error occurred, please try again later',
  account_registered: 'You have been sucessfully registered, please check your email for confirmation and log in',
  account_deleted: 'Your account has been sucessfully deleted',
  account_frozen: 'Your account has been frozen, to unfreeze it login again',
  login_sucess: 'You have been sucessfully loggedin',
  login_failure: 'Error occurred whilst logging in, please try again later',
  invalid_password: 'The password is invalid',
  confirm_email: 'Please confirm email to login',
  email_confirmation: 'Please check your email',
  no_auth_header: 'Please login as request does not include authentication header',
  login_session_expired: 'Session has expired please login again',
  cant_access_resource: 'Please login to view this resource',
  cant_reuse_password: 'The same password cannot be used more than once',
  password_reset_success: 'Congratulations, your password has been reset, you can now log in',
  password_reset_fail: 'Looks like your password reset time has expired, please resetting your password again',
  general_error: 'An error has occurred, please try again later',
  admin_only: 'Page is restricted to admins only',

  userAlreadyExists(user) {
    return `User ${user.email} already has been registered, login or reset password`
  },

  passwordResetSuccess(user) {
    return `The link to reset your password has been sent to ${user.email}, please check your email.`
  },

  passwordForgotFail(email) {
    return `No such email ${email} exists in our database, please register for an account.`
  },

  reset_token_expired: 'The provided reset token has expired, please request a new password',

  validation_errors: {
    name: "Name should not be empty and greater than 5 characters",
    password: "Password should not be empty and greater than 5 characters",
    passwordMatch: "Passwords do not match, please ensure they do",
    emailNotEmpty: 'Email is not valid'
  },

}