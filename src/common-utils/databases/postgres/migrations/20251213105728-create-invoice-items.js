/** @type {import('sequelize-cli').Migration} */
export default {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('invoice_items', {
			id: {
				type: Sequelize.UUID,
				defaultValue: Sequelize.UUIDV4,
				primaryKey: true,
				allowNull: false,
			},

			invoice_id: {
				type: Sequelize.UUID,
				allowNull: false,
				references: {
					model: 'invoices',
					key: 'id',
				},
				onUpdate: 'CASCADE',
				onDelete: 'CASCADE',
			},

			description: {
				type: Sequelize.STRING,
				allowNull: false,
			},

			amount: {
				type: Sequelize.DECIMAL(10, 2),
				allowNull: false,
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

	async down(queryInterface) {
		await queryInterface.dropTable('invoice_items');
	},
};
