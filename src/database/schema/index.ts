import { appSchema } from '@nozbe/watermelondb';

import { userSchema } from './userSchema';
import { carSchema } from './carSchema';

const schemas = appSchema({ //centralizar todas as tabelas
  version: 2,
  tables: [
    userSchema,
    carSchema
  ]
});

export { schemas }