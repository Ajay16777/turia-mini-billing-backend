import bcrypt from 'bcrypt';
import constants from '../../../constants.js';

const { ADMIN, CUSTOMER } = constants.ROLES
/** @type {import('sequelize-cli').Migration} */
export default {
	async up(queryInterface, Sequelize) {
		const hashedPassword = await bcrypt.hash('password123', 10);

		await queryInterface.bulkInsert(
			'users',
			[
				{
					id: Sequelize.literal('gen_random_uuid()'),
					name: 'Admin User',
					email: 'admin@example.com',
					phone: '9999999999',
					role: ADMIN,
					password: hashedPassword,
					created_at: new Date(),
					updated_at: new Date(),
				},
				{
					id: Sequelize.literal('gen_random_uuid()'),
					name: 'Normal User',
					email: 'user@example.com',
					phone: '8888888888',
					role: CUSTOMER,
					password: hashedPassword,
					created_at: new Date(),
					updated_at: new Date(),
				},
			],
			{}
		);
	},

	async down(queryInterface) {
		await queryInterface.bulkDelete(
			'users',
			{
				email: ['admin@example.com', 'user@example.com'],
			},
			{}
		);
	},
};
