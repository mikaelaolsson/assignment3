// All HTML-Elements we need to reach in our JavaScript
let todolist = document.querySelector(".todolist");
let textbox = document.querySelector(".new-todo");
let template = document.querySelector("template");

let toggleAllArrow = document.querySelector(".arrow");
let toggleAll = document.querySelector("#all-toggle");

let footer = document.querySelector(".footer");
let count = document.querySelector("strong");
let itemsLeft = document.querySelector(".count");

let filterAll = document.querySelector("#all");
let filterActive = document.querySelector("#active");
let filterCompleted = document.querySelector("#completed");

let clearCompleted = document.querySelector(".clear-completed");

// Lists for storing the todos; one for the completed todos and one for them all, regardless of status of completion
let list = [];
let completedList = [];

// This list relates to localStorage
let todos = [];

//This function runs when you load the page and if there is data in localStorage, it loads it to the page through the addTodo-function
function load() {
    if (localStorage.length > 0) {
        getLocalStorage();

        todos.forEach(todo => {
            let saved = true;
            addTodo(todo.title, todo.completed, saved);
        });
        updateGUI();
    }
}

load();

// This event checks the location.hash upon load and if the hash is either #/active or #/completed, rearranges the page accordingly
window.onload = event => {
    if (location.hash === "#/active") {
        filterActive.classList.add("selected");
        removeAllChildren(todolist);
        list.forEach(item => {
            if (!item.classList.contains("completed")) {
                todolist.append(item);
            }
        });
    
        filterAll.classList.remove("selected");
        filterCompleted.classList.remove("selected");
    }
    else if (location.hash === "#/completed") {
        filterCompleted.classList.add("selected");
        removeAllChildren(todolist);
        list.forEach(item => {
            if (item.classList.contains("completed")) {
                todolist.append(item);
            }
        })

        filterAll.classList.remove("selected");
        filterActive.classList.remove("selected");
    }
}

// Lets the user add a todo through the use of the addTodo-function
textbox.addEventListener("keydown", function(e) {
    if (e.code === "Enter" && textbox.value !== "" && !(/^\s+$/.test(textbox.value))) {
        let saved = false;
        let text = (textbox.value).trim();
        addTodo(text, false, saved);

        textbox.value = "";
        updateGUI();
    }
});

// This event let's you toggle all todos regardless of the location.hash
toggleAll.onchange = event => {
    let checkboxes = document.querySelectorAll(".toggle");
    let listItems = document.querySelectorAll(".task"); 

    if (toggleAll.checked) {
        checkboxes.forEach(box => {
            box.checked = true;
        });
        listItems.forEach(item => {
            if (!item.parentNode.classList.contains("completed")) {
                item.parentNode.classList.add("completed");
                completedList.push(item);
            }
        });
        for (let i = 0; i < todos.length; i ++) {
            todos[i].completed = true;
        }
        setLocalStorage(todos);
    }
    else {
        checkboxes.forEach(box => {
            box.checked = false;
        });
        listItems.forEach(item => {
            if (item.parentNode.classList.contains("completed")) {
                item.parentNode.classList.remove("completed");
                let index = completedList.indexOf(item);
                completedList.splice(index, 1);
            }
        });
        for (let i = 0; i < todos.length; i ++) {
            todos[i].completed = false;
        }
        setLocalStorage(todos);
    }
    if (location.hash === "#/active" || location.hash === "#/completed") {
        location.reload();
    }
    updateGUI();

}

// This event removes all completed todos regardless of the location.hash
clearCompleted.onclick = event => {
    let completed = document.querySelectorAll(".completed");
    completedList.length = 0;

    if (location.hash === "#/active") {
        let newList = list.filter(todo => (!todo.classList.contains("completed")));
        list = newList;

        let newTodos = todos.filter(function (e) {
            return e.completed === false;
        });
        todos = newTodos;
    }
    else { 
        completed.forEach(task => {
        task.remove();
        let index = list.indexOf(task);
        list.splice(index, 1);
        todos.splice(index, 1);
        });
    }

    setLocalStorage(todos);
    updateGUI();
}

// This event checks for the location.hash on a change of the hash and rearranges the page accordingly for each hash
window.onhashchange = event => {
    if (location.hash === "#/active") {
        filterActive.classList.add("selected");
        removeAllChildren(todolist);
        list.forEach(item => {
            if (!item.classList.contains("completed")) {
                todolist.append(item);
            }
        });
    
        filterAll.classList.remove("selected");
        filterCompleted.classList.remove("selected");
    }
    else if (location.hash === "#/completed") {
        filterCompleted.classList.add("selected");
        removeAllChildren(todolist);
        list.forEach(item => {
            if (item.classList.contains("completed")) {
                todolist.append(item);
            }
        })

        filterAll.classList.remove("selected");
        filterActive.classList.remove("selected");
    }
    else {
        filterAll.classList.add("selected");

        list.forEach(item => {
            todolist.append(item);
        });
    
        filterActive.classList.remove("selected");
        filterCompleted.classList.remove("selected");
    }
}

// Adds a new todo to the page
function addTodo(newTodo, completed, saved) {
    let listItem = template.content.firstElementChild.cloneNode(true);
    listItem.querySelector(".entry").textContent = newTodo;

    let deleteButton = listItem.querySelector(".delete");
    deleteButton.onclick = event => {

        let index = list.indexOf(listItem);
        list.splice(index, 1);

        todos.splice(index, 1);
        setLocalStorage(todos);

        if (listItem.classList.contains("completed")) {
            let index = completedList.indexOf(listItem);
            completedList.splice(index, 1);
        }
        listItem.remove();

        updateGUI();
    }

    let checkbox = listItem.querySelector(".toggle");
    if (completed === true) {
        checkbox.checked = true;
        listItem.classList.add("completed");
        completedList.push(listItem);
    }

    checkbox.onchange = event => {
        if (checkbox.checked) {
            listItem.classList.add("completed");
            completedList.push(listItem);

            let index = list.indexOf(listItem);
            todos[index].completed = true;
            setLocalStorage(todos);

            if (location.hash === "#/active") { 
                listItem.remove();
            }
        }
        else {
            if (listItem.classList.contains("completed")) {
                listItem.classList.remove("completed");
                let index = completedList.indexOf(listItem);
                completedList.splice(index, 1);

                let i = list.indexOf(listItem);
                todos[i].completed = false;
                setLocalStorage(todos);

                if (location.hash === "#/completed") { 
                    listItem.remove();
                }
            }   
        }
        updateGUI();
    }

    let edit = listItem.querySelector(".edit");
    let item = listItem.querySelector(".list-item");
    let entry = listItem.querySelector(".entry");

    listItem.ondblclick = event => {
        item.style.display = "none";
        edit.style.display = "grid";
        edit.focus();

        edit.value = entry.textContent;
    }

    listItem.addEventListener("keyup", function(ev) {
        if (item.style.display === "none") {
            if (ev.code === "Enter" && edit.value !== "" && !(/^\s+$/.test(edit.value))) {
                edit.style.display = "none";
                item.style.display = "grid";
                entry.textContent = edit.value; 

                let index = list.indexOf(listItem);
                todos[index].title = entry.textContent;
                setLocalStorage(todos);
            }
                            
            else if (ev.code === "Enter" && (edit.value === "" || (/^\s+$/.test(edit.value)))) {
                ev.preventDefault();
                // This event used to trigger an error.. but we found a workaround :)
                if (list.includes(listItem)) {
                    let index = list.indexOf(listItem);
                    list.splice(index, 1);
                    
                    todos.splice(index, 1);
                    setLocalStorage(todos);
                    listItem.remove();
                }

                if (listItem.classList.contains("completed")) {
                    let index = completedList.indexOf(listItem);
                    completedList.splice(index, 1);
                }
            } 
            updateGUI();
        }
    });

    edit.addEventListener("focusout", function(ev) {
        if (item.style.display === "none") {
            const keyboardEvent = new KeyboardEvent('keyup', {
                code: 'Enter',
                key: 'Enter',
                charCode: 13,
                keyCode: 13,
                view: window,
                bubbles: true
            });
            listItem.dispatchEvent(keyboardEvent);
        }
    });

    if (location.hash !== "#/completed") { 
        todolist.append(listItem);
    }

    list.push(listItem);

    if (!saved) {
        let todo = {
            title: entry.textContent,
            completed: checkbox.checked,
        }
        todos.push(todo);

        setLocalStorage(todos);
    }
}

// Updates various small parts of the GUI
function updateGUI() {
    if (list.length === 0) {
        footer.style.display = "none";
        toggleAllArrow.style.display = "none";  
    }
    else {
        footer.style.display = "grid";
        toggleAllArrow.style.display = "block";
    }
    if (completedList.length > 0) {
        clearCompleted.style.display = "grid";
    }
    else {
        clearCompleted.style.display = "none";
    }

    count.textContent = (list.length - completedList.length);
    if ((list.length - completedList.length) === 1) {
        itemsLeft.textContent = "item left";
    }
    else {
        itemsLeft.textContent = "items left";
    }

    if (list.length === completedList.length) {
        toggleAll.checked = true;
    }
    else {
        toggleAll.checked = false;
    }
}
// Retrieves the data from localStorage 
function getLocalStorage() {
    let todoSerialized = localStorage.getItem("todo");
    todos = JSON.parse(todoSerialized);
}
// Saves the data to localStorage
function setLocalStorage(todos) {
    let todoSerialized = JSON.stringify(todos);
    localStorage.setItem("todo", todoSerialized);
}
// This function removes all children from an element
function removeAllChildren(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}