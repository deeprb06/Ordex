import bcrypt from 'bcrypt';

// Generate activation hash
export const genHash = (maxRange = 99999999, saltSync = 5) => {
	const salt = bcrypt.genSaltSync(saltSync);
	const random = Math.floor(Math.random() * maxRange * 54) + 2;
	return bcrypt.hashSync(random.toString(), salt);
}