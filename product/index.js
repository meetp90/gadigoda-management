import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js";
const firebaseConfig = {
  apiKey: "AIzaSyAsggKuEMDNQL8-9x51t64H1FhFNKqJCp4",
  authDomain: "gadigoda-dfc26.firebaseapp.com",
  databaseURL: "https://gadigoda-dfc26-default-rtdb.firebaseio.com",
  projectId: "gadigoda-dfc26",
  storageBucket: "gadigoda-dfc26.appspot.com",
  messagingSenderId: "329109229217",
  appId: "1:329109229217:web:ae8e4de7b401a21ba2aae0",
  measurementId: "G-JV9VS26G2N",
};

const app = initializeApp(firebaseConfig);
import {
  getStorage,
  ref as sRef,
  uploadBytesResumable,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/9.1.3/firebase-storage.js";

var files = [];
var reader = new FileReader();
var namebox = document.getElementById("namebox");
var extlab = document.getElementById("extlab");
var myimg = document.getElementById("myimg");
var proglab = document.getElementById("upprogress");
var SelBtn = document.getElementById("selbtn");
var UpBtn = document.getElementById("upbtn");
//var DownBtn=document.getElementById('downbtn');
var input = document.createElement("input");
var downloadURL;
var name;
var extention;
input.type = "file";
input.onchange = (e) => {
  files = e.target.files;
  console.log(files[0]);
  extention = GetFileExt(files[0]);
  name = GetFileName(files[0]);
  console.log(name);
  namebox.value = name;
  extlab.innerHTML = extention;
  reader.readAsDataURL(files[0]);
};
reader.onload = function () {
  myimg.src = reader.result;
};

// selection

SelBtn.onclick = function () {
  input.click();
};
function GetFileExt(file) {
  var temp = file.name.split(".");
  var ext = temp.slice(temp.length - 1, temp.length);
  return "." + ext[0];
}
function GetFileName(file) {
  var temp = file.name.split(".");
  var fname = temp.slice(0, -1).join(".");
  return fname;
}

// upload func
async function UploadProcess() {
  var ImgToUpload = files[0];
  var ImgName = namebox.value + extlab.innerHTML;
  const metaData = {
    contentType: ImgToUpload.type,
  };

  const storage = getStorage();
  const stroageRef = sRef(storage, "Images/" + ImgName);
  const UploadTask = uploadBytesResumable(stroageRef, ImgToUpload, metaData);

  UploadTask.on(
    "state-changed",
    (snapshot) => {
      var progess = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      proglab.innerHTML = "Upload" + progess + "%";
    },
    (error) => {
      alert("error:image not uploaded!");
    },
    () => {
      getDownloadURL(UploadTask.snapshot.ref).then((downloadURL) => {
        console.log(downloadURL);
        media.value = downloadURL;
      });
    }
  );
}
UpBtn.onclick = UploadProcess;

 