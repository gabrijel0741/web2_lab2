const {Pool} = require('pg');

// const pool = new Pool({
//     user: 'postgres',
//     host: 'localhost',
//     database: 'web2labos2_bln7',
//     password: 'bazepodataka',
//     port: 5433
// });

const pool = new Pool({
    user: process.env.DB_USERNAME,
    host: process.env.DB_HOSTNAME,
    database: 'web2labos2_bln7',
    password: process.env.DB_PASSWORD,
    port: 5432,
    ssl: { rejectUnauthorized: false }
});

const sql_create_sessions = `CREATE TABLE session (
    sid varchar NOT NULL COLLATE "default",
    sess json NOT NULL,
    expire timestamp(6) NOT NULL
  )
  WITH (OIDS=FALSE);`

const sql_create_session_index1 = `ALTER TABLE session ADD CONSTRAINT session_pkey PRIMARY KEY (sid) NOT DEFERRABLE INITIALLY IMMEDIATE`
const sql_create_session_index2 = `CREATE INDEX IDX_session_expire ON session(expire)`

const sql_create_users = `CREATE TABLE users(
    user_id SERIAL PRIMARY KEY,
    user_name text NOT NULL UNIQUE,
    first_name text NOT NULL,
    last_name text NOT NULL,
    password text NOT NULL
)`;

const sql_insert_users = `INSERT INTO users (user_name, first_name, last_name, password) VALUES ('aadmin', 'admin', 'adminko', 'aaddmmiinn'),
                          ('test', 'test', 'testić', 'tteesstt')`


let table_names = [
    "session",
    "users"
]

let tables = [
    sql_create_sessions,
    sql_create_users
];


let table_data = [
    undefined,
    sql_insert_users
]

let indexes = [
  sql_create_session_index1,
  sql_create_session_index2
]

if ((tables.length !== table_data.length) || (tables.length !== table_names.length)) {
    console.log("tables, names and data arrays length mismatch.")
    
}

(async () => {
    console.log("Creating and populating tables");
    await pool.query("DROP TABLE IF EXISTS session;", [])
    await pool.query("DROP TABLE IF EXISTS users;", [])
    for (let i = 0; i < tables.length; i++) {
        console.log("Creating table " + table_names[i] + ".");
        try {
            await pool.query(tables[i], [])
            console.log("Table " + table_names[i] + " created.");
            if (table_data[i] !== undefined) {
                try {
                    await pool.query(table_data[i], [])
                    console.log("Table " + table_names[i] + " populated with data.");
                } catch (err) {
                    console.log("Error populating table " + table_names[i] + " with data.")
                    return console.log(err.message);
                }
            }
        } catch (err) {
            console.log("Error creating table " + table_names[i])
            return console.log(err.message);
        }
    }

    console.log("Creating indexes");
    for (let i = 0; i < indexes.length; i++) {
        try {
            await pool.query(indexes[i], [])
            console.log("Index " + i + " created.")
        } catch (err) {
            console.log("Error creating index " + i + ".")
        }
    }

    await pool.end();
})()