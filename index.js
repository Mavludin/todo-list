$(document).ready(function() { 

    // Setting up time, greetings, and backgrounds

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
                    par.classList.add('todo-item-completed');
                    item.condition = 1;
                }
                else {
                    par.classList.remove('todo-item-completed');
                    item.condition = 0;
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

    }

    var fullName = localStorage.getItem('full-name');

    if(fullName !== null && fullName !== '') {
        $('#name-input-wrapper').css('display', 'none');
        $('#todo-input-wrapper').css('display', 'block');
        $('#first-name').html(fullName);
    }

    $('#major-todo-checkbox').on('change', function(){
        if ($(this).is(':checked')) {
            $('#major-todo-label').addClass('todo-item-completed');

            let todoList = JSON.parse(localStorage['major-todo']);
            todoList[todoList.length-1].condition = 1;
            $('#todo-list-wrapper .todo-item:last .todo-text').addClass('todo-item-completed');
            $('#todo-list-wrapper .todo-item:last input').prop("checked", true);
            localStorage.setItem('major-todo', JSON.stringify(todoList));
        }
        else {
            let todoList = JSON.parse(localStorage['major-todo']);
            todoList[todoList.length-1].condition = 0;
            $('#todo-list-wrapper .todo-item:last .todo-text').removeClass('todo-item-completed');
            $('#todo-list-wrapper .todo-item:last input').prop("checked", false);
            $('#major-todo-label').removeClass('todo-item-completed');
            localStorage.setItem('major-todo', JSON.stringify(todoList)); 
        }   
    });

    $('#name-input').keyup(function(e) {
        if(e.keyCode === 13) {
            localStorage.setItem('full-name', e.target.value);

            $('#name-input-wrapper').css('display', 'none');
            $('#todo-input-wrapper').css('display', 'block')
            $('#first-name').html(e.target.value);
        }
    });

    $('#major-todo').keyup(function(e) {
        if(e.keyCode === 13) {

            $('#major-todo-wrapper').css('display', 'none');
            $('#major-todo-item').css('display', 'block');

            addToList(e.target.value);

            if ( $('#no-todos').is(':visible') ) {
                $('#no-todos').hide();
                let todoList = localStorage.getItem('major-todo');
                $('#todo-list-wrapper').html('');
                createTodoItem(todoList);
                $('#todo-list').show();
            }   
                   
            $('#major-todo-label').html(e.target.value);
        }
    });

    let majorTodo = localStorage.getItem('major-todo');

    if(majorTodo !== null && majorTodo !== '' && majorTodo !== '[]') {

        majorTodo = JSON.parse(majorTodo);
        majorTodoLast = majorTodo[majorTodo.length-1];
        $('#major-todo-wrapper').hide();
        $('#major-todo-item').show();
        $('#major-todo-label').html(majorTodoLast.itemName);

        if (majorTodoLast.condition == 1) {
            $('#major-todo-label').addClass('todo-item-completed');
            $('#major-todo-checkbox').prop("checked", true);
        }
        else {
            $('#major-todo-label').removeClass('todo-item-completed');
            $('#major-todo-checkbox').prop("checked", false);
        }
    }

    $('#new-todo').keyup(function(e) {
        if(e.keyCode === 13) {

            addToList(e.target.value);

            let todoList = localStorage.getItem('major-todo');
            $('#todo-list-wrapper').html('');
            createTodoItem(todoList);

            $('#major-todo-label').html(e.target.value);
            e.target.value = "";
        }
    });    

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

        let todoList = localStorage.getItem('major-todo');
        if (todoList !== null && todoList !== '' && todoList !== "[]") {
            $('#todo-list-wrapper').html('');
            createTodoItem(todoList);
            $('#todo-list').show();
            $('#no-todos').hide();

            $('.todo-item .delete-icon').click(function() {
                let todoList = JSON.parse(localStorage['major-todo']);
                todoList.map((item, pos, arr2) => {
                    if ($(this).parent().index() === pos) {
                        arr2.splice(pos, 1);
                        $(this).parent().remove();
                    }
                });
                localStorage.setItem('major-todo', JSON.stringify(todoList));
            });
        } else {
            $('#no-todos').css('display', 'flex');
        }
        // $('#todo-list').toggle();
    });

    $("#add-first-todo").click(function(){
        $('#todo-list').show();
    });

    $('#major-todo-item .delete-icon').click(function() {

        let todoList = JSON.parse(localStorage['major-todo']);
        todoList.splice([todoList.length-1]);

        $('#todo-list-wrapper .todo-item:last').remove();
        $('#major-todo-label').html( $('#todo-list-wrapper .todo-item:last .todo-text').html() );
        // if ($('#todo-list-wrapper .todo-item:last input').is(':checked')){
        //     $('#major-todo-label').addClass('todo-item-completed');
        //     $('#major-todo-checkbox').prop("checked", true);
        // } else {
        //     $('#major-todo-label').removeClass('todo-item-completed');
        //     $('#major-todo-checkbox').prop("checked", false);
        // }
        localStorage.setItem('major-todo', JSON.stringify(todoList));

        if ($('#todo-list-wrapper').html() === "") {
            $('#major-todo-item').hide();
            $('#major-todo-wrapper').show();
            $('#major-todo-label').html() = "";
        }
    });

});