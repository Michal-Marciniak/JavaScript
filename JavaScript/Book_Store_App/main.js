class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn
    }
}

class Store {
    static getBooks() {
        let books;
        if(localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
    }

    static addBook(book) {
        const books = this.getBooks();

        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn) {
        let books = this.getBooks();

        books.forEach((book, index) => {
            if(book.isbn === isbn) {
                books.splice(index,1);
            }
        })

        localStorage.setItem('books', JSON.stringify(books));
    }
}

class UI {
    static displayBooks() {
        const StoredBooks = Store.getBooks();

        const books = StoredBooks;

        books.forEach(book => UI.addBookToList(book));
    }

    static addBookToList(book) {
        const list = document.getElementById("book-list");

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="btn btn-md btn-danger delete">X</a></td>
        `;   
        
        list.appendChild(row);
    }

    static clearFields() {
        document.getElementById("title").value = '';
        document.getElementById("author").value = '';
        document.getElementById("isbn").value = '';
    }

    static deleteBook(target) {
        if(target.classList.contains('delete')) {
            target.parentElement.parentElement.remove();

            UI.ShowAlert("Book deleted", "success");
        }
    }

    // Show alerts

    static ShowAlert(message, className) {
        const div = document.createElement('div');
        div.appendChild(document.createTextNode(message));
        div.className = `alert alert-${className} role-alert`;

        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');

        container.insertBefore(div, form);

        // Vanish in 3 seconds
        setTimeout(() => {
            div.remove(); //    ||  div.style.background = 'none';
        }, 3000)
    }
}

document.addEventListener('DOMContentLoaded', UI.displayBooks);

// Add a Book

document.querySelector("#book-form").addEventListener('submit', (e) => {

    e.preventDefault();

    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const isbn = document.getElementById("isbn").value;

    // Validation input fields
    if(title === '' || author === '' || isbn === '' ) {
        UI.ShowAlert('Please fill all fields', 'danger');
    } else {

        UI.ShowAlert('Book added', 'success');
        const newBook = new Book(title, author, isbn);

        UI.addBookToList(newBook);

        // Add book to local Storage
        Store.addBook(newBook);
    
        UI.clearFields();
    }
})
    
// Remove a Book

document.querySelector('#book-list').addEventListener('click', (e) => {
    UI.deleteBook(e.target);

     // Remove book from local Storage
     Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
})




