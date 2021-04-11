'use strict';

var STORAGE_KEY = 'todosDB';
var gFilterBy = 'all';
var gSortBy = 'date';
var gTodos;
var gImportance = 1;
var gNoTodoState = 'No Todos.';
_createTodos();

function getTodosForDisplay() {
  if (gFilterBy === 'all') return gTodos;
  var todos = gTodos.filter(function (todo) {
    return (
      (todo.isDone && gFilterBy === 'done') ||
      (!todo.isDone && gFilterBy === 'active')
    );
  });
  setNoTodoState();
  return todos;
}
function sortTodos(todos) {
  todos.sort(function (a, b) {
    if (gSortBy === 'a-z') {
      if (a.txt < b.txt) return -1;
      if (a.txt > b.txt) return 1;
      return 0;
    } else if (gSortBy === 'date') {
      if (a.createdAt < b.createdAt) return 1;
      if (a.createdAt > b.createdAt) return -1;
      return 0;
    } else if (gSortBy === 'importance') {
      if (a.importance < b.importance) return 1;
      if (a.importance > b.importance) return -1;
      return 0;
    }
  });
}

function getTotalCount() {
  return gTodos.length;
}
function getActiveCount() {
  var todos = gTodos.filter(function (todo) {
    return !todo.isDone;
  });
  return todos.length;
}

function removeTodo(todoId) {
  var idx = gTodos.findIndex(function (todo) {
    return todo.id === todoId;
  });
  gTodos.splice(idx, 1);
  _saveTodosToStorage();
}

function toggleTodo(todoId) {
  var todo = gTodos.find(function (todo) {
    return todo.id === todoId;
  });
  todo.isDone = !todo.isDone;
  _saveTodosToStorage();
}

function addTodo(txt) {
  var todo = _createTodo(txt);
  gTodos.unshift(todo);
  _saveTodosToStorage();
}

function setFilter(filterBy) {
  gFilterBy = filterBy;
}

function _makeId(length = 5) {
  var txt = '';
  var possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (var i = 0; i < length; i++) {
    txt += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return txt;
}

function _saveTodosToStorage() {
  saveToStorage(STORAGE_KEY, gTodos);
}
function _createTodos() {
  var todos = loadFromStorage(STORAGE_KEY);
  if (!todos || todos.length === 0) {
    var todos = [
      _createTodo('Study HTML'),
      _createTodo('Learn CSS'),
      _createTodo('Master Javascript'),
    ];
  }
  gTodos = todos;
  _saveTodosToStorage();
}

function _createTodo(txt) {
  var todo = {
    id: _makeId(),
    txt: txt,
    isDone: false,
    createdAt: Date.now(), //getTime(),
    importance: gImportance,
  };
  return todo;
}

// function getTime() {
//   var now = new Date();
//   var timeString = now.toString();
//   var time = timeString.slice(0, 24);
//   return time;
// }

function setImportance(level) {
  gImportance = +level;
}

function setSort(sortBy) {
  gSortBy = sortBy;
}

function setNoTodoState() {
  if (gFilterBy === 'done') gNoTodoState = 'No Done Todo';
  else if (gFilterBy === 'active') gNoTodoState = 'No Active Todo';
  else if (gFilterBy === 'all') gNoTodoState = 'No Todo';
}
