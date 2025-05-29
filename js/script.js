/*
let $ = document
const inputElem = $.querySelector('input')
const todosContainer = $.querySelector('ul')

const trim = val => val.trim()

const toLowerCase = val => val.toLowerCase()

const insertInListItem = (todoValue) => {
    let newTodoLiElem = $.createElement('li')
    newTodoLiElem.className = 'item-list'

    let newTodoSpan = $.createElement('span')
    newTodoSpan.innerHTML = todoValue

    let newTodoTrashIcon = $.createElement('i')
    newTodoTrashIcon.className = 'fa fa-trash-o delete trashBin'

    newTodoLiElem.append(newTodoSpan, newTodoTrashIcon)

    return newTodoLiElem
}

inputElem.addEventListener('keypress', (event) => {
    if (event.keyCode === 13) {
        let newTodoValue = event.target.value

        let newTodoLI = insertInListItem(toLowerCase(trim(newTodoValue)))

        todosContainer.appendChild(newTodoLI)

        inputElem.value = ''
    }

})*/
const Toast = Swal.mixin({
    showClass: {
        popup: `
                      animate__animated
                      animate__fadeInDown
                      animate__faster
                    `
    },
    hideClass: {
        popup: `
                      animate__animated
                      animate__fadeOutRight
                      animate__faster
                    `
    },
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
    }
});
const wrapperList = document.querySelector('#all-list')
const todoInput = document.querySelector('#todo-input')
let todoArray = []
function resetInput(){
    todoInput.value = ''
    todoInput.focus()
}
function showErrorMessage(text){
    swal.fire({
        title: 'Error!',
        text: text,
        icon: 'error'
    })
}
function setLocalStorage(array){
    localStorage.setItem('localTodos', JSON.stringify(array));
}
function inputTrim(value){
    return value.trim()
}
function isExistInTodoArray(value){
    return  todoArray.some(item => {
        return item === value
    })
}
function findIndexTodo(value){
    return  todoArray.findIndex(item => {
        return item === value
    })
}
function removeTodoFunc(tag){
    let todo = tag.parentElement.firstElementChild.textContent
    Swal.fire({
        title: `Are you sure delete ${todo}?`,
        text: "You won't be able to undo this action!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel'
    }).then(result=> {
        if (result.isConfirmed) {
            Toast.fire({
                title: `you delete ${todo} from list`,
                icon: 'success'
            }).then(()=> {
                let index = findIndexTodo(todo)
                todoArray.splice(index, 1);
                setLocalStorage(todoArray)
                tag.parentElement.remove()
            })

        }

    })

}
function addToHtml(value){
    let newLi = document.createElement('li')
    newLi.className = 'item-list'
    newLi.innerHTML = `
        <span>${value}</span>
        <i class="fa fa-trash-o delete trashBin" onclick="removeTodoFunc(this)"></i>
    `
    wrapperList.appendChild(newLi)
}
todoInput.addEventListener('keyup', event => {
    if (event.keyCode === 13){
        let todoInputValue = inputTrim(todoInput.value)
        if (todoInputValue){
            todoInputValue = todoInputValue.toLowerCase()
            let flag = isExistInTodoArray(todoInputValue)
            if (!flag){
                Toast.fire({
                    title: 'add to list',
                    icon: 'success'
                })
                .then(()=> {
                    todoArray.push(todoInputValue)
                    addToHtml(todoInputValue)
                    setLocalStorage(todoArray)
                    resetInput()
                })
            }else {
                showErrorMessage('Is Exist Item Now')
            }
        }else {
            showErrorMessage('Input is Empty')
        }
    }
})
window.onload = function (){
    resetInput()
    let parseTodos = JSON.parse(localStorage.getItem('localTodos'));
    if (parseTodos != null){
        parseTodos.forEach(item => {
            addToHtml(item)
            todoArray.push(item)
        })
    }
}
