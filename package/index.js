var isEditOn = false;
var editIndex = -1;

var opened_plan;
var opened_plan_index;

var opened_vehicle_plans = {};
var opened_vehicle_plan_index = -1;

var received_plans;


var capture_new_apckage_form = function () {

    //localStorage.setItem('packages','');
    var data = $('#packake_creation_form').serializeArray().reduce(function (obj, item) {
        obj[item.name] = item.value;
        return obj;
    }, {});

    var go_ahead = true;
    if (!data.alloted_kms) {
        go_ahead = false;
        alert("Please Fill All Details [alloted_kms]");;
    }


    if (!data.alloted_time) {
        go_ahead = false;
        alert("Please Fill All Details [alloted_time]");;
    }


    if (!data.kms_charged) {
        go_ahead = false;
        alert("Please Fill All Details [kms_charged]");;
    }

    if (!data.name) {
        go_ahead = false;
        alert("Please Fill All Details [name]");;
    }

    if (go_ahead) {
        $('#create_new_package_modal').modal('hide');
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
                        console.log("https://us-central1-gadigoda-dfc26.cloudfunctions.net/updatePackage", response);
                        editIndex = -1;
                        isEditOn = false;
                        update_packages_list();
                    },
                    error: function () {
                        alert("error");
                    }
                });
            }
            else alert("Your Plan Object is Empty, Something is wrong");
        }
        else {
            $('#create_new_package_modal').modal('hide');
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
                        console.log("https://us-central1-gadigoda-dfc26.cloudfunctions.net/createPackage", response);
                        update_packages_list();
                    },
                    error: function () {
                        alert("error");
                    }
                });
            }
            else {
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
                        console.log("https://us-central1-gadigoda-dfc26.cloudfunctions.net/createPackage", response);
                        update_packages_list();
                    },
                    error: function () {
                        alert("error");
                    }
                });
            }
        }
    }


};

var vehicle_plan_creation_form = function () {

    //localStorage.setItem('packages','');

    var data = $('#create_new_vehicle_modal_form').serializeArray().reduce(function (obj, item) {
        obj[item.name] = item.value;
        return obj;
    }, {});


    var go_ahead = true;
    if (!data.price_per_km) {
        go_ahead = false;
        alert("Please Fill All Details [price per km]");;
    }

    if (data.no_of_seats == 0) {
        go_ahead = false;
        alert("Please Fill All Details [No Of Seats]");;
    }

    if (Number(data.allowance_indicator) > 0) {
        if (data.allowance_cost_per_unit == 0) {
            go_ahead = false;
            alert("Please Fill Allowance Cost");;
        }
    }

    if (go_ahead) {
        $('#create_new_vehicle_modal').modal('hide');
        data.allowance_amount = Number(data.allowance_indicator) * Number(data.allowance_cost_per_unit);


        if (opened_plan.plans) {
            if (opened_vehicle_plan_index == -1) {
                opened_plan.plans.push(data);
            }
            else {
                opened_plan.plans[opened_vehicle_plan_index] = data;
                opened_vehicle_plan_index = -1;
            }
        }
        else {
            var plans = [];
            if (opened_vehicle_plan_index == -1) {
                plans.push(data);
            }
            else {
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
                console.log("https://us-central1-gadigoda-dfc26.cloudfunctions.net/updatePackage", response);
                update_packages_list();
            },
            error: function () {
                alert("error");
            }
        });
    }
};

function update_special_packages_list() {
    $("#plan-management-view").hide();
    $("#plan-loader").show();
    $.ajax({
        url: "https://us-central1-gadigoda-dfc26.cloudfunctions.net/getAllPackages",
        method: "POST", //First change type to method here
        success: function (response) {
            console.log("https://us-central1-gadigoda-dfc26.cloudfunctions.net/getAllPackages", response);
            received_plans = response;
            var data = response;
            //console.log('storage', data);
            var items = [];
            $.each(data, function (i, package) {
                if (package.isDeleted){

                }
                else if(package.special_plan) {
                    var special = '<li class="list-group-item list-group-item-action" name="' + i + '" id="' + package.id + '">' +
                        '<div class="d-flex w-100 justify-content-between">' +
                        '<h5 class="mb-1" style="cursor:pointer;" onclick="openplan(' + i + ')">' + package.pickup_location + ' To ' + package.drop_location +'<br>'+'<small>'+'Price:-'+' ₹'+package.price+'</small>'+
                        '</div>' +
                        '<div class="d-flex w-100" style="justify-content: end;margin-top:10px">' +
                         
                        '<span style="border-radius:5px!important;cursor: pointer;margin-right:5px!important;padding:5px!important; " id="' + i + '" onclick="delete_special_plan(' + i + ')" class="badge badge-danger badge-pill">Delete</span>' +
                        '<span style="border-radius:5px!important;cursor: pointer;margin-right:5px!important;padding:5px!important;" id="' + i + '"onclick="edit_special_plan(' + i + ')" class="badge badge-primary badge-pill" style="margin-right:5px;padding:5px;">Edit</span>' +
                        '</div>'
                    '<div class="d-flex w-100 justify-content-between">' +
                    '<small class="text-muted">date_1 : ' + package.date_1
                        '<small class="text-muted">date_2 : ' + package.date_2 + '<br>'
                    '<small class="text-muted">date_3 : ' + package.date_3 +
                        '<small class="text-muted">date_4 : ' + package.date_4 +
                        '<small class="text-muted">date_5 : ' + package.date_5 +
                        '<small class="text-muted">date_6 : ' + package.date_6 +
                        '<small class="text-muted">date_7 : ' + package.date_7 +
                        '<small class="text-muted">date_8 : ' + package.date_8 +
                        '<small class="text-muted">date_9 : ' + package.date_9 +
                        '<small class="text-muted">date_10 : ' + package.date_10 +
                        '<small class="text-muted">date_11 : ' + package.date_11 +
                        '<small class="text-muted">date_12 : ' + package.date_12 +
                        '</div>' +
                        +
                        '</li>';

                    // console.log(special);
                    items.push(special);
                }
            });
            document.getElementById("special_packages_list").innerHTML = "";
            $('#special_packages_list').append(items.join(''));

            isEditOn = false;
            editIndex = -1;
            opened_plan;
            opened_plan_index;
            opened_vehicle_plans = {};
            opened_vehicle_plan_index = -1;
            setup_vehicle_view();
            $("#plan-loader").hide();
            $("#plan-management-view").show();


        },
        error: function () {
            alert("error");
        }
    });


}
function update_packages_list() {
    $("#plan-management-view").hide();
    $("#plan-loader").show();
    $.ajax({
        url: "https://us-central1-gadigoda-dfc26.cloudfunctions.net/getAllPackages",
        method: "POST", //First change type to method here
        success: function (response) {
            console.log("https://us-central1-gadigoda-dfc26.cloudfunctions.net/getAllPackages", response);
            received_plans = response;
            var data = response;
            //console.log('storage', data);
            var items = [];
            $.each(data, function (i, package) {
                if (package.special_plan == "true") {
                }
                else if (package.special_plan) {
                }
               else if (package.isDeleted) {

                }
                else {
                    var li = '<li class="list-group-item list-group-item-action" name="' + i + '" id="' + package.id + '">' +
                        '<div class="d-flex w-100 justify-content-between">' +
                        '<h5 class="mb-1" style="cursor:pointer;" onclick="openplan(' + i + ')">' + package.name + '</h5>' +
                        '</div>' +
                        '<p class="mb-1">' + package.package_description + '</p>' +
                        '<div class="d-flex w-100 justify-content-between">' +
                        '<small class="text-muted">Billed : ' + package.kms_charged + 'Kms</small>' +
                        '<small class="text-muted">Alloted Kms : ' + package.alloted_kms + 'Kms.</small>' +
                        '<small class="text-muted">Alloted Time : ' + package.alloted_time + ' ' + package.alloted_time_unit + '</small>' +
                        '</div>' +
                        '<div class="d-flex w-100" style="justify-content: end;margin-top:10px">' +
                        '<span style="border-radius:5px!important;cursor: pointer;margin-right:5px!important;padding:5px!important; " id="' + i + '" onclick="deleteplan(' + i + ')" class="badge badge-danger badge-pill">Delete</span>' +
                        '<span style="border-radius:5px!important;cursor: pointer;margin-right:5px!important;padding:5px!important;" id="' + i + '"onclick="editplan(' + i + ')" class="badge badge-primary badge-pill" style="margin-right:5px;padding:5px;">Edit</span>' +
                        '</div>' +
                        '</li>';

                    // console.log(li)
                    items.push(li);
                }

            }); // close each()


            document.getElementById("packages_list").innerHTML = "";
            $('#packages_list').append(items.join(''));

            isEditOn = false;
            editIndex = -1;
            opened_plan;
            opened_plan_index;
            opened_vehicle_plans = {};
            opened_vehicle_plan_index = -1;
            setup_vehicle_view();
            $("#plan-loader").hide();
            $("#plan-management-view").show();


        },
        error: function () {
            alert("error");
        }
    });

}

//edit special packeges

function edit_special_plan(index) {

    if (received_plans) {
        var data = received_plans;
        var obj = data[index];

        Object.keys(obj).forEach(key => {
            $(`input[name="${key}"]`).val(obj[key]);
        })

        isEditOn = true;
        editIndex = index;
        alert("Editing " + index);
        $('#create_new_special_package_modal').modal('show');
    }

}

//delete special packages

function delete_special_plan(index) {
    if (received_plans[index]) {
        var data = received_plans[index];
        data.isDeleted = true;
        console.log(data);
        $("#plan-management-view").hide();
        $("#plan-loader").show();
        var data_packet = data;
        $.ajax({
            url: "https://us-central1-gadigoda-dfc26.cloudfunctions.net/updatePackage",
            method: "POST",
            data: data_packet,
            success: function (response) {
                alert("Successfully Deleted");
                console.log("https://us-central1-gadigoda-dfc26.cloudfunctions.net/updatePackage", response);
                $('#create_new_special_package_modal').modal('hide');
                location.reload();
                update_packages_list();
            },
            error: function () {
                alert("error");

            }
        });
    }
}

function editplan(index) {

    if (received_plans) {
        var data = received_plans;
        var obj = data[index];

        Object.keys(obj).forEach(key => {
            $(`input[name="${key}"]`).val(obj[key]);
            $(`select[name="${key}"]`).val(obj[key]);
            $(`textarea[name="${key}"]`).val(obj[key]);
        })

        isEditOn = true;
        editIndex = index;
        alert("Editing " + index);
        $('#create_new_package_modal').modal('show');
    }

}

function deleteplan(index) {
    if (received_plans[index]) {
        var data = received_plans[index];
        data.isDeleted = true;
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
                alert("Successfully Deleted");
                console.log("https://us-central1-gadigoda-dfc26.cloudfunctions.net/updatePackage", response);
                $('#create_new_vehicle_modal').modal('hide');
                update_packages_list();
            },
            error: function () {
                alert("error");

            }
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

        $('#price_per_km_input').bind('input', function () {
            var charge = ($(this).val());
            $("#base_amount_input").val(charge * opened_plan.kms_charged);
            update_plan_total_min_price(get_base_fare(), get_allowance_fare(), 0);
        });

        $('#allowance_amt_input').bind('input', function () {
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
        $("#allowance_amt_input").prop('readonly', true);
        $("#allowance_amt_input").val(allowance_index);
    }
    else {
        $("#allowance_amt_input").prop('readonly', false);
    }

    update_plan_total_min_price(get_base_fare(), get_allowance_fare(), 0);
}

function get_allowance_fare() {
    return Number($("#allowance_amt_input").val()) * allowance_index;
}

function get_base_fare() {
    return Number($("#base_amount_input").val());
}

function get_alloted_km() {

}

function update_plan_total_min_price(base_amount, allowance_amount, insurance_amount) {
    //console.log(base_amount,allowance_amount,insurance_amount);
    var total_fare = (Number(base_amount)) + Number(allowance_amount) + Number(insurance_amount);
    $("#parent-plan-baseprice-input").val(total_fare);
}

function setup_vehicle_view() {
    if (opened_plan == null) {
        $("#no_vehicles_layout_header").text("No Package Selected.");
        $("#no_vehicles_layout_action_button").hide();
        $("#add_vehicle-package-button").hide();
    }
    else {
        console.log(opened_plan);
        $("#add_vehicle-package-button").show();
        if (opened_plan.plans) {
            if (opened_plan.plans.length > 0) {
                $("#no_vehicles_layout").hide();
                $("#vechicles_list_ul").show();
                populate_vehicles_list(opened_plan.plans);
            }
            else {
                $("#no_vehicles_layout").show();
                $("#no_vehicles_layout_header").text("No Cars Available.");
                $("#no_vehicles_layout_action_button").show();
                $("#vechicles_list_ul").hide();
            }

        }
        else {
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
        $('#vechicles_list_ul').append(
            "<li class='list-group-item'>" +
            '<div style="display:inline-flex;width: -webkit-fill-available;">' +
            '<div style="width: -webkit-fill-available;">' + plans[i].selected_vehicle +
            '</div>' +
            '<div style="display: inline-flex;">' +
            '<span style="border-radius:5px!important;cursor: pointer;margin-right:5px!important;padding:5px!important; " id="' + i + '" class="badge badge-danger badge-pill"> ₹ ' + plans[i].plan_baseprice + '</span>' +
            '<span style="border-radius:5px!important;cursor: pointer;margin-right:5px!important;padding:5px!important;" id="' + i + '"onclick="editvehicleplan(' + i + ')" class="badge badge-primary badge-pill" style="margin-right:5px;padding:5px;">Edit</span>' +
            '</div>' +
            '</div>' + "</li>");
    }
}

function editvehicleplan(i) {
    var plan = opened_vehicle_plans[i];
    opened_vehicle_plan_index = i;
    console.log(plan);
    Object.keys(plan).forEach(key => {
        $(`input[name="${key}"]`).val(plan[key]);
        $(`select[name="${key}"]`).val(plan[key]);
        $(`textarea[name="${key}"]`).val(plan[key]);
    });

    $('#create_new_vehicle_modal').modal('show');

}

var capture_new_special_apckage_form = function () {
    var data = $('#special_package_creation_form').serializeArray().reduce(function (obj, item) {
        obj[item.name] = item.value;
        return obj;
    }, {});

    data.id = "special id";
    data.special_package = true;
    console.log(data);


    var go_ahead = true;
    if (!data.pickup_location) {
        go_ahead = false;
        alert("Please Fill your Pickup Location");;



        if (!data.drop_location) {
            go_ahead = false;
            alert("Please Fill your Drop Location ");;
        }
        if (!data.date_1) {
            go_ahead = false;
            alert("Please Fill All Details [Alloted_Date]");;
        }

        if (!data.date_2) {
            go_ahead = false;
            alert("Please Fill All Details [Alloted_Date]");;
        }

        if (!data.date_3) {
            go_ahead = false;
            alert("Please Fill All Details [Alloted_Date]");;
        }

        if (!data.date_4) {
            go_ahead = false;
            alert("Please Fill All Details [Alloted_Date]");;
        }

        if (!data.date_5) {
            go_ahead = false;
            alert("Please Fill All Details [Alloted_Date]");;
        }

        if (!data.date_6) {
            go_ahead = false;
            alert("Please Fill All Details [Alloted_Date]");;
        }
        if (!data.date_7) {
            go_ahead = false;
            alert("Please Fill All Details [Alloted_Date]");;
        }
        if (!data.date_8) {
            go_ahead = false;
            alert("Please Fill All Details [Alloted_Date]");;
        }
        if (!data.date_9) {
            go_ahead = false;
            alert("Please Fill All Details [Alloted_Date]");;
        }
        if (!data.date_10) {
            go_ahead = false;
            alert("Please Fill All Details [Alloted_Date]");;
        }
        if (!data.date_11) {
            go_ahead = false;
            alert("Please Fill All Details [Alloted_Date]");;
        }
        if (!data.date_12) {
            go_ahead = false;
            alert("Please Fill All Details [Alloted_Date]");;
        }
        if (!data.price_per_km) {
            go_ahead = false;
            alert("Please Fill All Details [name]");;
        }
    }
    if (go_ahead) {
        $('#create_new_special_package_modal').modal('hide');
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
                data_packet.special_plan = true;
                $.ajax({
                    url: "https://us-central1-gadigoda-dfc26.cloudfunctions.net/createPackage",
                    method: "POST",
                    data: data_packet,
                    success: function (response) {
                        //received_plans=response;
                        //alert("Successfully Edited");
                        console.log("https://us-central1-gadigoda-dfc26.cloudfunctions.net/createPackage", response);
                        editIndex = -1;
                        isEditOn = false;
                        location.reload();
                        update_packages_list();
                    },
                    error: function () {
                        alert("error");
                    }
                });
            }
            else alert("Your Plan Object is Empty, Something is wrong");
        }
        else {

            $('#create_new_package_modal').modal('hide');
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
                data_packet.special_plan = true;
                $.ajax({
                    url: "https://us-central1-gadigoda-dfc26.cloudfunctions.net/createPackage",
                    method: "POST", //First change type to method here
                    data: data_packet,
                    success: function (response) {
                        //alert("Successfully Created");
                        console.log("https://us-central1-gadigoda-dfc26.cloudfunctions.net/createPackage", response);
                        update_packages_list();
                        location.reload();
                    },
                    error: function () {
                        alert("error");
                    }
                });
            }
            else {
                var packages = [];
                packages.push(data);
                var data_packet = data;
                $("#plan-management-view").hide();
                $("#plan-loader").show();
                alert("Sending to Server");
                $.ajax({
                    url: "https://us-central1-gadigoda-dfc26.cloudfunctions.net/createPackage",
                    method: "POST",
                    data: data_packet,
                    success: function (response) {
                        console.log("https://us-central1-gadigoda-dfc26.cloudfunctions.net/createPackage", response);
                        location.reload();  
                        update_packages_list();
                    },
                    error: function () {
                        alert("error");
                    }
                });
            }
        }
    }
};