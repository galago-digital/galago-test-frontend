$(document).ready(function() {
  var todayDate = new Date();
  var currYear = todayDate.getFullYear();
  var currMonth = todayDate.getMonth() + 1;
  if (currMonth < 10) currMonth = "0" + currMonth;
  var currDay = todayDate.getDate();
  // такое впечателение что maxId объявлено здесь только для 
  // того чтобы можно было использовать $('.form').on('submit'
  // так же можно было просто использовать var вместо let. Раз уж и так var используются
  let maxId = 0;

  // если клонировать репозиторий и запустить index.html
  // users.json не загрузится
  $.getJSON("./users.json", function(data) {
    let ids = [];
    // нет никакой проверки на успех загрузки
    // разумнее сначала проверить есть ли данные вообще
    // чем запускать each для формирования нового массива, 
    // а потом проверять если ли в нем что-то - if (ids.length)
    // да и иницицализировать массив (let ids = [];) имеет смысл только если туда есть что писать
    $.each(data, function(key, val) {
      ids = val;
    });
    
    if (ids.length) {
      maxId = ids[0].id;
      for (let i = 1; i < ids.length; i++) {
        if(ids[i].id > maxId)
          maxId = ids[i].id;
      }
    }    
  });

  // заполняем таблицу из файла
  var t = $('#races').DataTable( {
      "processing": true,
      "aLengthMenu": [[3, 5, 10, -1], [3, 5, 10, "All"]],
      "iDisplayLength": 5,
      "ajax": {
        "url": "users.json",
        "dataType": "json",
        "dataSrc": "users"
      },
      "columnDefs": [{
        "defaultContent": "-",
        "targets": "_all"
      }],
      "columns": [
          { data: "id" },
          { data: "regDate", "type" : "date" },
          { data: "name" },
          { data: "date", "type" : "date" },
          { data: "email" },
          { data: "phone" },
          { data: "distance" },
          { data: "payment" }
      ],
      "order": [[ 1, "desc" ]]
  } );

  const checkInputs = () => {    
    // $("#name"), $("#birthDate") и т.д. встречается 2 раза в коде
    // и оба раза запускается поиск в DOM
    // если объявить в начале константы с этими элементами const NAME_FIELD = $("#name");
    // их можно использовать не запуская поиск заново 
    let name = $("#name").val();
    let date = $("#birthDate").val();
    let email = $("#email").val();
    let phone = $("#phone").val();
    let distance = $("#distance").val();
    let payment = $("#payment").val();
     
    if (name && date && email && phone && distance && payment) {
      $('#addBtn').removeAttr('disabled');
    } else {
      $('#addBtn').attr('disabled', 'disabled');
    }

    $('#addBtn').attr('disabled', false);
  }
  
  // лучше испльзовать событие input. Или change
  // и в этом случае не понадбилось вешать слушатели отдельно на [name='birthDate'], [name='distance']
  $('.form__input').on("keydown", checkInputs);
  // а если все же вешать на них то - 
  // селектор по атрибутам работает медленнее чем по классам или по элементу
  // если бы добавить класс то хватило бы одной строки
  // $(some-class).on("change", checkInputs);
  $("[name='birthDate']").on("change", checkInputs);
  $("[name='distance']").on("change", checkInputs);

  // добавляем пользователя в таблицу
  $('.form').on('submit', e => {
    e.preventDefault();
    maxId++;
    t.row.add( {
      id: maxId,
      regDate: currDay + "." + currMonth + "." + currYear,
      name: $("#name").val(),
      date: $("#birthDate").val(),
      email: $("#email").val(),
      phone: $("#phone").val(),
      distance: $("#distance").val(),
      payment: $("#payment").val()
    } ).draw( false );
    $(e.currentTarget)[0].reset();
  } );
} );


