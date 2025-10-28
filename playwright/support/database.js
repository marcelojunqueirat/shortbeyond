const { Pool } = require('pg')
const bcrypt = require('bcrypt')
const { faker } = require('@faker-js/faker')
const { ulid } = require('ulid')
const fs = require('fs')
require('dotenv').config()

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});

async function cleanupTestData() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const query = `
      WITH usuarios_para_deletar AS (
        SELECT id FROM users WHERE email LIKE '@marcelo.tester'
      ),
      delete_links AS (
        DELETE FROM links
        WHERE user_id IN (SELECT id FROM usuarios_para_deletar)
      )
      DELETE FROM users
      WHERE id IN (SELECT id FROM usuarios_para_deletar);
    `;

    await client.query(query);

    await client.query('COMMIT');
    console.log('Usuários e links de teste removidos com sucesso.');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Erro ao remover dados de teste:', err);
  } finally {
    client.release();
  }
}

async function insertTestUsers() {
  const client = await pool.connect();
  try {
    console.log('🔄 Gerando 2000 usuários fictícios coerentes...')

    const users = []
    const hashedPassword = await bcrypt.hash('pwd123', 10)
    const plainPassword = 'pwd123'

    for (let i = 0; i < 2000; i++) {
      const id = ulid()
      const firstName = faker.person.firstName()
      const lastName = faker.person.lastName()
      const name = `${firstName} ${lastName}`
      const emailPrefix = `${firstName}.${lastName}`.toLowerCase().replace(/[^a-z0-9.]/g, '')
      const email = `${emailPrefix}${i}@marcelo.tester`

      users.push({
        id,
        name,
        email,
        password: hashedPassword,
        plainPassword,
      });
    }

    console.log('💾 Inserindo no banco de dados...')
    await client.query('BEGIN')

    const values = []
    const placeholders = users
      .map((u, i) => {
        const base = i * 4;
        values.push(u.id, u.name, u.email, u.password);
        return `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4})`
      })
      .join(',')

    const insertQuery = `
      INSERT INTO users (id, name, email, password)
      VALUES ${placeholders}
    `;

    await client.query(insertQuery, values)
    await client.query('COMMIT')

    console.log('✅ 2000 usuários inseridos com sucesso!')

    // 🧾 Gerar arquivo CSV
    console.log('🧩 Gerando arquivo users.csv...')
    const csvHeader = 'name,email,password\n'
    const csvContent = users
      .map(u => `${u.name},${u.email},${u.plainPassword}`)
      .join('\n')
    const csvData = csvHeader + csvContent

    fs.writeFileSync('users.csv', csvData, 'utf8')
    console.log('📁 Arquivo users.csv gerado com sucesso!')
  } catch (err) {
    await client.query('ROLLBACK')
    console.error('❌ Erro ao inserir usuários de teste:', err)
  } finally {
    client.release()
  }
}

module.exports = {
  cleanupTestData,
  insertTestUsers
}






