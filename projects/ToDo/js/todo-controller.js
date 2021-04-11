'use strict';

function onInit() {
  renderTodos();
}

function renderTodos() {
  var todos = getTodosForDisplay();
  sortTodos(todos);
  if (!todos.length) {
    document.querySelector('h2').innerText = gNoTodoState;
  } else document.querySelector('h2').innerText = 'Todos';
  var strHTMLs = todos.map(function (todo) {
    var className = todo.isDone ? 'done' : '';
    return `  
        <li class="${className}" onclick="onToggleTodo('${todo.id}')">
            ${todo.txt}.            Level: ${todo.importance}
            <button class="btn-remove" onclick="onRemoveTodo(event, '${todo.id}')">x</button>
        </li>`;
  });
  // console.log('strHTMLs', strHTMLs);
  var elTodoList = document.querySelector('.todo-list ul');
  elTodoList.innerHTML = strHTMLs.join('');

  document.querySelector('.stat-total').innerText = getTotalCount();
  document.querySelector('.stat-active').innerText = getActiveCount();
}

function onRemoveTodo(ev, todoId) {
  ev.stopPropagation();
  if (window.confirm('Are you sure you want to delete this Todo?')) {
    console.log('Removing', todoId);
    removeTodo(todoId);
    renderTodos();
  }
}

function onToggleTodo(todoId) {
  toggleTodo(todoId);
  renderTodos();
}

function onAddTodo() {
  var elTxt = document.querySelector('input[name=newTodoTxt]');
  var txt = elTxt.value;
  if (!txt) return;
  addTodo(txt);
  elTxt.value = '';
  renderTodos();
}

function onSetFilter(filterBy) {
  setFilter(filterBy);
  console.log('Filtering', filterBy);
  renderTodos();
}

function onSetSort(sortBy) {
  setSort(sortBy);
  console.log('Sorting'.sortBy);
  renderTodos();
}
