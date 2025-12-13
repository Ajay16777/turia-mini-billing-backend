import constants from '../../../constants.js';

const { ADMIN, CUSTOMER } = constants.ROLES

/** @type {import('sequelize-cli').Migration} */
export default {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('users', {
			id: {
				type: Sequelize.UUID,
				defaultValue: Sequelize.UUIDV4,
				primaryKey: true,
				allowNull: false,
			},

			name: {
				type: Sequelize.STRING,
				allowNull: false,
			},

			email: {
				type: Sequelize.STRING,
				allowNull: false,
				unique: true,
			},

			phone: {
				type: Sequelize.STRING,
				allowNull: true,
			},

			password: {
				type: Sequelize.STRING,
				allowNull: false,
			},

			role: {
				type: Sequelize.ENUM(ADMIN, CUSTOMER),
				allowNull: false,
				defaultValue: CUSTOMER,
			},

			created_at: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.fn('NOW'),
			},

			updated_at: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.fn('NOW'),
			},
		});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('users');
		await queryInterface.sequelize.query(
			'DROP TYPE IF EXISTS "enum_users_role";'
		);
	},
};
