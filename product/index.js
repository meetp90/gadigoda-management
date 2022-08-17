var isEditOn = false;
var editIndex = -1;
var opened_plan;
var opened_plan_index;
var opened_vehicle_plans = {};
var opened_vehicle_plan_index = -1;
var received_plans;
var items;
var filtercategory;

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



// const product = [
//   {
//     id: 1,
//     name: "Charger",
//     desc: "All types of Charging Cables available",
//     price: "150",
//     mrp: "180",
//     delay: 5,
//     location: "ABC",
//     category: "Accessories",
//     availableAt: ["Morning", "Afternoon", "Evening"],
//     media:
//       "https://img.favpng.com/15/18/16/battery-charger-mobile-phones-ac-adapter-electric-battery-electrical-cable-png-favpng-wXBujhQ4H8DPtnSrJk0r1p1fN.jpg",
//   },
//   {
//     id: 2,
//     name: "something",
//     desc: "gdfgdfg",
//     price: "898",
//     mrp: "18780",
//     delay: 87,
//     location: "hfgh",
//     category: "Food",
//     availableAt: ["Morning", "Afternoon", "Evening", "Night"],
//     media:
//       "https://images.lifestyleasia.com/wp-content/uploads/sites/7/2022/02/01171421/YFL-Pav-Bhaji-2.jpg",
//   },
//   {
//     id: 2,
//     name: "something",
//     desc: "gdfgdfg",
//     price: "898",
//     mrp: "18780",
//     delay: 87,
//     location: "hfgh",
//     category: "Food",
//     availableAt: ["Morning", "Afternoon", "Evening", "Night"],
//     media:
//       "https://images.lifestyleasia.com/wp-content/uploads/sites/7/2022/02/01171421/YFL-Pav-Bhaji-2.jpg",
//   },
//   {
//     id: 2,
//     name: "something",
//     desc: "gdfgdfg",
//     price: "898",
//     mrp: "18780",
//     delay: 87,
//     location: "hfgh",
//     category: "Food",
//     availableAt: ["Morning", "Afternoon", "Evening", "Night"],
//     media:
//       "https://images.lifestyleasia.com/wp-content/uploads/sites/7/2022/02/01171421/YFL-Pav-Bhaji-2.jpg",
//   },
//   {
//     id: 2,
//     name: "something",
//     desc: "gdfgdfg",
//     price: "898",
//     mrp: "18780",
//     delay: 87,
//     location: "hfgh",
//     category: "Food",
//     availableAt: ["Morning", "Afternoon", "Evening", "Night"],
//     media:
//       "https://images.lifestyleasia.com/wp-content/uploads/sites/7/2022/02/01171421/YFL-Pav-Bhaji-2.jpg",
//   },
//   {
//     id: 2,
//     name: "something",
//     desc: "gdfgdfg",
//     price: "898",
//     mrp: "18780",
//     delay: 87,
//     location: "hfgh",
//     category: "Food",
//     availableAt: ["Morning", "Afternoon", "Evening", "Night"],
//     media:
//       "https://images.lifestyleasia.com/wp-content/uploads/sites/7/2022/02/01171421/YFL-Pav-Bhaji-2.jpg",
//   },
//   {
//     id: 2,
//     name: "something",
//     desc: "gdfgdfg",
//     price: "898",
//     mrp: "18780",
//     delay: 87,
//     location: "hfgh",
//     category: "Food",
//     availableAt: ["Morning", "Afternoon", "Evening", "Night"],
//     media:
//       "https://images.lifestyleasia.com/wp-content/uploads/sites/7/2022/02/01171421/YFL-Pav-Bhaji-2.jpg",
//   },
//   {
//     id: 2,
//     name: "something",
//     desc: "gdfgdfg",
//     price: "898",
//     mrp: "18780",
//     delay: 87,
//     location: "hfgh",
//     category: "Food",
//     availableAt: ["Morning", "Afternoon", "Evening", "Night"],
//     media:
//       "https://images.lifestyleasia.com/wp-content/uploads/sites/7/2022/02/01171421/YFL-Pav-Bhaji-2.jpg",
//   },
// ];

// var dynamic = document.querySelector(".products");
// var htmlcode = ``;
// if ($(document).ready) {
//   product.forEach(function (props) {
//     htmlcode =
//       htmlcode +
//       `<div class="card">
//         <img src=${props.media} class="card-img-top" style="width:100%;height:20rem"/>
//         <div class="card-body">
//             <h3 class="product-title">${props.name}</h3>
//             <p class="product-properties">
//             <ul style="list-style-type: none;padding:0">

//                 <li><strong>Product Description:</strong>${props.desc}</li>
//                 <li><strong>Price:</strong>&#8377;${props.price}</li>
//                 <li><strong>MRP :</strong> &#8377;${props.mrp} </li>
//                 <li><strong>Location :</strong> ${props.location} </li>
//                 <li><strong>Delay :</strong> ${props.delay} </li>
//                 <li><strong>Category :</strong> ${props.category} </li>
//                 <li><strong>Available At:</strong>
//                     <ul style="list-style-type: square;">
//                         <li>${props.availableAt}</li>
//                     </ul>
//                 </li>
//             </ul></p>
//             <a href="#" class="btn btn-danger">Delete</a>
//             <a href="#" class="btn btn-primary">Edit</a>
//         </div>
//         </div>`;
//     dynamic.innerHTML = htmlcode;
//   });
// }
