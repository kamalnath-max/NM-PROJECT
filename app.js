// API base URL
const API_BASE = '/api/books';

// DOM Elements
let booksGrid, bookForm, searchInput, searchButton;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    booksGrid = document.getElementById('booksGrid');
    bookForm = document.getElementById('bookForm');
    searchInput = document.querySelector('.search-bar input');
    searchButton = document.querySelector('.search-bar button');
    
    // Load initial books
    loadBooks();
    
    // Form submission handler
    bookForm.addEventListener('submit', handleFormSubmit);
    
    // Search functionality
    searchButton.addEventListener('click', handleSearch);
    
    // Enter key for search
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
    
    // Filter change handlers
    document.getElementById('category').addEventListener('change', applyFilters);
    document.getElementById('status').addEventListener('change', applyFilters);
    document.getElementById('sort').addEventListener('change', applyFilters);
});

// Load books from API
async function loadBooks() {
    try {
        const response = await fetch(API_BASE);
        const books = await response.json();
        renderBooks(books);
    } catch (error) {
        console.error('Error loading books:', error);
        alert('Failed to load books');
    }
}

// Handle form submission
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(bookForm);
    const bookData = {
        title: document.getElementById('title').value,
        author: document.getElementById('author').value,
        isbn: document.getElementById('isbn').value,
        category: document.getElementById('category').value,
        publicationDate: document.getElementById('publication-date').value,
        publisher: document.getElementById('publisher').value,
        description: document.getElementById('description').value,
        year: document.getElementById('publication-date').value ? 
              new Date(document.getElementById('publication-date').value).getFullYear().toString() : 'Unknown'
    };
    
    try {
        const response = await fetch(API_BASE, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bookData)
        });
        
        if (response.ok) {
            const newBook = await response.json();
            alert('Book added successfully!');
            bookForm.reset();
            loadBooks(); // Reload books to show the new addition
        } else {
            throw new Error('Failed to add book');
        }
    } catch (error) {
        console.error('Error adding book:', error);
        alert('Failed to add book');
    }
}

// Handle search
async function handleSearch() {
    const searchTerm = searchInput.value.trim();
    if (searchTerm) {
        try {
            const response = await fetch(`${API_BASE}/search/${encodeURIComponent(searchTerm)}`);
            const filteredBooks = await response.json();
            renderBooks(filteredBooks);
        } catch (error) {
            console.error('Error searching books:', error);
            alert('Failed to search books');
        }
    } else {
        loadBooks();
    }
}

// Apply filters
function applyFilters() {
    // This would combine multiple filters in a real application
    loadBooks(); // For now, just reload all books
}

// Create book card HTML
function createBookCard(book) {
    return `
        <div class="book-card" data-book-id="${book.id}">
            <div class="book-cover">
                <i class="fas fa-book"></i>
            </div>
            <div class="book-info">
                <h3 class="book-title">${book.title}</h3>
                <p class="book-author">${book.author}</p>
                <div class="book-details">
                    <span>ISBN: ${book.isbn}</span>
                    <span>${book.year}</span>
                </div>
                <span class="book-status ${book.status === 'available' ? 'status-available' : 'status-borrowed'}">
                    ${book.status === 'available' ? 'Available' : 'Borrowed'}
                </span>
                <div class="book-actions">
                    <button class="btn btn-primary edit-btn" onclick="editBook(${book.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-secondary delete-btn" onclick="deleteBook(${book.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Render books to the grid
function renderBooks(books) {
    booksGrid.innerHTML = '';
    
    books.forEach(book => {
        booksGrid.innerHTML += createBookCard(book);
    });
}

// Delete book function
async function deleteBook(bookId) {
    if (confirm('Are you sure you want to delete this book?')) {
        try {
            const response = await fetch(`${API_BASE}/${bookId}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                alert('Book deleted successfully!');
                loadBooks(); // Reload books
            } else {
                throw new Error('Failed to delete book');
            }
        } catch (error) {
            console.error('Error deleting book:', error);
            alert('Failed to delete book');
        }
    }
}

// Edit book function (placeholder - you can expand this)
async function editBook(bookId) {
    alert(`Edit functionality for book ID: ${bookId} would go here.`);
    // In a real implementation, you would:
    // 1. Fetch the book data
    // 2. Populate the form with existing data
    // 3. Change the form to update mode
    // 4. Handle the update submission
}