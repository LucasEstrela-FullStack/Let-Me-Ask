import { reset, seed } from 'drizzle-seed'
import { db, sql } from './connection.ts'
import { schema } from './schema/index.ts'

await reset(db, schema)

await seed(db, schema ).refine(f =>{
  return{
    rooms:{
        count: 5,
        columns:{
            name: f.companyName(),
            description: f.loremIpsum(),
        },
    },
    questions:{
      count: 20,
    }
  }
})

await sql.end()

// biome-ignore lint/suspicious/noConfsole : Uso para Dev
console.log('Database seeded successfully.')