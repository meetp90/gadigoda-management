import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js";
const firebaseConfig = {
    apiKey: "AIzaSyAsggKuEMDNQL8-9x51t64H1FhFNKqJCp4",
    authDomain: "gadigoda-dfc26.firebaseapp.com",
    databaseURL: "https://gadigoda-dfc26-default-rtdb.firebaseio.com",
    projectId: "gadigoda-dfc26",
    storageBucket: "gadigoda-dfc26.appspot.com",
    messagingSenderId: "329109229217",
    appId: "1:329109229217:web:ae8e4de7b401a21ba2aae0",
    measurementId: "G-JV9VS26G2N"
};  

const app = initializeApp(firebaseConfig);
import { getStorage, ref as sRef, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-storage.js";

var files=[];
  var reader=new FileReader();
  var namebox=document.getElementById('namebox');
  var extlab=document.getElementById('extlab');
  var myimg=document.getElementById('myimg');
  var proglab=document.getElementById('upprogress');
  var SelBtn=document.getElementById('selbtn');
  var UpBtn=document.getElementById('upbtn');
  //var DownBtn=document.getElementById('downbtn');
  var input=document.createElement('input');
  var downloadURL;
  var name;
  var extention;
  input.type='file';
  input.onchange=e=>{
      files=e.target.files;
      console.log(files[0]);
      extention=GetFileExt(files[0]);
      name=GetFileName(files[0]);
      console.log(name);
      namebox.value=name;
      extlab.innerHTML=extention;
      reader.readAsDataURL(files[0]);
  }
  reader.onload =function(){
      myimg.src  =reader.result;
  }


  // selection

  SelBtn.onclick=function()
  {
  input.click();
  }
  function GetFileExt(file){
  var temp=file.name.split('.');
  var ext=temp.slice((temp.length-1),(temp.length));
      return'.'+ext[0];
  }
  function GetFileName(file)
  {
  var temp=file.name.split('.');
  var fname=temp.slice(0,-1).join('.');
      return fname;
  }

  // upload func 
  async function UploadProcess(){
      var ImgToUpload=files[0];
      var ImgName=namebox.value+extlab.innerHTML;
      const metaData=
      {
          contentType:ImgToUpload.type
      }

      const storage=getStorage();
      const stroageRef=sRef(storage,"Images/"+ImgName);
      const UploadTask=uploadBytesResumable(stroageRef,ImgToUpload,metaData);

      UploadTask.on('state-changed',(snapshot)=>{
          var progess=(snapshot.bytesTransferred / snapshot.totalBytes)*100;
          proglab.innerHTML="Upload"+progess+"%";
       },
      (error)=>{
          alert("error:image not uploaded!");
      },
      ()=>{
      getDownloadURL(UploadTask.snapshot.ref).then((downloadURL)=>{
              console.log(downloadURL);
              media.value=downloadURL;
       });
      }
      );

      }
      UpBtn.onclick=UploadProcess; 


//Declaring Global Variables
 var received_products;
 
$(document).ready(function () {
  update_products_list();
});


// Function: update_products_list
function update_products_list() {
  var filterCategory = document.getElementById("filter").value;
  if (filterCategory == "none") {
    $.ajax({
      url: "https://us-central1-gadigoda-dfc26.cloudfunctions.net/getAllProducts",
      method: "POST",
      success: function (response) {
        console.log("https://us-central1-gadigoda-dfc26.cloudfunctions.net/getAllProducts", response);
        var data = response;
        received_products=response;
        var items = [];
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
              products.time +
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
       // isEditOn = false;
       // editIndex = -1;
        $(".products").show();
      },
      error: function () {
        alert("error");
      },
    });
  }
  else if (filterCategory == "food") {
    $.ajax({
      url: "https://us-central1-gadigoda-dfc26.cloudfunctions.net/getProductsByFood",
      method: "POST",
      success: function (response) {
        console.log("https://us-central1-gadigoda-dfc26.cloudfunctions.net/getProductsByFood", response);
        var data = response;
        received_products=response;
        items = [];
        $.each(data, function (i, products) {
          if (products.isDeleted) {
          } else {
            var htmlcode =
              " <div class='card'>" +
              "<img src=" +
              products.myimg +
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
              products.time +
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
  else if (filterCategory == "accessories") {
    $.ajax({
      url: "https://us-central1-gadigoda-dfc26.cloudfunctions.net/getProductsByAccessories",
      method: "POST",
      success: function (response) {
        console.log("https://us-central1-gadigoda-dfc26.cloudfunctions.net/getProductsByAccessories", response);
        var data = response;
        items = [];
        $.each(data, function (i, products) {
          if (products.isDeleted) {
          } else {
            var htmlcode =
              " <div class='card'>" +
              "<img src=" +
              products.myimg +
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
              products.time +
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
              ' <a href="#" class="btn btn-danger" onclick="deleteproducts(' + i + ')">Delete</a>' +
              '     <a href="#" class="btn btn-primary"onclick="editproducts(' + i + ')">Edit</a>' +
              "  </div>" +
              "</div>";
            items.push(htmlcode);
          }
        });
        document.querySelector(".products").innerHTML = "";
        $(".products").append(items.join(""));
        $(".products").show();
      },
      error: function () {
        alert("error");
      },
    });
  }
}

$("#submit").click(function () {
  add_new_products();
});


// Function : Add new products
function add_new_products() {
  var time = [];
  $.each($("input[name='availableAt']:checked"), function () {
    time.push($(this).val());
  });
  var data = $("#product_adding_form").serializeArray().reduce(function (obj, item) {
    obj[item.name] = item.value;
    obj.availableAt = time;
    return obj;
  }, {});
  data.id = Date.now().toString(36) + Math.random().toString(36).substr(2);
  
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
    alert("Please Fill All Details [myimg]");
  }
  if (!data.type) {
    go_ahead = false;
    alert("Please Fill All Details [TYPE]");
  } 
  if (go_ahead) {
    $.ajax({
      url: "https://us-central1-gadigoda-dfc26.cloudfunctions.net/createProduct",
      method: "POST",
      data: data,
      success: function (response) {
        console.log("https://us-central1-gadigoda-dfc26.cloudfunctions.net/createProduct", response);
        location.reload();
      },
      error: function () {
        alert("error");
      },
    });
  }
}

// Function : Delete Products
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
