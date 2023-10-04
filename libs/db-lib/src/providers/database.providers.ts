import { Sequelize } from 'sequelize-typescript';
import { SEQUELIZE, DEVELOPMENT, TEST, PRODUCTION } from '../constants/database.constants';
import databaseConfig from '../configs/database.config';
import { User } from '@app/users-lib/entities/user.entity';
import { RefreshToken } from '@app/users-lib/entities/refresh-token.entity';
import { Post } from 'libs/posts-lib/entities';

export const databaseProviders = [
  {
    provide: SEQUELIZE,
    useFactory: async () => {
      let config;
      switch (process.env.NODE_ENV) {
        case DEVELOPMENT:
          config = databaseConfig.development;
          break;
        case TEST:
          config = databaseConfig.test;
          break;
        case PRODUCTION:
          config = databaseConfig.production;
          break;
        default:
          config = databaseConfig.development;
      }
      const sequelize = new Sequelize({ ...config, define: { underscored: true } });
      sequelize.addModels([User, RefreshToken, Post]);
      await sequelize.sync();
      return sequelize;
    },
  },
];
