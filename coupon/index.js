var data;


$(document).ready(function () {
  $.ajax({
      url : 'https://us-central1-gadigoda-dfc26.cloudfunctions.net/getDiscountCoupons',
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
            "data" : "code"
        }, {
            "data" : "selected_coupon_type"
        }, {
            "data" : "amount"
        }, {
            "data" : "maximum_amount"
        }, {
            "data" : "minimum_amount"
        }, {
          "data" : "validity_time"
      }, {
          "data" : "validity_date"
      }, {
          "data" : "isActive"
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
}
});
console.log(data)

function create_new_partner() {
  var data = $('#make_new_partner_form').serializeArray().reduce(function (obj, item) {
    obj[item.name] = item.value;
    return obj;
  }, {});
  data.isActive = true;
  console.log(data);
  $.ajax({
    url: "https://us-central1-gadigoda-dfc26.cloudfunctions.net/createDiscountCoupon",
    type: "post",
    data: data,
    success: function (response) {
      console.log("https://us-central1-gadigoda-dfc26.cloudfunctions.net/createDiscountCoupon", response);
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

