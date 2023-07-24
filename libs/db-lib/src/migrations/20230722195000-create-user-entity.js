'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return await queryInterface.createTable('users', {
      lastName: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        unique: true,
        primaryKey: true,
      },
      firstName: {
        field: 'first_name',
        allowNull: false,
        type: Sequelize.STRING,
      },
      lastName: {
        field: 'last_name',
        allowNull: false,
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },

      username: { type: Sequelize.STRING, allowNull: false, unique: true },
      birthDate: {
        type: Sequelize.DATE,
        allowNull: false,
        field: 'birth_date',
        validate: {
          isPastDate(value) {
            if (value >= new Date()) {
              throw new Error('Birth date must be in the past.');
            }
          },
        },
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING,
        validate: {
          len: allowedPasswordLength,
          msg: 'Password must be between 8 and 50 characters.',
        },
      },

      role: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          isIn: [Object.values(UserRole)],
        },
      },

      isVerified: {
        field: 'is_verified',
        type: Sequelize.BOOLEAN,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    return await queryInterface.dropTable('Users');
  },
};
