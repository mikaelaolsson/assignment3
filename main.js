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

// detta är en counter som ska bort lol
//let butt = 0;

textbox.addEventListener("keydown", function(e) {
    if (e.code === "Enter" && textbox.value !== "" && !(/^\s+$/.test(textbox.value))) {
        let listItem = template.content.firstElementChild.cloneNode(true);

        let text = (textbox.value).trim();
        listItem.querySelector(".entry").textContent = text;

        let deleteButton = listItem.querySelector(".delete");
        deleteButton.onclick = event => {

            let index = list.indexOf(listItem);
            list.splice(index, 1);

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

                if (location.hash === "#/active") { // funkar denna för att listItem är ett DOM objekt???
                    listItem.remove();
                }
            }
            else {
                if (listItem.classList.contains("completed")) {
                    listItem.classList.remove("completed");
                    let index = completedList.indexOf(listItem);
                    completedList.splice(index, 1);

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

        listItem.addEventListener("keydown", function(ev) {
            if (item.style.display === "none") {
                if (ev.code === "Enter" && edit.value !== "" && !(/^\s+$/.test(edit.value))) {
                    edit.style.display = "none";
                    item.style.display = "grid";
                    entry.textContent = edit.value; 
                }
                /// Denna del funkar ej :((((              
                // else if (ev.code === "Enter" && (edit.value === "" || /^\s+$/.test(edit.value))) {
                //     ev.preventDefault();
                //     if (list.includes(listItem)) {
                //         let index = list.indexOf(listItem);
                //         list.splice(index, 1);
                //     }

                //     if (listItem.classList.contains("completed")) {
                //         let index = completedList.indexOf(listItem);
                //         completedList.splice(index, 1);
                //     }

                //     if (todolist.contains(listItem)) {
                //         butt++;
                //         console.log(butt);
                //         listItem.remove();

                //     }
                // }
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
                const keyboardEvent = new KeyboardEvent('keydown', {
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
 
        if (location.hash !== "#/completed") { // funkar pga DOM objekt???
            todolist.append(listItem);
        }

        list.push(listItem);
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
    // om man inte står på #/ så kan nodelist bli noll

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
        clearCompleted.style.display ="none";
    }
    count.textContent = (list.length - completedList.length);
}

clearCompleted.onclick = event => {
    // om man står på #/active när man trycker på knappen så funkar det ej!
    let completed = document.querySelectorAll(".completed");
    completedList.length = 0;

    completed.forEach(task => {
        task.remove();
        let index = list.indexOf(task);
        list.splice(index, 1);
    });

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