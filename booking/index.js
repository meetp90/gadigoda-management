var data;
var data1;
var data2;
var allotedData;
var allotedData1;

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
        data1 = row[0];
        console.log(data1);
    });
  }
});


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


function allot_partner_with_booking(){
  $.ajax({
    url : 'https://us-central1-gadigoda-dfc26.cloudfunctions.net/getAllPartners',
    type : 'POST',
    dataType : 'json',
    success : function(data) {
        assignToEventsColumns_partners(data);
    }
});
}
function assignToEventsColumns_partners(data) {
    var table = $('#driver_table').dataTable({
        "bAutoWidth" : false,
        "aaData" : data,
        "columns" : [ {
            "data" : "car_owner"
        }, {
            "data" : "cars_under_management"
        }, {
            "data" : "contact_number"
        }, {
            "data" : "vehicle_number"
        } ]
    })

    $('#driver_table').on('click', 'tr', function () {
      $(this).toggleClass('selected');
    });
  
    $('#allotment').click(function () {
      var row = table.api().rows('.selected').data();
      data2 = row[0];
      //console.log(data2);

      allotedData = {
        ...data1,
        ...data2
    };
      console.log(allotedData);
      alert("this will allot booking to a partner");
      $.ajax({
        url: " https://us-central1-gadigoda-dfc26.cloudfunctions.net/createAllotedData",
        method: "POST",
        data: allotedData,
        success: function (response) {
          alert("success");
          console.log("https://us-central1-gadigoda-dfc26.cloudfunctions.net/createAllotedData", response);
          $('#allot_partner_modal').modal('hide');
        },
        error: function (jqXHR, textStatus, errorThrown) {
          console.log("ERROR ON NETWORK CALL", textStatus, errorThrown);
        }
      });

    });
      
      


  
  }
