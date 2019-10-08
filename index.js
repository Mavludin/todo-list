$(function() {

    // Getting current geolocation - START
    navigator.geolocation.getCurrentPosition(
        function( position ){ // success

            var lat = position.coords.latitude;
            var lng = position.coords.longitude;
            var google_map_pos = new google.maps.LatLng( lat, lng );
            var google_maps_geocoder = new google.maps.Geocoder();
            google_maps_geocoder.geocode(
                { 'latLng': google_map_pos },
                function( results, status ) {
                    if ( status == google.maps.GeocoderStatus.OK && results) {
                        $('#geo').html(results[0].address_components[4].short_name);
                    }
                }
            );
        },
        function(){ // error
          console.log('Error');
        }
    );
    // Getting current geolocation - END

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
    const createTodoItem = (obj, pos) => {
            let div = document.createElement('div');
            div.className = "todo-item";
            let label = document.createElement('label');

            let input = document.createElement('input');
            input.type = 'checkbox';

            let par = document.createElement('p');
            par.className = 'todo-text';
            par.innerHTML = obj.itemName;

            let i = document.createElement('i');
            i.className = 'far fa-trash-alt delete-icon';

            if (obj.completed) {
                input.checked = true;
                par.classList.add('todo-item-completed');
            } else {
                input.checked = false;
                par.classList.remove('todo-item-completed');
            }

            input.onchange = e => {
                let todoList = ifTodoListNotEmpty();
                if (e.target.checked) {
                    par.classList.add('todo-item-completed');
                    todoList[pos].completed = true;
                }
                else {
                    par.classList.remove('todo-item-completed');
                    todoList[pos].completed = false;
                }
                localStorage.setItem('todo-list', JSON.stringify(todoList));
            };

            i.onclick = () => {
                let todoList = ifTodoListNotEmpty();
                    div.remove();
                    todoList.splice(pos, 1);
                    if (todoList.length > 0) localStorage.setItem('todo-list', JSON.stringify(todoList));
                    else localStorage.removeItem('todo-list');
            };

            label.appendChild(input);
            label.appendChild(par);
            div.appendChild(label);
            div.appendChild(i);

            return div;
    };

    const ifTodoListNotEmpty = () => {

        let todoList = localStorage.getItem('todo-list');
        if (todoList !== null && todoList !== '') {
            todoList = JSON.parse(todoList);
        }
        return todoList;
    };

    $('#new-todo').keyup(function(e) {
        if(e.key === 'Enter') {

            addToList(e.target.value);

            $('#todo-list-wrapper').html('');

            let todoList = JSON.parse(localStorage['todo-list']);
            todoList.map(item => {
                $('#todo-list-wrapper').append(createTodoItem(item));
            });

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

        let todoList = ifTodoListNotEmpty();
        if (todoList) {
            $('#todo-list-wrapper').html('');
            todoList.map((item,pos) => {
                $('#todo-list-wrapper').append(createTodoItem(item,pos));
            });
            $('#no-todos').hide();
            $('#todo-list').slideToggle(200);
        } else {
            $('#todo-list').hide();
            $('#no-todos').slideToggle('medium').css('display', 'flex');
        }
    });

    $("#add-first-todo").click(function(){
        $('#todo-list').fadeIn();
        $('#no-todos').hide();

        let todoList = ifTodoListNotEmpty();
        if (!todoList) {
            $('#todo-list-wrapper').html('');
        }
    });
    // Working with aside todo list - END
    
});