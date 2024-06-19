import express from "express";
import mysql from "mysql";
import cors from "cors";
import dotenv from "dotenv";

// Charger les variables d'environnement
dotenv.config();

const app = express();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Connect to the database and handle any connection errors
app.use(express.json());
app.use(cors());

db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the MySQL server.");
});

app.get('/', (req, res) => {
  res.json('hello from backend');
});

app.get('/books', (req, res) => {
  const q = "SELECT * FROM books";
  db.query(q, (err, data) => {
    if (err) {
      console.error("Error querying the database:", err);
      return res.status(500).json(err);
    }
    return res.json(data);
  });
});

app.post("/books", (req,res) => {
  const q = "INSERT INTO books (`title`, `description`, `price`, `cover`) VALUES (?)";
  const values = [
    req.body.title,
    req.body.description,
    req.body.price,
    req.body.cover,
  ];

  db.query(q, [values], (err, data) => {
    if(err) return res.json(err)
      return res.json("Book has been created successfuly")
  });
});

app.delete("/books/:id", (req, res) => {
  const bookId = req.params.id;
  const q = "DELETE FROM books WHERE id = ?";

  db.query(q, [bookId], (err, data) => {
    if (err) return res.json(err);
    return res.json("Book has been deleted successfully!");
  });
});

app.put("/books/:id", (req,res) => {
  const bookId= req.params.id;
  const q = "UPDATE books SET `title`= ?, `description`= ?, `price` = ?, `cover` = ? WHERE id = ?";

  const values= [
    req.body.title,
    req.body.description,
    req.body.price,
    req.body.cover,
  ];

  db.query(q,[...values, bookId], (err,data) =>{
    if(err) return res.json(err)
    return res.json("Book has been updated successfully !")
  });

});

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
