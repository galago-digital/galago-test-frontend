$(document).ready(function() {
  var todayDate = new Date();
  var currYear = todayDate.getFullYear();
  var currMonth = todayDate.getMonth() + 1;
  if (currMonth < 10) currMonth = "0" + currMonth;
  var currDay = todayDate.getDate();
  let maxId = 0;

  $.getJSON("./users.json", function(data) {
    let ids = [];
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
  }
  
  $('.form__input').on("keydown", checkInputs);
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


