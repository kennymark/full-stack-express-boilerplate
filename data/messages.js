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

	userAlreadyExists(user) {
		return `User ${user.email} already has been registered, login or reset password`
	},

	validation_errors: {}
}
