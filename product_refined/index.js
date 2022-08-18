$(document).ready(function(){
    update_products_list();
    });
function update_products_list() {
    $.ajax({
      url: "https://us-central1-gadigoda-dfc26.cloudfunctions.net/getAllProducts",
      method: "POST", 
      success: function (response) {
        console.log("https://us-central1-gadigoda-dfc26.cloudfunctions.net/getAllProducts",response);
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