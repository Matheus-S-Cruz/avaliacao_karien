import { sql } from './db.js'

sql`
  CREATE TABLE produtos (
      id serial PRIMARY KEY,
      nome varchar(255),
      quantidade int
  );
`.then(() => {
  console.log('tabela criada');
})