$(document).ready(function () {
    $.ajax({
        url : 'https://us-central1-gadigoda-dfc26.cloudfunctions.net/getAllotedData',
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
                "data" : "carrier_available"
            }, {
                "data" : "cars_under_management"
            },   {
                  "data": "contact_number"
             }, {
                  "data":"model"
             }, {
                  "data":"phoneNumber"        
             },
             {
                "data" : "pickup"
            }, {
                "data" : "pickup_date"
            }, {
                "data" : "pickup_time"
            }, {
                "data" : "region"
            }, {
                  "data":"station"
             }, {
                  "data":"station_is"        
             }
             
        ]})
      
        $('#partner_table').on('click', 'tr', function () {
          $(this).toggleClass('selected');
        });
        $('#del_button').click(function () {
            var row = table.api().rows('.selected').data();
            data = row[0];
            delBooking(data);
        });
    }
  });

// Function to delete a booking
function delBooking(data) {
    data.isDeleted = true;
    $.ajax({
        url : 'https://us-central1-gadigoda-dfc26.cloudfunctions.net/udpateAllotedData',
        type : 'POST',
        dataType : 'json',
        data : data,
        success : function(data) {
            alert("Booking deleted successfully");
            window.location.reload();
        }
    });
}