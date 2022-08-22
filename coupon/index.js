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
  
    $('#edit_button').click(function () {
      var row = table.api().rows('.selected').data();
      data = row[0];
      editcoupon(data);
  });
  $('#active_button').click(function () {
    var row = table.api().rows('.selected').data();
    data = row[0];
    activate_coupon(data);
});
}
});


function create_new_partner() {
  var data = $('#make_new_partner_form').serializeArray().reduce(function (obj, item) {
    obj[item.name] = item.value;
    return obj;
  }, {});
  data.isActive = true;
  data.id = Date.now().toString(36) + Math.random().toString(36).substr(2);

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


function editcoupon(data) {
  console.log(data);
    $("#edit_coupon_form #couponcode").val(data.code);
    $("#edit_coupon_form #station_list_select").val(data.selected_coupon_type);
    $("#edit_coupon_form #exampleFormControlInput1").val(data.amount);
    $("#edit_coupon_form #exampleFormControlInput2").val(data.maximum_amount);
    $("#edit_coupon_form #exampleFormControlInput3").val(data.validity_time);
    $("#edit_coupon_form #exampleFormControlInput4").val(data.validity_date);
    $("#edit_coupon_form #exampleFormControlInput5").val(data.minimum_amount);
    
    $('#save_edit_button').click(function () {
      edit_coupon(data);
  });
  }


function edit_coupon(data){
  var new_data = $('#edit_coupon_form').serializeArray().reduce(function (obj, item) {
    obj[item.name] = item.value;
    return obj;
  }, {});
  var newdata = new_data
  newdata.id = data.id;
  console.log(newdata)
  $.ajax({
    url: "https://us-central1-gadigoda-dfc26.cloudfunctions.net/updateDiscountCoupon",
    type: "post",
    data: newdata,
    success: function (response) {
      console.log("https://us-central1-gadigoda-dfc26.cloudfunctions.net/updateDiscountCoupon", response);
      location.reload();
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log("ERROR ON NETWORK CALL", textStatus, errorThrown);
    }
  });
}

// Function: Activate/Deactivate Coupon
function activate_coupon(data) {
  if (data.isActive == "true") {
    data.isActive = false;
  }
  else if(data.isActive == "false") {
    data.isActive = true;
  }
  console.log(data);
  $.ajax({
    url: "https://us-central1-gadigoda-dfc26.cloudfunctions.net/updateDiscountCoupon",
    type: "post",
    data: data,
    success: function (response) {
      console.log("https://us-central1-gadigoda-dfc26.cloudfunctions.net/updateDiscountCoupon", response);
      location.reload();
    }
  });
}
