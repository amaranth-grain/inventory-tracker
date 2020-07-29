const { admin } = require('./admin');

/**
 * Firebase user Authentication
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const FBAuth = async (req, res, next) => {
	try {
		let token;
		if (req.headers.authorization && req.headers.authorization.startsWith(`Bearer `)) {
			token = req.headers.authorization.split('Bearer ')[1];
		} else {
			return res.status(403).json({ error: 'Unauthorised access. No token found'});
		}
		let decodedToken = await admin.auth().verifyIdToken(token);
		req.user = decodedToken;
		return next();
	} catch (error) {
		res.status(403).json({ error: `Error with verifying token || ${error} || ${error.code}`});
	}
}

exports.FBAuth = FBAuth;