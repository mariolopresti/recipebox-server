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


app.post('/api/recipes', (req, res) => {
  // Estraiamo tutti i campi dal body della richiesta
  const {
    nome,
    ingredienti,
    tempoPreparazione,
    difficolta,
    immagine,
    descrizione,
    preparazione
  } = req.body;

  // Query SQL con tutti i campi della tua tabella
  const sql = `INSERT INTO recipes (nome, ingredienti, tempoPreparazione, difficolta, immagine, descrizione, preparazione) VALUES (?, ?, ?, ?, ?, ?, ?)`;

  const values = [
    nome,
    ingredienti,
    tempoPreparazione,
    difficolta,
    immagine,
    descrizione,
    preparazione
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Errore durante l\'inserimento:', err);
      return res.status(500).json({ error: 'Errore nel database durante l\'inserimento' });
    }

    return res.status(201).json({
      message: 'Ricetta inserita con successo!',
      id: result.insertId
    });
  });
});


// LOGIN
app.post('/api/login', (req, res) => {
  const {username, password} = req.body;

  const sql = 'SELECT * FROM users WHERE username = ?';

  db.query(sql, [username], async (err, results) => {
    if (err) {
      console.error('Errore query login:', err);
      return res.status(500).json({ error: 'Errore nel database' });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: 'Utente non trovato' });
    }

    const user = results[0];

    // Fatto in modo basilare
    const isMatch =  user.password.toString() === password.toString() ;

    if (!isMatch) {
      return res.status(401).json({ error: 'Password errata' });
    }

    return res.json({
      message: 'Login effettuato con successo',
      username: user.username,
      id: user.id
    });
  });

});


app.listen(process.env.PORT || 8080, () => {
  console.log("Server started on port 8080");
})