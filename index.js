$(document).ready(function() { 

    const createTodoItem = (arr) => {
        arr = JSON.parse(arr);
        arr.map(item => {
            var div = document.createElement('div');
            div.className = "todo-item";
            let label = document.createElement('label');
            let input = document.createElement('input');
            input.type = 'checkbox';
            let par = document.createElement('p');
            par.className = 'todo-text';
            par.innerHTML = item.itemName;
            let i = document.createElement('i');
            i.className = 'far fa-trash-alt delete-icon';
            label.appendChild(input);
            label.appendChild(par);
            div.appendChild(label);
            div.appendChild(i);

            $('#todo-list-wrapper').append(div);

            input.onchange = () => {
                par.classList.toggle('todo-item-completed');
            }
        });

    }
    
    var majorTodo = localStorage.getItem('major-todo');

    if(majorTodo !== null && majorTodo !== '') {
        $('#todo-list-wrapper').html('');
        createTodoItem(majorTodo);
    }


    var fullName = localStorage.getItem('full-name');

    if(fullName !== null && fullName !== '') {
        $('#name-input-wrapper').css('display', 'none');
        $('#todo-input-wrapper').css('display', 'block');
        $('#first-name').html(fullName);
    }

    $('#name-input').keyup(function(e) {
        if(e.keyCode === 13) {
            localStorage.setItem('full-name', e.target.value);

            $('#name-input-wrapper').css('display', 'none');
            $('#todo-input-wrapper').css('display', 'block')
            $('#first-name').html(e.target.value)
        }
    })

    $('#major-todo').keyup(function(e) {
        if(e.keyCode === 13) {

            $('#major-todo-wrapper').css('display', 'none');
            $('#major-todo-item').css('display', 'block');

            addToList(e.target.value);

            console.log($('#todo-text'));

            $('#major-todo-label').html(e.target.value);
        }
    })

    $('#major-todo-checkbox').change(function(e) {
        $('#major-todo-label').toggleClass('todo-item-completed');
        let todoList = JSON.parse(localStorage['major-todo']);

        todoList.map(item =>{
            if ( $('#major-todo-label').hasClass("todo-item-completed") && $("#major-todo-label").html() == item.itemName ) {
                item.condition = 1;
            } else item.condition = 0;
             console.log(item.condition);
        })

    })

    function addToList (listItem) {
        if (localStorage) {
            let todoList;
            if (!localStorage['major-todo']) todoList = [];
            else {
                todoList = JSON.parse(localStorage['major-todo']);
            }

            todoList.push({'itemName':listItem});

            localStorage.setItem('major-todo', JSON.stringify(todoList));
        } 
    }

    $('#todos-wrapper h3').click(function(){
        $('#todo-list').toggle();
    })
});