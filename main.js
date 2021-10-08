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

textbox.addEventListener("keydown", function(e) {
    if (e.code === "Enter" && textbox.value !== "") {
        let listItem = template.content.firstElementChild.cloneNode(true);

        let text = textbox.value;
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
            }
            else {
                if (listItem.classList.contains("completed")) {
                    listItem.classList.remove("completed");
                    let index = completedList.indexOf(listItem);
                    completedList.splice(index, 1);
                }   
            }

            if (completedList.length > 0) {
                clearCompleted.style.display = "grid";
            }
            else {
                clearCompleted.style.display = "none";
            }
            
            count.textContent = (list.length - completedList.length);
        }

        listItem.ondblclick = event => {
            let item = listItem.querySelector(".list-item");
            item.style.display = "none";

            let edit = listItem.querySelector(".edit");
            edit.style.display = "grid";
            edit.focus();


            let entry = listItem.querySelector(".entry");
            edit.value = entry.textContent;
            
            edit.addEventListener('focusout', (event) => {
                if (edit.value !== "") {
                    edit.style.display = "none";
                    item.style.display = "grid";
                    entry.textContent = edit.value; 
                }

                // Denna kod göra hella mycket konstigt, watch out!!!!!!!!
                
                // else if (edit.value === "") {
                //     let index = list.indexOf(listItem);
                //     list.splice(index, 1);

                //     if (listItem.classList.contains("completed")) {
                //         let index = completedList.indexOf(listItem);
                //         completedList.splice(index, 1);
                //     }

                //     listItem.remove();
                // }

                count.textContent = (list.length - completedList.length);

                if (list.length === 0) {
                    footer.style.display = "none";
                    toggleAllArrow.style.display = "none";
                }
                if (completedList.length === 0) {
                    clearCompleted.style.display = "none";
                }
            });
            

            // hanterar ej om man sätter in en tom sträng!!!!!!!!
            edit.addEventListener("keydown", function(ev) {
                if (ev.code === "Enter") {
                    edit.blur();
                }
            })
        }

        todolist.append(listItem);
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
})

toggleAll.onchange = event => {
    let checkboxes = document.querySelectorAll(".toggle");
    let listItems = document.querySelectorAll(".list-item");

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

filterAll.onclick = event => {
    removeAllChildren(todolist);
    filterAll.classList.add("selected");

    list.forEach(item => {
        todolist.append(item);
    });

    filterActive.classList.remove("selected");
    filterCompleted.classList.remove("selected");
}

filterActive.onclick = event => {
    removeAllChildren(todolist);
    filterActive.classList.add("selected");

    list.forEach(item => {
        if (!item.classList.contains("completed")) {
            todolist.append(item);
        }
    });

    filterAll.classList.remove("selected");
    filterCompleted.classList.remove("selected");
}

filterCompleted.onclick = event => {
    removeAllChildren(todolist);
    filterCompleted.classList.add("selected");

    completedList.forEach(item => {
        todolist.append(item);
    })

    filterAll.classList.remove("selected");
    filterActive.classList.remove("selected");
}

function removeAllChildren(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}