const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// In-memory database (replace with real database in production)
let books = [
    {
        id: 1,
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        isbn: "9780743273565",
        category: "Fiction",
        publicationDate: "1925-04-10",
        publisher: "Scribner",
        description: "A classic American novel",
        year: "1925",
        status: "available"
    },
    {
        id: 2,
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        isbn: "9780061120084",
        category: "Fiction",
        publicationDate: "1960-07-11",
        publisher: "J.B. Lippincott & Co.",
        description: "A novel about racial inequality",
        year: "1960",
        status: "available"
    }
];

let nextId = 3;

// API Routes
app.get('/api/books', (req, res) => {
    res.json(books);
});

app.post('/api/books', (req, res) => {
    const newBook = {
        id: nextId++,
        ...req.body,
        status: 'available'
    };
    books.push(newBook);
    res.status(201).json(newBook);
});

app.get('/api/books/search/:term', (req, res) => {
    const searchTerm = req.params.term.toLowerCase();
    const filteredBooks = books.filter(book => 
        book.title.toLowerCase().includes(searchTerm) ||
        book.author.toLowerCase().includes(searchTerm) ||
        book.isbn.includes(searchTerm)
    );
    res.json(filteredBooks);
});

app.delete('/api/books/:id', (req, res) => {
    const bookId = parseInt(req.params.id);
    const bookIndex = books.findIndex(book => book.id === bookId);
    
    if (bookIndex === -1) {
        return res.status(404).json({ error: 'Book not found' });
    }
    
    books.splice(bookIndex, 1);
    res.status(200).json({ message: 'Book deleted successfully' });
});

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});