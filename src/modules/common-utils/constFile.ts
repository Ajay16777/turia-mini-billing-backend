export default {
	AUTH_TOKEN_TYPE: {
		GUEST_TOKEN: 'GUEST_TOKEN',
		LOGIN_TOKEN:  'LOGIN_TOKEN',
	},
	JOI_DEFAULT_OPTS: {
		allowUnkown: true,
		abortEarly: false,
		noDefaults: false,
		convert: false,
	},
	ROLES: {
		ADMIN: 'Admin',
		USER: 'User',
	},
	BASIC_USER_FIELDS: ['firstName', 'middleName', 'lastName', 'userName', 'mobileNumber', 'email', 'registeredAt',
		'lastLogin', 'profilePhoto', 'intro', 'role', 'isActive', 'isReported', 'isBlocked', 'inviteCount', 'DOB',
		'Interests', 'Groups', 'Gender', 'Region', 'Bio', 'AccountType'],
	TOKEN_TYPE: {
		SIGNUP_TOKEN: 'SIGNUP_TOKEN',
		LOGIN_TOKEN: 'LOGIN_TOKEN',
	},
	SIGNUP_TOKEN_EXPIRY_TIME: 30 * 60, // 30 minutes in seconds
	LOGIN_TOKEN_EXPIRY_TIME: 24 * 60 * 60, // 24 hours in seconds
	AWS_KEYS: {
		USER_PROFILE_PIC: 'user_profile_pic',
	},
	AWS_SIGNED_URL_EXPIRE_TIME: 30 * 60, // 30 minutes in seconds
	GENDERS: ['Male', 'Female', 'Other'],
	ACCOUNT_TYPES: ['Private', 'Open', 'Business'],
	INTERESTS: [
		'Comedy', 'Animals', 'Food', 'Entertainment', 'Dance', 'Beauty & Style', 'Love & Dating',
		'Sports', 'DIY', 'Knowledge & Education', 'Gaming', 'Daily Life', 'Faith', 'Politics',
		'Drama', 'Talent', 'Automobiles', 'Family', 'Travel', 'Arts', 'Motivation', 'Life Hacks',
		'Careers', 'Tech & Gadgets', 'Health & Fitness', 'Business',
	],
};