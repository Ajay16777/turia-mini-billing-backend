import constants from '../../../constants.js';

const {
	PENDING,
	PAID,
	CANCELLED,
	OVERDUE,
} = constants.INVOICE_STATUS;

/** @type {import('sequelize-cli').Migration} */
export default {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('invoices', {
			id: {
				type: Sequelize.UUID,
				defaultValue: Sequelize.UUIDV4,
				primaryKey: true,
				allowNull: false,
			},

			customer_id: {
				type: Sequelize.UUID,
				allowNull: false,
				references: {
					model: 'users',
					key: 'id',
				},
				onUpdate: 'CASCADE',
				onDelete: 'RESTRICT',
			},

			invoice_no: {
				type: Sequelize.STRING,
				allowNull: false,
				unique: true,
			},

			subtotal: {
				type: Sequelize.DECIMAL(10, 2),
				allowNull: false,
			},

			gst_percentage: {
				type: Sequelize.DECIMAL(5, 2),
				allowNull: false,
			},

			gst_amount: {
				type: Sequelize.DECIMAL(10, 2),
				allowNull: false,
			},

			total_amount: {
				type: Sequelize.DECIMAL(10, 2),
				allowNull: false,
			},

			status: {
				type: Sequelize.ENUM(
					PENDING,
					PAID,
					CANCELLED,
					OVERDUE
				),
				allowNull: false,
				defaultValue: PENDING,
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
		await queryInterface.dropTable('invoices');
		await queryInterface.sequelize.query(
			'DROP TYPE IF EXISTS "enum_invoices_status";'
		);
	},
};
