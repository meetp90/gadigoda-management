var data;

$(document).ready(function () {
  $.ajax({
      url : 'https://us-central1-gadigoda-dfc26.cloudfunctions.net/getAllBookings',
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
              "data" : "phoneNumber"
          }, {
              "data" : "pickup"
          }, {
              "data" : "pickup_coordinates"
          }, {
              "data" : "pickup_date"
          },   {
                "data": "pickup_time"
           }, {
                "data":"station"
           }, {
                "data":"station_is"        
           }
      ]})
    
      $('#partner_table').on('click', 'tr', function () {
        $(this).toggleClass('selected');
      });
    
      $('#allotment_button').click(function () {
        var row = table.api().rows('.selected').data();
        var data = row[0];
        console.log(data);
    });
  }
});
console.log(data)

// function create_new_partner() {
//   alert("this will create new partner");
//   var data = $('#make_new_partner_form').serializeArray().reduce(function (obj, item) {
//     obj[item.name] = item.value;
//     return obj;
//   }, {});
//   console.log(data);
//   $.ajax({
//     url: "https://us-central1-gadigoda-dfc26.cloudfunctions.net/createPartner",
//     type: "post",
//     data: data,
//     success: function (response) {
//       console.log("https://us-central1-gadigoda-dfc26.cloudfunctions.net/createPartner", response);
//       $('#create_new_partner_modal').modal('hide');
//       location.reload();
//     },
//     error: function (jqXHR, textStatus, errorThrown) {
//       console.log("ERROR ON NETWORK CALL", textStatus, errorThrown);
//     }
//   });
// }


// function setseats(seats) {
//   $("#no_of_seats_input").val(seats);
// }

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
  