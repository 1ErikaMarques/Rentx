import { tableSchema } from '@nozbe/watermelondb';

const userSchema = tableSchema({ //definicao da tabela em si
  name: 'users',
  columns: [
    {
      name: 'user_id',
      type: 'string'
    },
    {
      name: 'name',
      type: 'string'
    },
    {
      name: 'email',
      type: 'string'
    },
    {
      name: 'driver_license',
      type: 'string'
    },
    {
      name: 'avatar',
      type: 'string'
    },
    {
      name: 'token',
      type: 'string'
    }
  ]
})

export { userSchema }