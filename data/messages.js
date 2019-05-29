export default {
	user_not_found: 'User does not exist',
	user_updated: 'User has been sucessfully updated',
	confirm_email: 'Please confirm email to login',
	invalid_password: 'The password is invalid',
	account_deleted: 'Your account has been sucessfully deleted',
	account_registered: 'You have been sucessfully registered',
	email_confirmation: 'Please check your email',
	userAlreadyExists(user) {
		return `User ${user.email} already has been registered, login or reset password`
	},
	send_email_confirmation(link) {
		return `Plase confirm your account in order to use.
					Click this link <a>${link}</a>`
	},
	passwordResetSucessfull(user) {
		return `Your password has been reset sucessfully, you can login with your new password`
	},
	validation_errors: {}
}
