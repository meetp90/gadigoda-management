var isEditOn = false;
var editIndex = -1;
var opened_plan;
var opened_plan_index;
var opened_vehicle_plans = {};
var opened_vehicle_plan_index = -1;
var received_plans;
var items;
var filtercategory;

<<<<<<< HEAD



$(document).ready(() => {
  $('#media').change(function () {
    const file = this.files[0];
    console.log(file);
    if (file) {
      let reader = new FileReader();
      reader.onload = function (event) {
        console.log(event.target.result);
        $('#imgPreview').attr('src', event.target.result);
      }
      reader.readAsDataURL(file);
    }
  });
});
$(document).ready(function () {
  $("select#filter").change(function () {
    filtercategory = $(this).children("option:selected").val();
    update_products_list();
  })
})

var capture_new_apckage_form = function () {
  //localStorage.setItem('packages','');
  var data = $("#packake_creation_form")
    .serializeArray()
    .reduce(function (obj, item) {
      obj[item.name] = item.value;
      return obj;
    }, {});
  console.log(data);
  var go_ahead = true;
  if (!data.alloted_kms) {
    go_ahead = false;
    alert("Please Fill All Details [alloted_kms]");
  }

  if (!data.alloted_time) {
    go_ahead = false;
    alert("Please Fill All Details [alloted_time]");
  }

  if (!data.kms_charged) {
    go_ahead = false;
    alert("Please Fill All Details [kms_charged]");
  }

  if (!data.name) {
    go_ahead = false;
    alert("Please Fill All Details [name]");
  }
  

  if (go_ahead) {
    $("#create_new_package_modal").modal("hide");
    if (isEditOn) {
      alert("Editing Package");
      if (received_plans) {
        var packages = received_plans;
        console.log(packages);
        data.id = packages[editIndex].id;
        console.log(data);

        $("#plan-management-view").hide();
        $("#plan-loader").show();
        var data_packet = data;
        $.ajax({
          url: "https://us-central1-gadigoda-dfc26.cloudfunctions.net/updatePackage",
          method: "POST", //First change type to method here

          data: data_packet,
          success: function (response) {
            //received_plans=response;
            //alert("Successfully Edited");
            console.log(
              "https://us-central1-gadigoda-dfc26.cloudfunctions.net/updatePackage",
              response
            );
            editIndex = -1;
            isEditOn = false;
            update_packages_list();
          },
          error: function () {
            alert("error");
          },
        });
      } else alert("Your Plan Object is Empty, Something is wrong");
    } else {
      $("#create_new_package_modal").modal("hide");
      data.id = Date.now().toString(36) + Math.random().toString(36).substr(2);
      if (received_plans) {
        $("#plan-management-view").hide();
        $("#plan-loader").show();
        var packages = received_plans;
        console.log(packages);
        data.plans = [];
        packages.push(data);
        alert("Sending to Server");
        var data_packet = data;
        $.ajax({
          url: "https://us-central1-gadigoda-dfc26.cloudfunctions.net/createPackage",
          method: "POST", //First change type to method here

          data: data_packet,
          success: function (response) {
            //alert("Successfully Created");
            console.log(
              "https://us-central1-gadigoda-dfc26.cloudfunctions.net/createPackage",
              response
            );
            update_packages_list();
          },
          error: function () {
            alert("error");
          },
        });
      } else {
        var packages = [];
        packages.push(data);
        var data_packet = data;

        $("#plan-management-view").hide();
        $("#plan-loader").show();
        alert("Sending to Server");
        $.ajax({
          url: "https://us-central1-gadigoda-dfc26.cloudfunctions.net/createPackage",
          method: "POST", //First change type to method here

          data: data_packet,
          success: function (response) {
            //alert("Successfully Created");
            console.log(
              "https://us-central1-gadigoda-dfc26.cloudfunctions.net/createPackage",
              response
            );
            update_packages_list();
          },
          error: function () {
            alert("error");
          },
        });
      }
    }
  }
};

var vehicle_plan_creation_form = function () {
  //localStorage.setItem('packages','');

  var data = $("#create_new_vehicle_modal_form")
    .serializeArray()
    .reduce(function (obj, item) {
      obj[item.name] = item.value;
      return obj;
    }, {});

  var go_ahead = true;
  if (!data.price_per_km) {
    go_ahead = false;
    alert("Please Fill All Details [price per km]");
  }

  if (data.no_of_seats == 0) {
    go_ahead = false;
    alert("Please Fill All Details [No Of Seats]");
  }

  if (Number(data.allowance_indicator) > 0) {
    if (data.allowance_cost_per_unit == 0) {
      go_ahead = false;
      alert("Please Fill Allowance Cost");
    }
  }

  if (go_ahead) {
    $("#create_new_vehicle_modal").modal("hide");
    data.allowance_amount =
      Number(data.allowance_indicator) * Number(data.allowance_cost_per_unit);

    if (opened_plan.plans) {
      if (opened_vehicle_plan_index == -1) {
        opened_plan.plans.push(data);
      } else {
        opened_plan.plans[opened_vehicle_plan_index] = data;
        opened_vehicle_plan_index = -1;
      }
    } else {
      var plans = [];
      if (opened_vehicle_plan_index == -1) {
        plans.push(data);
      } else {
        opened_plan.plans[opened_vehicle_plan_index] = data;
        opened_vehicle_plan_index = -1;
      }

      opened_plan.plans = plans;
    }

    console.log("Parent Plan", opened_plan);
    console.log("Vehicle Plan", data);

    $("#plan-management-view").hide();
    $("#plan-loader").show();
    var data_packet = opened_plan;
    //alert("Updating Vehicle");
    console.log("Adding Vehicle", opened_plan);
    $.ajax({
      url: "https://us-central1-gadigoda-dfc26.cloudfunctions.net/updatePackage",
      method: "POST", //First change type to method here

      data: data_packet,
      success: function (response) {
        //received_plans=response;
        alert("Successfully Edited");
        console.log(
          "https://us-central1-gadigoda-dfc26.cloudfunctions.net/updatePackage",
          response
        );
        update_packages_list();
      },
      error: function () {
        alert("error");
      },
    });
  }
};


function editplan(index) {
  if (received_plans) {
    var data = received_plans;
    var obj = data[index];

    Object.keys(obj).forEach((key) => {
      $(`input[name="${key}"]`).val(obj[key]);
      $(`select[name="${key}"]`).val(obj[key]);
      $(`textarea[name="${key}"]`).val(obj[key]);
    });

    isEditOn = true;
    editIndex = index;
    alert("Editing " + index);
    $("#create_new_package_modal").modal("show");
  }
}

function deleteplan(index) {
  if (received_plans[index]) {
    var data = received_plans[index];
    data.isDeleted = true;

    $("#plan-management-view").hide();
    $("#plan-loader").show();
    var data_packet = data;
    $.ajax({
      url: "https://us-central1-gadigoda-dfc26.cloudfunctions.net/updatePackage",
      method: "POST", //First change type to method here

      data: data_packet,
      success: function (response) {
        //received_plans=response;
        alert("Successfully Deleted");
        console.log(
          "https://us-central1-gadigoda-dfc26.cloudfunctions.net/updatePackage",
          response
        );
        $("#create_new_vehicle_modal").modal("hide");
        update_packages_list();
      },
      error: function () {
        alert("error");
      },
    });
  }
}

function openplan(index) {
  if (received_plans) {
    alert("Opening " + index);
    var data = received_plans;
    opened_plan = data[index];
    opened_plan_index = index;
    console.log(opened_plan);

    $("#opened_plan").text(opened_plan.name);

    $("#price_per_km_input").bind("input", function () {
      var charge = $(this).val();
      $("#base_amount_input").val(charge * opened_plan.kms_charged);
      update_plan_total_min_price(get_base_fare(), get_allowance_fare(), 0);
    });

    $("#allowance_amt_input").bind("input", function () {
      update_plan_total_min_price(get_base_fare(), get_allowance_fare(), 0);
    });

    $("#plan_alloted_kms").val(opened_plan.alloted_kms);
    $("#plan_charged_kms").val(opened_plan.kms_charged);
    $("#parent-plan-name-input").val(opened_plan.name);

    setup_vehicle_view();
  }
}

function setseats(seats) {
  $("#no_of_seats_input").val(seats);
}

var allowance_index = 0;
function setup_allowance_index(index) {
  allowance_index = index;
  if (allowance_index == 0) {
    $("#allowance_amt_input").prop("readonly", true);
    $("#allowance_amt_input").val(allowance_index);
  } else {
    $("#allowance_amt_input").prop("readonly", false);
  }

  update_plan_total_min_price(get_base_fare(), get_allowance_fare(), 0);
}

function get_allowance_fare() {
  return Number($("#allowance_amt_input").val()) * allowance_index;
}

function get_base_fare() {
  return Number($("#base_amount_input").val());
}

function get_alloted_km() { }

function update_plan_total_min_price(
  base_amount,
  allowance_amount,
  insurance_amount
) {
  //console.log(base_amount,allowance_amount,insurance_amount);
  var total_fare =
    Number(base_amount) + Number(allowance_amount) + Number(insurance_amount);
  $("#parent-plan-baseprice-input").val(total_fare);
}

function setup_vehicle_view() {
  if (opened_plan == null) {
    $("#no_vehicles_layout_header").text("No Package Selected.");
    $("#no_vehicles_layout_action_button").hide();
    $("#add_vehicle-package-button").hide();
  } else {
    console.log(opened_plan);
    $("#add_vehicle-package-button").show();
    if (opened_plan.plans) {
      if (opened_plan.plans.length > 0) {
        $("#no_vehicles_layout").hide();
        $("#vechicles_list_ul").show();
        populate_vehicles_list(opened_plan.plans);
      } else {
        $("#no_vehicles_layout").show();
        $("#no_vehicles_layout_header").text("No Cars Available.");
        $("#no_vehicles_layout_action_button").show();
        $("#vechicles_list_ul").hide();
      }
    } else {
      alert("No Plans in the Vehicle.");
      $("#no_vehicles_layout_header").text("No Cars Available.");
      $("#no_vehicles_layout_action_button").show();
      $("#no_vehicles_layout").show();
      $("#vechicles_list_ul").hide();
    }
  }
}

function populate_vehicles_list(plans) {
  opened_vehicle_plans = plans;
  document.getElementById("vechicles_list_ul").innerHTML = "";
  for (var i = 0; i < plans.length; i++) {
    $("#vechicles_list_ul").append(
      "<li class='list-group-item'>" +
      '<div style="display:inline-flex;width: -webkit-fill-available;">' +
      '<div style="width: -webkit-fill-available;">' +
      plans[i].selected_vehicle +
      "</div>" +
      '<div style="display: inline-flex;">' +
      '<span style="border-radius:5px!important;cursor: pointer;margin-right:5px!important;padding:5px!important; " id="' +
      i +
      '" class="badge badge-danger badge-pill"> ₹ ' +
      plans[i].plan_baseprice +
      "</span>" +
      '<span style="border-radius:5px!important;cursor: pointer;margin-right:5px!important;padding:5px!important;" id="' +
      i +
      '"onclick="editvehicleplan(' +
      i +
      ')" class="badge badge-primary badge-pill" style="margin-right:5px;padding:5px;">Edit</span>' +
      "</div>" +
      "</div>" +
      "</li>"
    );
  }
}

function editvehicleplan(i) {
  var plan = opened_vehicle_plans[i];
  opened_vehicle_plan_index = i;
  console.log(plan);
  Object.keys(plan).forEach((key) => {
    $(`input[name="${key}"]`).val(plan[key]);
    $(`select[name="${key}"]`).val(plan[key]);
    $(`textarea[name="${key}"]`).val(plan[key]);
  });

  $("#create_new_vehicle_modal").modal("show");
}

//adding products
// {name: '', availableAt: Array(0), product_description: '', product_price: '', product_mrp: '', …}
// availableAt: []
// category: ""
// delay: ""
// location: "Select Location"
// media: ""
// name: ""
// product_description: ""
// product_mrp: ""
// product_price: ""
// [[Prototype]]: Object

=======
>>>>>>> e896b677f874a1047332c94e7c48e32559bd9612
$("#submit").click(function () {
  add_new_products();
});

var add_new_products = function () {
  var time = [];
  $.each($("input[name='availableAt']:checked"), function () {
    time.push($(this).val());
  });

  var data = $("#product_adding_form")
    .serializeArray()
    .reduce(function (obj, item) {
      obj[item.name] = item.value;
      obj.availableAt = time;
      return obj;
    }, {});

  var data_packet = data;

  var go_ahead = true;
  if (!data.name) {
    go_ahead = false;
    alert("Please Fill All Details [Product Name]");
  }

  if (!data.category) {
    go_ahead = false;
    alert("Please Fill All Details [Category]");
  }

  if (!data.time) {
    go_ahead = false;
    alert("Please Fill All Details [delay]");
  }

  if (!data.desc) {
    go_ahead = false;
    alert("Please Fill All Details [product_description]");
  }

  if (!data.mrp) {
    go_ahead = false;
    alert("Please Fill All Details [product_mrp]");
  }

  if (!data.price) {
    go_ahead = false;
    alert("Please Fill All Details [product_price]");
  }
  if (!data.availableAt) {
    go_ahead = false;
    alert("Please Fill All Details [availableAt]");
  }
  if (!data.media) {
    go_ahead = false;
    alert("Please Fill All Details [media]");
  }
  if (!data.type) {
    go_ahead = false;
    alert("Please Fill All Details [media]");
  }
  if (go_ahead) {
    $("#add_product").modal("hide");
    if (isEditOn) {
      alert("Editing Package");
      if (received_plans) {
        var products = received_products;
        console.log(products);
        data.id = products[editIndex].id;
        console.log(data.id);

        $(".products").hide();
        $("#plan-loader").show();
        var data_packet = data;
        $.ajax({
          url: "https://us-central1-gadigoda-dfc26.cloudfunctions.net/updateProduct",
          method: "POST", 

          data: data_packet,
          success: function (response) {
            console.log(
              "https://us-central1-gadigoda-dfc26.cloudfunctions.net/updateProduct",
              response
            );
            editIndex = -1;
            isEditOn = false;
            update_products_list();
          },
          error: function () {
            alert("error");
          },
        });
      } else alert("Your Plan Object is Empty, Something is wrong");
    } else {
      $("#add_product").modal("hide");
      data.id = Date.now().toString(36) + Math.random().toString(36).substr(2);
      if (received_plans) {
        $(".products").hide();
        $("#plan-loader").show();
        var products = received_products;
        console.log(products);
        data.plans = [];
        products.push(data);
        alert("Sending to Server");
        var data_packet = data;
        $.ajax({
          url: "https://us-central1-gadigoda-dfc26.cloudfunctions.net/createProduct",
          method: "POST", //First change type to method here

          data: data_packet,
          success: function (response) {
            //alert("Successfully Created");
            console.log(
              "https://us-central1-gadigoda-dfc26.cloudfunctions.net/createProduct",
              response
            );
            update_products_list();
          },
          error: function () {
            alert("error");
          },
        });
      } else {
        var products = [];
        products.push(data);
        var data_packet = data;

        $(".products").hide();
        $("#plan-loader").show();
        alert("Sending to Server");
        $.ajax({
          url: "https://us-central1-gadigoda-dfc26.cloudfunctions.net/createProduct",
          method: "POST", //First change type to method here

          data: data_packet,
          success: function (response) {
            //alert("Successfully Created");
            console.log(
              "https://us-central1-gadigoda-dfc26.cloudfunctions.net/createProduct",
              response
            );
            update_products_list();
          },
          error: function () {
            alert("error");
          },
        });
      }
    }
  }
  
};

function update_products_list() {
  $.ajax({
    url: "https://us-central1-gadigoda-dfc26.cloudfunctions.net/getAllProducts",
    method: "POST", 
    success: function (response) {
      alert("Successfully Received;");
      console.log(
        "https://us-central1-gadigoda-dfc26.cloudfunctions.net/getAllProducts",
        response
      );
      var data = response;
      items = [];
      $.each(data, function (i, products) {
        if (products.isDeleted) {
        } else {
          var htmlcode =
            " <div class='card'>" +
            "<img src=" +
            products.media +
            " " +
            'class="card-img-top" style="width:100%;height:20rem"/>' +
            "<div class='card-body'>" +
            '<h3 class="product-title">' +
            products.name +
            "</h3>" +
            ' <p class="product-properties">' +
            "<ul >" +
            " <li><strong>Product Description:</strong>" +
            products.desc +
            "</li>" +
            " <li><strong>Price:</strong>&#8377;" +
            products.price +
            "</li>" +
            "<li><strong>MRP :</strong> &#8377;" +
            products.mrp +
            "</li>" +
            "<li><strong>Location :</strong>" +
            products.location +
            " </li> " +
            "<li><strong>Delay :</strong>" +
            products.delay +
            "</li>" +
            "<li><strong>Type :</strong>" +
            products.type +
            "</li>" +
            "<li><strong>Category :</strong>" +
            products.category +
            "</li>" +
            "<li><strong>Available At:</strong>" +
            ' <ul id="availableAtlist"  >' +
            " <li>" +
            products.availableAt +
            "</li>" +
            "</ul>" +
            " </li>" +
            "  </ul></p>" +
            ' <a href="#" class="btn btn-danger" onclick="deleteproducts(' +
            i +
            ')">Delete</a>' +
            '     <a href="#" class="btn btn-primary"onclick="editproducts(' +
            i +
            ')">Edit</a>' +
            "  </div>" +
            "</div>";
          items.push(htmlcode);
        }
      });

      document.querySelector(".products").innerHTML = "";
      $(".products").append(items.join(""));
      isEditOn = false;
      editIndex = -1;
      $(".products").show();
    },
    error: function () {
      alert("error");
    },
  });
}

function deleteproducts(index) {
  if (received_products[index]) {
    var data = received_products[index];
    data.isDeleted = true;
    // alert(data.isDeleted)
    console.log(data.isDeleted);
    // console.log(data);
    console.log(received_products[index]);
    console.log("hello");
    $(".products").hide();
    $("#plan-loader").show();
    var data_packet = data;
    $.ajax({
      url: "https://us-central1-gadigoda-dfc26.cloudfunctions.net/updateProduct",
      method: "POST", //First change type to method here

      data: data_packet,
      success: function (response) {
        alert("Successfully Deleted");
        console.log(
          "https://us-central1-gadigoda-dfc26.cloudfunctions.net/updateProduct",
          response
        );
        $("#add_product").modal("hide");
        update_products_list();
      },
      error: function () {
        alert("error");
      },
    });
  }
}

function editproducts(index) {
  if (received_products) {
    var data = received_products;
    var obj = data[index];

    Object.keys(obj).forEach((key) => {
      $(`input[name="${key}"]`).val(obj[key]);
      $(`select[name="${key}"]`).val(obj[key]);
      $(`textarea[name="${key}"]`).val(obj[key]);
    });

    isEditOn = true;
    editIndex = index;
    alert("Editing " + index);
    $("#add_product").modal("show");
  }
}
