import express, {json} from 'express';
import mysql from 'mysql';
import cors from 'cors';
import dotenv from 'dotenv';


const app = express();

app.use(express.json());
dotenv.config(); // Carica le variabili da .env

const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

const db = mysql.createConnection({
  host: process.env.MYSQL_HOST,           // localhost
  port: process.env.MYSQL_PORT || 3306,   // 8889
  user: process.env.MYSQL_USER,           // root
  password: process.env.MYSQL_PASSWORD,   // root
  database: process.env.MYSQL_DATABASE,
})

db.connect((err) => {
  if (err) {
    console.error('Errore di connessione al DB:', err);
    return;
  }
  console.log('Connesso al database MySQL');
});

// tutte le ricette
app.get('/api/recipes', (req, res) => {

  const sql = 'SELECT * FROM recipes'; // tabella "recipe"
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Errore query:', err);
      return res.status(500).json({ error: 'Errore nel database' });
    }

    return res.json(results); // risponde con JSON
  });
});


app.listen(process.env.PORT || 8080, () => {
  console.log("Server started on port 8080");
})