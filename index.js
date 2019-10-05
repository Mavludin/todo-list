$(document).ready(function() { 

    // Setting up time, greetings, and backgrounds - START
    let currentDate = new Date();
    let hours = currentDate.getHours();
    let minutes = currentDate.getMinutes();
    $('#time').html(`${hours}:${minutes}`);

    if (hours >=0 && hours <= 9) {
        $('#time').html(`0${hours}:${minutes}`);
    }

    if (minutes >=0 && minutes <= 9) {
        $('#time').html(`${hours}:0${minutes}`);
    }    

    if (hours >= 4 && hours <= 11) {
        $('#greeting').html('Good morning, ');
        $('#weather-image').attr('src', './Assets/bg-image/morning.jpg');
    } else if ( hours >= 12 && hours <= 16) {
        $('#greeting').html('Good afternoon, ');
        $('#weather-image').attr('src', './Assets/bg-image/afternoon.jpg');
    } else if ( hours >= 17 && hours <= 20) {
        $('#greeting').html('Good evening, ');
        $('#weather-image').attr('src', './Assets/bg-image/evening.jpg');
    } else {
        $('#greeting').html('Good night, ');
        $('#weather-image').attr('src', './Assets/bg-image/night.jpg');       
    }
    // Setting up time, greetings, and backgrounds - END

    // Working with name - START
    let fullName = localStorage.getItem('full-name');

    if(fullName !== null && fullName !== '') {
        $('#name-input-wrapper').css('display', 'none');
        $('#todo-input-wrapper').css('display', 'block');
        $('#first-name').html(fullName);
    }

    $('#name-input').keyup(function(e) {
        if(e.key === 'Enter') {
            localStorage.setItem('full-name', e.target.value);

            $('#name-input-wrapper').css('display', 'none');
            $('#todo-input-wrapper').css('display', 'block');
            $('#first-name').html(e.target.value);
        }
    });
    // Working with name - END

    // Working with major todo list - START
    $('#major-todo').keyup(function(e) {
        if(e.key === 'Enter') {

            $('#major-todo-wrapper').hide();
            $('#major-todo-item').fadeIn();

            let majorTodo = {'mainFocus':e.target.value, 'completed': false};

            localStorage.setItem('major-todo', JSON.stringify(majorTodo));

            $('#major-todo-label').html(majorTodo.mainFocus);
            $('#major-todo-label').removeClass('todo-item-completed');
            $('#major-todo-checkbox').prop("checked", false);
        }
    });

    const ifMajorTodoNotEmpty = () => {

        let majorTodo = localStorage.getItem('major-todo');
        if ( !($.isEmptyObject(majorTodo)) ){
            majorTodo = JSON.parse(majorTodo);
        }
        return majorTodo;
    };

    $('#major-todo-checkbox').on('change', function () {
       if ( $(this).is(':checked') ) {
           let majorTodo = ifMajorTodoNotEmpty();
           $('#major-todo-label').addClass('todo-item-completed');
           majorTodo.completed = true;
           localStorage.setItem('major-todo', JSON.stringify(majorTodo));
       } else {
           let majorTodo = ifMajorTodoNotEmpty();
           $('#major-todo-label').removeClass('todo-item-completed');
           majorTodo.completed = false;
           localStorage.setItem('major-todo', JSON.stringify(majorTodo));
       }

    });

    let majorTodo = ifMajorTodoNotEmpty();
    if(majorTodo) {

        $('#major-todo-wrapper').hide();
        $('#major-todo-item').show();
        $('#major-todo-label').html(majorTodo.mainFocus);

        if (majorTodo.completed) {

            $('#major-todo-label').addClass('todo-item-completed');
            $('#major-todo-checkbox').prop("checked", true);

        } else {

            $('#major-todo-label').removeClass('todo-item-completed');
            $('#major-todo-checkbox').prop("checked", false);
        }

    }

    $('#major-todo-item .delete-icon').click(function() {

        localStorage.removeItem('major-todo');
        $('#major-todo-label').html('');
        $('#major-todo-item').hide();
        $('#major-todo-wrapper').fadeIn();
        $('#major-todo').val('');
    });

    // Working with major todo list - END

    // Working with aside todo list - START
    const createTodoItem = arr => {
        arr = JSON.parse(arr);
        arr.map((item,pos,arr2) => {
            let div = document.createElement('div');
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

            input.onchange = e => {
                if (e.target.checked) {
                    item.completed = true;
                    par.classList.add('todo-item-completed');
                }
                else {
                    par.classList.remove('todo-item-completed');
                    item.completed = false;
                }
            }

            // if (item.condition == 1) {
            //     par.classList.add('todo-item-completed');
            //     input.checked = true;
            // }
            // else { 
            //     par.classList.remove('todo-item-completed'); 
            // }
        });

    };

    $('#new-todo').keyup(function(e) {
        if(e.key === 'Enter') {

            addToList(e.target.value);

            let todoList = localStorage.getItem('todo-list');
            $('#todo-list-wrapper').html('');
            createTodoItem(todoList);

            e.target.value = "";
        }
    });    

    const addToList = listItem => {
        if (localStorage) {
            let todoList;
            if (!localStorage['todo-list']) todoList = [];
            else {
                todoList = JSON.parse(localStorage['todo-list']);
            }

            todoList.push({'itemName':listItem, 'completed': false});

            localStorage.setItem('todo-list', JSON.stringify(todoList));
        } 
    };

    $('#todos-wrapper h3').click(function(){

        let todoList = localStorage.getItem('todo-list');
        if (todoList !== null && todoList !== '' && todoList !== "[]") {
            $('#todo-list-wrapper').html('');
            createTodoItem(todoList);
            // $('#todo-list').fadeIn();
            $('#no-todos').hide();
            $('#todo-list').slideToggle(200);
            $('.todo-item .delete-icon').click(function() {
                let todoList = JSON.parse(localStorage['todo-list']);
                todoList.map((item, pos, arr2) => {
                    if ($(this).parent().index() === pos) {
                        arr2.splice(pos, 1);
                        $(this).parent().fadeOut(function(){$(this).remove()});
                    }
                });
                localStorage.setItem('todo-list', JSON.stringify(todoList));
            });

        } else {
            $('#todo-list').hide();
            $('#no-todos').slideToggle('medium').css('display', 'flex');
        }

    });

    $("#add-first-todo").click(function(){
        $('#todo-list').fadeIn();
        $('#no-todos').hide();

        let todoList = localStorage.getItem('todo-list');
        if (todoList === null || todoList === "[]") {
            $('#todo-list-wrapper').html('');
        }

    });
    // Working with aside todo list - END

});