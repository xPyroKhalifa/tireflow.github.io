let tableData;
let rowSelected;

const BASIC_MODEL = {
    idUsers: 0,
    name: "",
    email: "",
    phone: "",
    idRol: 0,
    password:"",
    isActive: 1,
    photo: ""
}


$(document).ready(function () {

    fetch("/Admin/GetRoles")
        .then(response => {
            return response.ok ? response.json() : Promise.reject(response);
        }).then(responseJson => {
            if (responseJson.length > 0) {
                responseJson.forEach((item) => {
                    $("#cboRol").append(
                        $("<option>").val(item.idRol).text(item.description)
                    )
                });
            }
        })


    tableData = $("#tbData").DataTable({
        responsive: true,
        "ajax": {
            "url": "/Admin/GetUsers",
            "type": "GET",
            "datatype": "json"
        },
        "columns": [
            {
                "data": "idUsers",
                "visible": false,
                "searchable": false
            },
            {
                "data": "photoBase64", render: function (data) {
                    return `<img style="height:60px;" src="data:image/png;base64,${data}" class="rounded mx-auto d-block" />`;
                }
            },
            { "data": "name" },
            { "data": "email" },
            { "data": "phone" },
            { "data": "nameRol" },
            {
                "data": "isActive", render: function (data) {
                    if (data == 1)
                        return '<span class="badge badge-info">Active</span>';
                    else
                        return '<span class="badge badge-danger">Inactive</span>';
                }
            },
            {
                "defaultContent": '<button class="btn btn-primary btn-edit btn-sm mr-2"><i class="mdi mdi-pencil"></i></button>' +
                    '<button class="btn btn-danger btn-delete btn-sm"><i class="mdi mdi-trash-can"></i></button>',
                "orderable": false,
                "searchable": false,
                "width": "80px"
            }
        ],
        order: [[0, "desc"]],
        dom: "Bfrtip",
        buttons: [
            {
                text: 'Export Excel',
                extend: 'excelHtml5',
                title: '',
                filename: 'Report Users',
                exportOptions: {
                    columns: [2, 3, 4, 5, 6]
                }
            }, 'pageLength'
        ]
    });
})

const openModal = (model = BASIC_MODEL ) => {
    $("#txtId").val(model.idUsers);
    $("#txtName").val(model.name);
    $("#txtEmail").val(model.email);
    $("#txtPhone").val(model.phone);
    $("#cboRol").val(model.idRol == 0 ? $("#cboRol option:first").val() : model.idRol);
    $("#cboState").val(model.isActive);
    $("#txtPassWord").val(model.password);
    $("#txtPhoto").val("");
    $("#imgUser").attr("src", `data:image/png;base64,${model.photoBase64}`);

    $("#modalData").modal("show")

}

$("#btnNewUser").on("click", function () {
    openModal()
})



$("#btnSave").on("click", function () {

    const emailInput = $("#txtEmail").val().trim();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(emailInput)) {
        toastr.warning("Please enter a valid email address.", "");
        $("#txtEmail").focus();
        return;
    }

    const inputs = $("input.input-validate").serializeArray();
    const inputs_without_value = inputs.filter((item) => item.value.trim() == "");

    if (inputs_without_value.length > 0) {
        const msg = `You must complete the field: "${inputs_without_value[0].name}"`;
        toastr.warning(msg, "");
        $(`input[name="${inputs_without_value[0].name}"]`).focus();
        return;
    }

    const model = structuredClone(BASIC_MODEL);
    model["idUsers"] = parseInt($("#txtId").val());
    model["name"] = $("#txtName").val();
    model["email"] = $("#txtEmail").val();
    model["phone"] = $("#txtPhone").val();
    model["idRol"] = $("#cboRol").val();
    model["password"] = $("#txtPassWord").val();
    model["isActive"] = $("#cboState").val();
    const inputPhoto = document.getElementById('txtPhoto');

    // Check if a photo is provided
    if (inputPhoto.files.length > 0) {
        const file = inputPhoto.files[0];

        // Check if the selected file is an image
        if (isImageFile(file)) {
            const formData = new FormData();
            formData.append('photo', file);
            formData.append('model', JSON.stringify(model));

            $("#modalData").find("div.modal-content").LoadingOverlay("show");

            if (model.idUsers == 0) {
                fetch("/Admin/CreateUser", {
                    method: "POST",
                    body: formData
                }).then(response => {
                    $("#modalData").find("div.modal-content").LoadingOverlay("hide");
                    return response.ok ? response.json() : Promise.reject(response);
                }).then(responseJson => {
                    if (responseJson.state) {
                        tableData.row.add(responseJson.object).draw(false);
                        $("#modalData").modal("hide");
                        swal("Successful!", "The user was created", "success");
                    } else {
                        swal("We're sorry", responseJson.message, "error");
                    }
                }).catch((error) => {
                    $("#modalData").find("div.modal-content").LoadingOverlay("hide");
                });
            } else {
                fetch("/Admin/UpdateUser", {
                    method: "PUT",
                    body: formData
                }).then(response => {
                    $("#modalData").find("div.modal-content").LoadingOverlay("hide");
                    return response.ok ? response.json() : Promise.reject(response);
                }).then(responseJson => {
                    if (responseJson.state) {
                        tableData.row(rowSelected).data(responseJson.object).draw(false);
                        rowSelected = null;
                        $("#modalData").modal("hide");
                        swal("Successful!", "The user was modified", "success");
                    } else {
                        swal("We're sorry", responseJson.message, "error");
                    }
                }).catch((error) => {
                    $("#modalData").find("div.modal-content").LoadingOverlay("hide");
                });
            }
        } else {
            toastr.warning("Please select a valid image file.", "");
        }
    } else {
        saveUser(model);
    }
});

// Function to check if a file is an image
function isImageFile(file) {
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif'];

    // Check if the file type is in the allowed image types array
    if (allowedImageTypes.includes(file.type)) {
        // Additional check to ensure the file has an image extension
        const fileName = file.name.toLowerCase();
        return /\.(jpg|jpeg|png|gif)$/i.test(fileName);
    }

    return false;
}

function saveUser(model) {
    // Save the user data without a photo
    const formData = new FormData();
    formData.append('model', JSON.stringify(model));

    $("#modalData").find("div.modal-content").LoadingOverlay("show");

    const url = model.idUsers === 0 ? "/Admin/CreateUser" : "/Admin/UpdateUser";

    fetch(url, {
        method: model.idUsers === 0 ? "POST" : "PUT",
        body: formData,
    })
        .then(response => {
            $("#modalData").find("div.modal-content").LoadingOverlay("hide");
            return response.ok ? response.json() : Promise.reject(response);
        })
        .then(responseJson => {
            if (responseJson.state) {
                const successMessage = model.idUsers === 0 ? "The user was created" : "The user was modified";
                if (model.idUsers === 0) {
                    tableData.row.add(responseJson.object).draw(false);
                } else {
                    tableData.row(rowSelected).data(responseJson.object).draw(false);
                    rowSelected = null;
                }
                $("#modalData").modal("hide");
                swal("Successful!", successMessage, "success");
            } else {
                swal("We're sorry", responseJson.message, "error");
            }
        })
        .catch((error) => {
            $("#modalData").find("div.modal-content").LoadingOverlay("hide");
        });
}


$("#tbData tbody").on("click", ".btn-edit", function () {

    if ($(this).closest('tr').hasClass('child')) {
        rowSelected = $(this).closest('tr').prev();
    } else {
        rowSelected = $(this).closest('tr');
    }

    const data = tableData.row(rowSelected).data();

    openModal(data);
})



$("#tbData tbody").on("click", ".btn-delete", function () {

    let row;

    if ($(this).closest('tr').hasClass('child')) {
        row = $(this).closest('tr').prev();
    } else {
        row = $(this).closest('tr');
    }
    const data = tableData.row(row).data();

    swal({
        title: "Are you sure?",
        text: `Delete the user "${data.name}"`,
        type: "warning",
        showCancelButton: true,
        confirmButtonClass: "btn-danger",
        confirmButtonText: "Yes, delete",
        cancelButtonText: "No, cancel",
        closeOnConfirm: false,
        closeOnCancel: true
    },
        function (respuesta) {

            if (respuesta) {

                $(".showSweetAlert").LoadingOverlay("show")

                fetch(`/Admin/DeleteUser?IdUser=${data.idUsers}`, {
                    method: "DELETE"
                }).then(response => {
                    $(".showSweetAlert").LoadingOverlay("hide")
                    return response.ok ? response.json() : Promise.reject(response);
                }).then(responseJson => {
                    if (responseJson.state) {

                        tableData.row(row).remove().draw();
                        swal("Successful!", "User was deleted", "success");

                    } else {
                        swal("We're sorry", responseJson.message, "error");
                    }
                })
                    .catch((error) => {
                        $(".showSweetAlert").LoadingOverlay("hide")
                    })
            }
        });
})