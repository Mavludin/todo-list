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

            if (item.condition == 1) {
                par.classList.add('todo-item-completed');
                input.checked = true;
            }
            else par.classList.remove('todo-item-completed');        
        });

    }

    var fullName = localStorage.getItem('full-name');

    if(fullName !== null && fullName !== '') {
        $('#name-input-wrapper').css('display', 'none');
        $('#todo-input-wrapper').css('display', 'block');
        $('#first-name').html(fullName);
    }
    
    var majorTodo = localStorage.getItem('major-todo');

    if(majorTodo !== null && majorTodo !== '' && majorTodo !== '[]') {
        $('#todo-list-wrapper').html('');
        createTodoItem(majorTodo);

        majorTodo = JSON.parse(majorTodo);
        majorTodoLast = majorTodo[majorTodo.length-1];
        $('#major-todo-wrapper').hide();
        $('#major-todo-item').show();
        $('#major-todo-label').html(majorTodoLast.itemName);

        if (majorTodoLast.condition == 1) {
            $('#major-todo-label').addClass('todo-item-completed');
            $('#major-todo-checkbox').prop("checked", true);
        } else $('#major-todo-label').removeClass('todo-item-completed');
    } else $('#todo-list-wrapper').html('');

    $('#name-input').keyup(function(e) {
        if(e.keyCode === 13) {
            localStorage.setItem('full-name', e.target.value);

            $('#name-input-wrapper').css('display', 'none');
            $('#todo-input-wrapper').css('display', 'block')
            $('#first-name').html(e.target.value);
        }
    })

    $('#major-todo').keyup(function(e) {
        if(e.keyCode === 13) {

            $('#major-todo-wrapper').css('display', 'none');
            $('#major-todo-item').css('display', 'block');

            addToList(e.target.value);

            console.log($('#todo-text'));

            $('#major-todo-label').html(e.target.value);
            location.reload();
        }
    });

    $('#new-todo').keyup(function(e) {
        if(e.keyCode === 13) {

            addToList(e.target.value);
            location.reload();
        }
    });    

    $('#major-todo-checkbox').change(function(e) {
        $('#major-todo-label').toggleClass('todo-item-completed');
        let todoList = JSON.parse(localStorage['major-todo']);

        todoList.map(item =>{
            if ( $('#major-todo-label').hasClass("todo-item-completed") && $("#major-todo-label").text() == item.itemName ) {
                 item.condition = 1;
            } else if ( !$('#major-todo-label').hasClass("todo-item-completed") && $("#major-todo-label").text() == item.itemName ) {
                item.condition = 0;
            }
        })

        localStorage.setItem('major-todo', JSON.stringify(todoList));

    });

    $('.todo-item input[type="checkbox"]').change(function(e) {
        $('#todo-list .todo-text').toggleClass('todo-item-completed');
        let todoList = JSON.parse(localStorage['major-todo']);

        todoList.map(item =>{
            if ( $('#todo-list .todo-text').hasClass("todo-item-completed") && $("#todo-list .todo-text").text() == item.itemName ) {
                 item.condition = 1;
            } else if ( !$('#todo-list .todo-text').hasClass("todo-item-completed") && $("#todo-list .todo-text").text() == item.itemName ) {
                item.condition = 0;
            }
        })

        localStorage.setItem('major-todo', JSON.stringify(todoList));

    });

    $('.delete-icon').click(function() {
        let todoList = JSON.parse(localStorage['major-todo']);

        todoList.map((item, pos, arr2) => {
            if ($("#major-todo-label").text() == item.itemName) {
                arr2.splice(pos, 1);
            }
        });
        localStorage.setItem('major-todo', JSON.stringify(todoList));
        location.reload();
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
        $('#todo-list').toggle();
    })

});