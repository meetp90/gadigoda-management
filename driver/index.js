$(document).ready(function () {
  $.ajax({
      url : 'https://us-central1-gadigoda-dfc26.cloudfunctions.net/getAllPartners',
      type : 'POST',
      dataType : 'json',
      success : function(data) {
          assignToEventsColumns(data);
      }
  }); 

  function assignToEventsColumns(data) {
    var table = $('#partner_table').dataTable({
        "bAutoWidth" : false,
        "aaData" : data,
        "columns" : [ {
            "data" : "car_owner"
        }, {
            "data" : "cars_under_management"
        }, {
            "data" : "contact_number"
        }, {
            "data" : "model"
        }, {
            "data" : "rate"
        }, {
          "data" : "region"
      }, {
        "data" : "seater"
    }, {
      "data" : "t_permit"
  }, {
    "data" : "vehicle_number"
} ]
    })
    $('#partner_table').on('click', 'tr', function () {
      $(this).toggleClass('selected');
    });
  
    $('#allotment_button').click(function () {
      var row = table.api().rows('.selected').data();
      var data = row[0];
      console.log(data);
  });
  $('#edit_button').click(function () {
    var row = table.api().rows('.selected').data();
    var data = row[0];
    console.log(data);
    $("#edit_partner_form #exampleFormControlInput1").val(data.car_owner);
    $("#edit_partner_form #exampleFormControlInput2").val(data.cars_under_management);
    $("#edit_partner_form #exampleFormControlInput3").val(data.contact_number);
    $("#edit_partner_form #exampleFormControlInput4").val(data.model);
    $("#edit_partner_form #exampleFormControlInput5").val(data.rate);
    $("#edit_partner_form #exampleFormControlInput6").val(data.region);
    $("#edit_partner_form #exampleFormControlInput7").val(data.seater);
    $("#edit_partner_form #exampleFormControlInput8").val(data.t_permit);
    $("#edit_partner_form #exampleFormControlInput9").val(data.vehicle_number);

    var new_data = $('#edit_partner_form').serializeArray().reduce(function (obj, item) {
      obj[item.name] = item.value;
      return obj;
    }, {});
    edit_partner(new_data);

});
}
});

function edit_partner(new_data){
  $.ajax({
    url: "https://us-central1-gadigoda-dfc26.cloudfunctions.net/updatePartner",
    type: "post",
    data: new_data,
    success: function (response) {
      console.log("https://us-central1-gadigoda-dfc26.cloudfunctions.net/update", response);
      $('#create_new_partner_modal').modal('hide');
      location.reload();
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log("ERROR ON NETWORK CALL", textStatus, errorThrown);
    }
  });
}

function create_new_partner() {
  alert("this will create new partner");
  var data = $('#make_new_partner_form').serializeArray().reduce(function (obj, item) {
    obj[item.name] = item.value;
    return obj;
  }, {});
  console.log(data);
  $.ajax({
    url: "https://us-central1-gadigoda-dfc26.cloudfunctions.net/createPartner",
    type: "post",
    data: data,
    success: function (response) {
      console.log("https://us-central1-gadigoda-dfc26.cloudfunctions.net/createPartner", response);
      $('#create_new_partner_modal').modal('hide');
      location.reload();
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log("ERROR ON NETWORK CALL", textStatus, errorThrown);
    }
  });
}


function setseats(seats) {
  $("#no_of_seats_input").val(seats);
}

function update_partner_table() {
  $.ajax({
    url: "https://us-central1-gadigoda-dfc26.cloudfunctions.net/getAllPartners",
    type: "post",
    success: function (response) {
      alert("Loaded " + response.length);
      console.log(response);
      var table = $('#partner_table').DataTable();
   
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log("ERROR ON NETWORK CALL", textStatus, errorThrown);
    }
  });
}

function allot_partner(){
  $.ajax({
    url : 'https://us-central1-gadigoda-dfc26.cloudfunctions.net/getAllBookings',
    type : 'POST',
    dataType : 'json',
    success : function(data) {
        assignToEventsColumns_bookings(data);
    }
});

function assignToEventsColumns_bookings(data) {
    var table = $('#booking_table').dataTable({
        "bAutoWidth" : false,
        "aaData" : data,
        "columns" : [ {
            "data" : "station"
        }, {
            "data" : "pickup"
        }, {
            "data" : "phoneNumber"
        }, {
            "data" : "pickup_date"
        }, {
            "data" : "pickup_time"
        } ]
    })
    // $('#partner_table').on('click', 'tr', function () {
    //   $(this).toggleClass('selected');
    // });
  
    // $('#allotment_button').click(function () {
    //   var row = table.api().rows('.selected').data();
    //   var data = row[0];
    //   console.log(data);
  // });
}  
}

