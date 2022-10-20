const input = document.getElementById('new'); // получаем элементы по ID, поэтому можно без решётки (но можно было и через обычный querySelector('#new') тогда уже с решёткой)
const addBtn = document.getElementById('add');
const taskList = document.getElementById('tasks');
const count = document.getElementById('count');

let arrTasks = [];// Создали массив задач

addBtn.addEventListener('click', () => {
// addBtn.onclick = () => {} это альтернативный вариант как повесить слушатель событий на клик 
    const newTaskText = input.value;// вытаскиваем значение инпута
    if(newTaskText && isNotIncluded(newTaskText)) {// проверяем если ли что-то у инпута и есть ли уже задача
        addTask(newTaskText);
        input.value ='';//очищаем инпут
        taskRender() // это срока уже пишется после написания функции taskRender() после 42 строки кода. Это функция рендера нашего сайта
        sendTasks(arrTasks);
    }
});


function addTask(text) {//прописываем фукцию добавления задачи, должны сохранить нашу задачу в массиве задач, как раз создаём 
    const time = Date.now();
    const task = {// создаём объект, который пушим
        id: time,
        text: text,
        isCompleted: false,
    }
    
    arrTasks.push(task);// пушим именно объект, так как наша задача в массиве должна иметь много инфы: сам текст задачи, выполнена она или нет, её идентификатор и тд
    //console.log(arrTasks);
}

//проверка существования задачи в массиве задач
function isNotIncluded(text) {
    let notIncluded = true;

    arrTasks.forEach(task => {
        if(task.text === text) {
            alert('There is the task already!')
            notIncluded = false;
        }
    })
    return notIncluded;
}

//делаем функцию вывода списка задач в HTML код. Это РЕНДЕР (пишем это после написания кода выше)
function taskRender() {
 let htmlList = ``;

 arrTasks.forEach( task => {
    const cls = task.isCompleted ? 'todo__task-completed' : ''// если свойство задачи isCompleted: true, тогда добавляем модификатор в HTML разметку
    //далее копируем зараннее заготовленный блок с HTML, с классами id и тд в taskHTML
    const isChecked = task.isCompleted ? 'checked' : '';// здесь прописываем поведение аттрибута checked в зависимости от свойства task.isCompleted

    const taskHTML = `
    <div id="${task.id}" class="todo__task ${cls}">
        <label class="todo__checkbox">
            <input type="checkbox" ${isChecked}>
            <div></div> 
        </label>
        <div class="todo__task-text">${task.text}</div>
        <div class="todo__task-del">-</div>
    </div>`
    htmlList += taskHTML; //это по-сути перенос всех объектов в массиве arrTasks в формат HTML (через переменную taskHTML). Мы формируем столько блоков HTML кода (прототип одного выше), сколько отрабатывает forEach
 })
    taskList.innerHTML = htmlList;//находим родительские контейнер для всех тасков, прописываем ему свойство .innerHTML и присываиваем ему все объекты с массива arrTasks, переведённые в формат HTML
    renderTasksCount(arrTasks);
}

//Вешаем слушатель событий onclick на весь родительский элемент <div class=".todo__task"> div с id="tasks"
taskList.onclick = (event) => { //первый аргумент у колбек функции .onclick (как и у addEventListener) это само событие, мы прописали event
    const target = event.target;// с помощью .target можно понять на чём именно произошёл ивент(в нашем случае клик, так как .onclick). В нашем случае при одном клике мы кликаем как бы на 2 элемента, так как у нас в <label> завёрнут <input> и <div>
    const isCheckBoxEl = target.parentNode.tagName === 'LABEL';//здесь мы через .parentNode выбираем родителя target и далее с помощью .tagName смотрим, чтобы мы попали на нужный нам тег родителя <label>. Важно, чтобы tagName === 'БЫЛ ПРОПИСАН БОЛЬШИМИ БУКВАМИ'
    const deleteBtn = document.querySelector('.todo__task-del');// находим кнопку удаление у нашего HTML элемента, делаем это уже в самый последний момент написания кода, когда пишем функцию удаления задачи

    if(isCheckBoxEl) {
        //const isCompleted = target.previousElementSibling.isChecked; // получаем предыдущий эллемент у нашего <div> с помощью .previousElementSibling, это <input>. Потом у этого импута проверяем свойство isChecked. Мы запрогали это до этого на строке 50 и 55. ПО ФАКТУ это в коде не используется, но даёт ошибку в консоли
        const task = target.parentElement.parentElement;//поднимаемся с <div> сперва до <label> и дальше до <div class="todo__task>
        const taskId = task.getAttribute('id');//создаём переменную taskId в которую получаем id от <div class="todo__task> с помощью getAttribute('') (там можно любой аттрибут указать, мы указали 'id')
        changeTaskStatus(taskId, arrTasks);//функция, которая меняет статус у конкретной задачи. Мы создаём её ниже
        taskRender(); // Это функция рендера нашего сайта, созданная на строке 44
    }
    if(deleteBtn) {//Эту строку 79 и 80 и 81 и 82 и 83 делаем уже в самом-самом конце
        const task = target.parentElement;// делали уже на строке 74, только поднимаемся на 1 уровень, а не на 2. Мы с кнопки удаления <div class="todo__task-del"> поднимаемся до <div id="${task.id}" class="todo__task ${cls}">, таким образом выбирая главный родительский элемент 
        const taskId = task.getAttribute('id');//делали уже на строке 75
        deleteTask(taskId, arrTasks);
        taskRender();
    }
}

//Создаём функцию изменения статуса задачи
function changeTaskStatus(id, list) {//можно было не прописывать в аргументе массив задач, он итак у нас 1
    list.forEach(task => {
        if(task.id == id) {// ставим не строгое сравнение, так как task.id, полученный с объекта list посредством forEach имеет тип 'число', а параметр id в функции, полученный с getAttribute('') имеет тип 'строка'
            task.isCompleted = !task.isCompleted;// меняем значение на обратное
        }
    })
}

//Создаём функцию удаления задачи
function deleteTask(id, list) {//можно было не прописывать в аргументе массив задач, он итак у нас 1
    list.forEach( (task, index) => {
        if(task.id == id) {
            list.splice(index, 1);//удалять элементы из массива, так как при использовании delete list[index] в массиве будут оставаться пустые места. В отличие от этого splice удаляет из массива эллемент и его length становится короче 
        }
    })
}

//Вывод количества задач
function renderTasksCount(list){//можно было не прописывать в аргументе массив задач, он итак у нас 1
    count.innerHTML = list.length;//обращаемся к тегу <strong> в HTML, который мы нашли с помощью .getElementById на строке кода 4. Присваиваем ему значение длины массива
}


// //От бесплатного API treblle
// const express = require("express");
// const { useTreblle } = require("treblle");
 
// const app = express();
// app.use(express.json());
 
// useTreblle(app, {
//     apiKey: "DEZ48Py9cHAFYkhGdeMFCymmCdcrnBAA",
//     projectId: "AkUyz42ywEEbxeXJ"
// });


//https://jsonplaceholder.typicode.com/todos/1
//https://reqres.in/api/users/1
//https://reqres.in/api/users/34

const api_url = 'http://localhost:5000/users';


//Функция отправки данных на сервер
    let sendTasks = async (url) => {
        return await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
          },
        body: JSON.stringify(arrTasks)
    }).catch( error => console.log(error) ).then((res) => res.json()).then((data) => alert(data.message));
};

sendTasks(api_url);


