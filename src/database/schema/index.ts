import { appSchema } from '@nozbe/watermelondb';

import { userSchema } from './userSchema';

const schemas = appSchema({ //centralizar todas as tabelas
  version: 1,
  tables: [
    userSchema
  ]
})

export { schemas }