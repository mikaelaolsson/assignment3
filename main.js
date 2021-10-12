let todolist = document.querySelector(".todolist");
let textbox = document.querySelector(".new-todo");

let toggleAllArrow = document.querySelector(".arrow");
let toggleAll = document.querySelector("#all-toggle");

let footer = document.querySelector(".footer");

let template = document.querySelector("template");
let count = document.querySelector("strong");
let clearCompleted = document.querySelector(".clear-completed");

let filterAll = document.querySelector("#all");
let filterActive = document.querySelector("#active");
let filterCompleted = document.querySelector("#completed");

let list = [];
let completedList = [];
let todos = [];

//localStorage.clear();


function load() {
    if (localStorage.length > 0) {
        let todoSerialized = localStorage.getItem("todo");
        todos = JSON.parse(todoSerialized);

        todos.forEach(todo => {
            let listItem = template.content.firstElementChild.cloneNode(true);
            let text = todo.title;
            listItem.querySelector(".entry").textContent = text;
            
            let deleteButton = listItem.querySelector(".delete");
            deleteButton.onclick = event => {
    
                let index = list.indexOf(listItem);
                list.splice(index, 1);
    
                todos.splice(index, 1);
                let todoSerialized = JSON.stringify(todos);
                localStorage.setItem("todo", todoSerialized);
    
                if (listItem.classList.contains("completed")) {
                    let index = completedList.indexOf(listItem);
                    completedList.splice(index, 1);
                }
                listItem.remove();
    
                if (list.length === 0) {
                    footer.style.display = "none";
                    toggleAllArrow.style.display = "none";  
                }
                if (completedList.length > 0) {
                    clearCompleted.style.display = "grid";
                }
                else {
                    clearCompleted.style.display = "none";
                }
                count.textContent = (list.length - completedList.length);
            }

            let checkbox = listItem.querySelector(".toggle");
            if (todo.completed === true) {
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
                    let todoSerialized = JSON.stringify(todos);
                    localStorage.setItem("todo", todoSerialized);
    
                    if (location.hash === "#/active") { // funkar denna för att listItem är ett DOM objekt???
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
                        let todoSerialized = JSON.stringify(todos);
                        localStorage.setItem("todo", todoSerialized);
    
    
                        if (location.hash === "#/completed") { // samma som ovan
                            listItem.remove();
                        }
                    }   
                }
    
                if (completedList.length > 0) {
                    clearCompleted.style.display = "grid";
                }
                else {
                    clearCompleted.style.display = "none";
                }
    
                if (list.length === completedList.length) {
                    toggleAll.checked = true;
                }
                else {
                    toggleAll.checked = false;
                }
                
                count.textContent = (list.length - completedList.length);
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
                    if (ev.key === "Enter" && edit.value !== "" && !(/^\s+$/.test(edit.value))) {
                        edit.style.display = "none";
                        item.style.display = "grid";
                        entry.textContent = edit.value; 
                    }
                                 
                    else if (ev.key === "Enter" && (edit.value === "" || (/^\s+$/.test(edit.value)))) {
                        ev.preventDefault();
    
                        if (list.includes(listItem)) {
                            let index = list.indexOf(listItem);
                            list.splice(index, 1);
                        }
    
                        if (listItem.classList.contains("completed")) {
                            let index = completedList.indexOf(listItem);
                            completedList.splice(index, 1);
                        }
    
                        if (todolist.contains(listItem)) {
                            listItem.remove();
                        }
                    } 
                    count.textContent = (list.length - completedList.length);
    
                    if (list.length === 0) {
                        footer.style.display = "none";
                        toggleAllArrow.style.display = "none";
                    }
                }
            });
    
            edit.addEventListener("focusout", function(ev) {
                if (item.style.display === "none") {
                    const keyboardEvent = new KeyboardEvent('keyup', {
                        key: 'Enter'
                    });
                    listItem.dispatchEvent(keyboardEvent);
                }
            });

            list.push(listItem);
            todolist.append(listItem);
        });
        
        if (list.length === completedList.length) {
            toggleAll.checked = true;
        }
        else {
            toggleAll.checked = false;
        }

        if (list.length !== 0) {
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
    }
}

load();

window.onload = event => {
    console.log(location.hash);
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

textbox.addEventListener("keydown", function(e) {
    if (e.code === "Enter" && textbox.value !== "" && !(/^\s+$/.test(textbox.value))) {
        let listItem = template.content.firstElementChild.cloneNode(true);

        let text = (textbox.value).trim();
        listItem.querySelector(".entry").textContent = text;

        let deleteButton = listItem.querySelector(".delete");
        deleteButton.onclick = event => {

            let index = list.indexOf(listItem);
            list.splice(index, 1);

            todos.splice(index, 1);
            let todoSerialized = JSON.stringify(todos);
            localStorage.setItem("todo", todoSerialized);

            if (listItem.classList.contains("completed")) {
                let index = completedList.indexOf(listItem);
                completedList.splice(index, 1);
            }
            listItem.remove();

            if (list.length === 0) {
                footer.style.display = "none";
                toggleAllArrow.style.display = "none";  
            }
            if (completedList.length > 0) {
                clearCompleted.style.display = "grid";
            }
            else {
                clearCompleted.style.display = "none";
            }
            count.textContent = (list.length - completedList.length);
        }

        let checkbox = listItem.querySelector(".toggle");
        checkbox.onchange = event => {
            if (checkbox.checked) {
                listItem.classList.add("completed");
                completedList.push(listItem);

                let index = list.indexOf(listItem);
                todos[index].completed = true;
                let todoSerialized = JSON.stringify(todos);
                localStorage.setItem("todo", todoSerialized);

                if (location.hash === "#/active") { // funkar denna för att listItem är ett DOM objekt???
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
                    let todoSerialized = JSON.stringify(todos);
                    localStorage.setItem("todo", todoSerialized);


                    if (location.hash === "#/completed") { // samma som ovan
                        listItem.remove();
                    }
                }   
            }

            if (completedList.length > 0) {
                clearCompleted.style.display = "grid";
            }
            else {
                clearCompleted.style.display = "none";
            }

            if (list.length === completedList.length) {
                toggleAll.checked = true;
            }
            else {
                toggleAll.checked = false;
            }
            
            count.textContent = (list.length - completedList.length);
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
                if (ev.key === "Enter" && edit.value !== "" && !(/^\s+$/.test(edit.value))) {
                    edit.style.display = "none";
                    item.style.display = "grid";
                    entry.textContent = edit.value; 
                }
                             
                else if (ev.key === "Enter" && (edit.value === "" || (/^\s+$/.test(edit.value)))) {
                    ev.preventDefault();

                    if (list.includes(listItem)) {
                        let index = list.indexOf(listItem);
                        list.splice(index, 1);
                    }

                    if (listItem.classList.contains("completed")) {
                        let index = completedList.indexOf(listItem);
                        completedList.splice(index, 1);
                    }

                    if (todolist.contains(listItem)) {
                        listItem.remove();
                    }
                } 
                count.textContent = (list.length - completedList.length);

                if (list.length === 0) {
                    footer.style.display = "none";
                    toggleAllArrow.style.display = "none";
                }
                if (completedList.length === 0) {
                    clearCompleted.style.display = "none";
                }
            }
        });

        edit.addEventListener("focusout", function(ev) {
            if (item.style.display === "none") {
                const keyboardEvent = new KeyboardEvent('keyup', {
                    key: 'Enter'
                });
                listItem.dispatchEvent(keyboardEvent);
            }
        });
 
        if (location.hash !== "#/completed") { 
            todolist.append(listItem); // funkar pga DOM objekt???
        }

        list.push(listItem);

        let todo = {
            title: entry.textContent,
            completed: checkbox.checked,
        }
        todos.push(todo);
        console.log(todos);

        let todosSerialized = JSON.stringify(todos);
        localStorage.setItem("todo", todosSerialized);
        console.log(localStorage); //////////////////////////////////////////////////7777 console.log :)

        textbox.value = "";

        if (list.length === completedList.length) {
            toggleAll.checked = true;
        }
        else {
            toggleAll.checked = false;
        }

        if (list.length !== 0) {
            footer.style.display = "grid";
            toggleAllArrow.style.display = "block";
        }
        count.textContent = (list.length - completedList.length);
    }
});

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
        let todoSerialized = JSON.stringify(todos);
        localStorage.setItem("todo", todoSerialized);

        clearCompleted.style.display ="grid";
    }
    else {
        checkboxes.forEach(box => {
            box.checked = false;
        })
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
        let todoSerialized = JSON.stringify(todos);
        localStorage.setItem("todo", todoSerialized);
        clearCompleted.style.display ="none";
    }
    if (location.hash === "#/active" || location.hash === "#/completed") {
        location.reload();
    }
    count.textContent = (list.length - completedList.length);
}

clearCompleted.onclick = event => {
    // Den här tar bara varannan av någon anledning :((((((
    completedList.length = 0;
    
    // tar bort från GUI:t obs completed blir tom om den står på #/active pga då visas inga completed tasks
    let completed = document.querySelectorAll(".completed");
    completed.forEach(task => {
        task.remove();
    });

    // tar bort från the list
    list.forEach(item => {
        if (item.classList.contains("completed")) {
            let index = list.indexOf(item);
            list.splice(index, 1);
            todos.splice(index, 1);
        }
    });

    let todoSerialized = JSON.stringify(todos);
    localStorage.setItem("todo", todoSerialized);

    clearCompleted.style.display = "none";

    if (list.length === 0) {
        footer.style.display = "none";
        toggleAllArrow.style.display = "none";
    }

}

// vet ej om detta är rätt alls????????????
window.onhashchange = event => {
    if (location.hash === "" || location.hash === "#/") {
        filterAll.classList.add("selected");

        list.forEach(item => {
            todolist.append(item);
        });
    
        filterActive.classList.remove("selected");
        filterCompleted.classList.remove("selected");
    }
    else if (location.hash === "#/active") {
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

function removeAllChildren(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}