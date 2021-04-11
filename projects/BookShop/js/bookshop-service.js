'use strict';

var gBooks;
var STORAGE_KEY = 'books';
var gNextId = 100;
var PAGE_SIZE = 5;
var gPageIdx = 0;
var gSortBy = 'id';

_createBooks();

function _createBooks() {
  var books = loadFromStorage(STORAGE_KEY);
  if (!books || books.length === 0) {
    books = [
      {
        id: gNextId++,
        title: 'The Lord of the Rings',
        price: 30,
        imgUrl: 'img/lotr.jpg',
        rating: 10,
      },
      {
        id: gNextId++,
        title: 'A Series of Unfortunate Events',
        price: 30,
        imgUrl: 'img/asoue.jpg',
        rating: 8,
      },
    ];
  }
  gBooks = books;
  saveToStorage(STORAGE_KEY, gBooks);
  gNextId = 100 + gBooks.length;
}

function getBooks() {
  var startIdx = gPageIdx * PAGE_SIZE;
  var books = gBooks.slice(startIdx, startIdx + PAGE_SIZE);
  return books;
}

function addBook(title, price) {
  var newBook = {
    id: gNextId++,
    title,
    price,
    imgUrl: 'img/blank.jpg',
    rating: 5,
  };
  gBooks.push(newBook);

  saveToStorage(STORAGE_KEY, gBooks);
}

function setPage(idx) {
  gPageIdx += idx;
  return gPageIdx;
}

function getBook(id) {
  return gBooks.find(function (book) {
    return book.id === id;
  });
}

function updateBook(book, newPrice) {
  book.price = newPrice;
  saveToStorage(STORAGE_KEY, gBooks);
}

function deleteBook(bookId) {
  var idx = gBooks.findIndex(function (book) {
    return book.id === bookId;
  });
  gBooks.splice(idx, 1);
  saveToStorage(STORAGE_KEY, gBooks);
}

function updateRate(diff, book) {
  if (book.rating + diff > 10 || book.rating + diff < 0) return;
  book.rating += diff;
  saveToStorage(STORAGE_KEY, gBooks);
}

function setSortBy(sortBy) {
  gSortBy = sortBy;
}

function sortBooks() {
  gBooks.sort(function (a, b) {
    if (gSortBy === 'title') {
      if (a.title < b.title) return -1;
      if (a.title > b.title) return 1;
      return 0;
    } else if (gSortBy === 'id') {
      if (a.id < b.id) return -1;
      if (a.id > b.id) return 1;
      return 0;
    } else if (gSortBy === 'price') {
      if (a.price < b.price) return -1;
      if (a.price > b.price) return 1;
      return 0;
    }
  });
}
/*
Left to do:
1. Update button function - DONE
2. Delete button function - DONE
3. Rating function (inside modal) - DONE
4. Sorting - DONE
*/
