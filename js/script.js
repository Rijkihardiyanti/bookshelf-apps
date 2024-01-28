document.addEventListener('DOMContentLoaded', function() {
  const inputForm = document.getElementById('inputBook');
  const searchForm = document.getElementById('searchBook');
  const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
  const completeBookshelfList = document.getElementById('completeBookshelfList');

  loadBooksFromStorage();

  inputForm.addEventListener('submit', function(event) {
    event.preventDefault();
    addBook();
  });

  searchForm.addEventListener('submit', function(event) {
    event.preventDefault();
    searchBook();
  });
  if (isStorageExist()) {
    loadBooksFromStorage();
  }
  function isStorageExist() /* boolean */ {
    if (typeof (Storage) === undefined) {
      alert('Browser kamu tidak mendukung local storage');
      return false;
    }
    return true;
  }

  function createBook(id, title, author, year, isComplete) {
    const bookContainer = document.createElement('article');
    bookContainer.className = 'book_item';
    bookContainer.setAttribute('data-id', id);
    
    const titleElement = document.createElement('h3');
    titleElement.textContent = title;

    const authorElement = document.createElement('p');
    authorElement.textContent = 'Penulis: ' + author;

    const yearElement = document.createElement('p');
    yearElement.textContent = 'Tahun: ' + year;

    const actionContainer = document.createElement('div');
    actionContainer.className = 'action';

    const toggleButton = document.createElement('button');
    toggleButton.className = isComplete ? 'green' : 'red';
    toggleButton.textContent = isComplete ? 'Belum selesai di Baca' : 'Selesai dibaca';
    toggleButton.addEventListener('click', function() {
      toggleBookStatus(bookContainer, isComplete);
      
    });

    const deleteButton = document.createElement('button');
    deleteButton.className = 'red';
    deleteButton.textContent = 'Hapus buku';
    deleteButton.addEventListener('click', function() {
      deleteBook(bookContainer);
    });

    actionContainer.appendChild(toggleButton);
    actionContainer.appendChild(deleteButton);

    bookContainer.appendChild(titleElement);
    bookContainer.appendChild(authorElement);
    bookContainer.appendChild(yearElement);
    bookContainer.appendChild(actionContainer);

    return bookContainer;
  }

  function addBook() {
    const titleInput = document.getElementById('inputBookTitle');
    const authorInput = document.getElementById('inputBookAuthor');
    const yearInput = document.getElementById('inputBookYear');
    const isCompleteCheckbox = document.getElementById('inputBookIsComplete');
    
    const id = generateId();
    const title = titleInput.value;
    const author = authorInput.value;
    const year = yearInput.value;
    const isComplete = isCompleteCheckbox.checked;

    const bookContainer = createBook(id, title, author, year, isComplete);

    if (isComplete) {
      completeBookshelfList.appendChild(bookContainer);
    } else {
      incompleteBookshelfList.appendChild(bookContainer);
    }

    titleInput.value = '';
    authorInput.value = '';
    yearInput.value = '';
    isCompleteCheckbox.checked = false;
    saveBooksToStorage();
  }

  function generateId() {
    return +new Date();
  }
   
  function searchBook() {
    const searchTitleInput = document.getElementById('searchBookTitle');
    const searchTitle = searchTitleInput.value.toLowerCase();

    const allBooks = document.querySelectorAll('.book_item');
    allBooks.forEach(function(book) {
      const title = book.querySelector('h3').textContent.toLowerCase();
      const isMatch = title.includes(searchTitle);

      if (isMatch) {
        book.style.display = 'block';
      } else {
        book.style.display = 'none';
      }
    });

    searchTitleInput.value = '';
  }

  function toggleBookStatus(bookContainer, isComplete) {
    const toggleButton = bookContainer.querySelector('button');
    const status = isComplete ? 'Belum selesai di Baca' : 'Selesai dibaca';

    toggleButton.textContent = status;
    toggleButton.className = isComplete ? 'red' : 'green';

    if (isComplete) {
      incompleteBookshelfList.appendChild(bookContainer);
    } else {
      completeBookshelfList.appendChild(bookContainer);
    }
    saveBooksToStorage();
  }

  function deleteBook(bookContainer) {
    bookContainer.remove();
    saveBooksToStorage();
  }
  function saveBooksToStorage() {
    const allBooks = getAllBooks();
    localStorage.setItem('booksData', JSON.stringify(allBooks));
  }

  function loadBooksFromStorage() {
  
    const storedBooks = localStorage.getItem('booksData');

    if (storedBooks) {
      const books = JSON.parse(storedBooks);

      books.forEach(function(book) {
        const bookContainer = createBook(book.id, book.title, book.author, book.year, book.isComplete);

        if (book.isComplete) {
          completeBookshelfList.appendChild(bookContainer);
        } else {
          incompleteBookshelfList.appendChild(bookContainer);
        }
      });
    }
  }
  
  function getAllBooks() {
    const allBooks = [];
    const bookContainers = document.querySelectorAll('.book_item');

    bookContainers.forEach(function(bookContainer) {
      const title = bookContainer.querySelector('h3').textContent;
      const author = bookContainer.querySelector('p:nth-child(2)').textContent.replace('Penulis: ', '');
      const year = bookContainer.querySelector('p:nth-child(3)').textContent.replace('Tahun: ', '');
      const isComplete = bookContainer.querySelector('button').textContent === 'Belum selesai di Baca';
      const id = +bookContainer.getAttribute('data-id');
      
      allBooks.push({id, title, author, year, isComplete });
    });

    return allBooks;
  }
});
