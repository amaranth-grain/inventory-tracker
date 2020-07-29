/**
 * Checks to see if input is empty
 * @param {*} input 
 */
const isEmpty = input => {
	switch (typeof input) {
		case 'string':
			return input.trim() === "";
		case 'object':
			return Object.keys(input).length == 0;
		case 'undefined':
			return true;
		default:
			return;
	}
}
/**
 * Check for valid e-mail format
 * @param {*} email 
 */
const isValidEmail = (email) => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

/**
 * Validate user input before creating new user
 * @param {newUser} user 
 */
const validateNewUser = user => {
  let errors = {};
  if (isEmpty(user.email)) {
    errors.email = "Email cannot be empty";
	}
	if (!isValidEmail(user.email)) {
		errors.invalidEmail = "Invalid email address"
	}
  if (isEmpty(user.password) || isEmpty(user.confirmPassword)) {
    errors.password = "Password cannot be empty";
  } else if (user.password.length < 6 || user.password.length > 20) {
    errors.passwordLength = "Must be between 6 - 20 characters long";
  } else if (user.password !== user.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }
  return errors;
};

/**
 * Validate user login credentials
 * @param {string input} user 
 */
const validateLogin = user => {
	let errors = {};
	if (isEmpty(user.email)) {
		errors.email = "Email cannot be empty";
	}
	if (isEmpty(user.password)) {
		errors.password = "Password cannot be empty";
	} 
	return errors;
}

/**
 * Strips user bio of empty input fields
 * @param {*} data 
 */
const validateUserBio = data => {
	let userBio = {};
	if (!isEmpty(data.tagline)) userBio.tagline = data.tagline.trim();
	if (!isEmpty(data.site)) userBio.site = data.site.trim();
	if (!isEmpty(data.location)) userBio.location = data.location.trim();
	return userBio;
}

exports.validateNewUser = validateNewUser;
exports.validateLogin = validateLogin;
exports.validateUserBio = validateUserBio;
exports.isEmpty = isEmpty;

