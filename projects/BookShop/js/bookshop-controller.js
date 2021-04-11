'use strict';

function init() {
  renderBooks();
}

function renderBooks() {
  var books = getBooks();
  var strHTML = books.map(function (book) {
    return `
        <tr>
            <td>${book.id}</td>
            <td>${book.title}</td>
            <td>${book.price}</td>
            <td class="actions">
             <button class="read" onclick="onReadBook(${book.id})">Read</button>
             <button class="update" onclick="onUpdateBook(${book.id})">Update</button>
             <button class="delete" onclick="onDeleteBook(${book.id})">Delete</button>
            </td>
        <tr>`;
  });
  var elTbody = document.querySelector('tbody');
  elTbody.innerHTML = strHTML.join('');
}

function onAddBook(ev) {
  ev.stopPropagation();
  var elTitle = document.querySelector('input[name=title]');
  var elPrice = document.querySelector('input[name=price]');
  if (elTitle.value && elPrice.value) addBook(elTitle.value, +elPrice.value);
  elTitle.value = '';
  elPrice.value = '';
  renderBooks();
}

function onReadBook(bookId) {
  var book = getBook(bookId);
  renderModal(book);
}

function onSetPage(idx) {
  var newIdx = setPage(idx);
  renderBooks();
  document.querySelector('.current-page').innerHTML = newIdx;
}

function renderModal(book) {
  var strHTML = `
      <h4>Book Name: <span>${book.title}</span></h4>
      <h4>Book Price: <span>${book.price}</span></h4>
      <h4 class="rate">Book Rate:
          <button class="rate-btn" onclick="onUpdateRate(-1, ${book.id})">-</button>
          <span>${book.rating}</span>
          <button class="rate-btn" onclick="onUpdateRate(1, ${book.id})">+</button>
      </h4>
      <h4>Book Summary:
          <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit.
          Exercitationem perspiciatis illo odio reiciendis molestiae eveniet aliquam debitis, dolorum architecto?
          Ad, repudiandae sed ipsa dolorum tenetur a quidem molestias ab aperiam.</p>
      </h4>
      <img src="${book.imgUrl}">
      <button class="close" onclick="onCloseModal()">Close</button>`;

  var elModal = document.querySelector('.modal');
  elModal.innerHTML = strHTML;
  elModal.style.display = 'flex';
}

function onCloseModal() {
  var elModal = document.querySelector('.modal');
  elModal.style.display = 'none';
}

function onUpdateBook(bookId) {
  var newPrice = +prompt("What's the new price?");
  var book = getBook(bookId);
  updateBook(book, newPrice);
  renderBooks();
}

function onDeleteBook(bookId) {
  deleteBook(bookId);
  renderBooks();
}

function onUpdateRate(diff, bookId) {
  var book = getBook(bookId);
  updateRate(diff, book);
  onReadBook(bookId);
}

function onSortBooks(sortBy) {
  setSortBy(sortBy);
  sortBooks();
  renderBooks();
}
