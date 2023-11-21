/*const SEARCH_VIEW = {

    searchDate: () => {

        $("#txtStartDate").val("");
        $("#txtEndDate").val("");
        $("#txtSaleNumber").val("");

        $(".search-date").show()
        $(".search-sale").hide()
    },
    searchSale: () => {

        $("#txtStartDate").val("");
        $("#txtEndDate").val("");
        $("#txtSaleNumber").val("");

        $(".search-sale").show()
        $(".search-date").hide()
    }

}
let currentPage = 1; // Track the current page

$(document).ready(function () {
    SEARCH_VIEW["searchDate"]();

    $("#txtStartDate").datepicker({ dateFormat: 'dd/mm/yy' });
    $("#txtEndDate").datepicker({ dateFormat: 'dd/mm/yy' });


})

$("#cboSearchBy").change(function () {

    if ($("#cboSearchBy").val() == "date") {
        SEARCH_VIEW["searchDate"]();
    } else {
        SEARCH_VIEW["searchSale"]();
    }


});




$("#btnSearch").click(function () {

    if ($("#cboSearchBy").val() == "date") {

        if ($("#txtStartDate").val().trim() == "" || $("#txtEndDate").val().trim() == "") {
            toastr.warning("", "You must enter start and end date");
            return;
        }
    } else {
        if ($("#txtSaleNumberSearch").val().trim() == "") {
            toastr.warning("", "You must enter the sales number");
            return;
        }
    }

    let saleNumber = $("#txtSaleNumberSearch").val();
    let startDate = $("#txtStartDate").val();
    let endDate = $("#txtEndDate").val();

    $(".card-body").find("div.row").LoadingOverlay("show")

    fetch(`/Sales/History?saleNumber=${saleNumber}&startDate=${startDate}&endDate=${endDate}`)
        .then(response => {
            $(".card-body").find("div.row").LoadingOverlay("hide")
            return response.ok ? response.json() : Promise.reject(response);
        }).then(responseJson => {
            $("#tbsale tbody").html("");

            if (responseJson.length > 0) {

                responseJson.forEach((sale) => {
                    $("#tbsale tbody").append(
                        $("<tr>").append(
                            $("<td>").text(sale.registrationDate),
                            $("<td>").text(sale.saleNumber),
                            $("<td>").text(sale.typeDocumentSale),
                            $("<td>").text(sale.customerDocument),
                            $("<td>").text(sale.clientName),
                            $("<td>").text(sale.total),
                            $("<td>").text(sale.cash),
                            $("<td>").text(sale.change),

                            $("<td>").append(
                                $("<button>").addClass("btn btn-info btn-sm").append(
                                    $("<i>").addClass("mdi mdi-eye")
                                ).data("sale", sale)
                            )
                        )
                    )

                });
            }
        })
})


$("#tbsale tbody").on("click", ".btn-info", function () {

    let d = $(this).data("sale")
    console.log(d)
    $("#txtRegistrationDate").val(d.registrationDate)
    $("#txtSaleNumber").val(d.saleNumber)
    $("#txtRegisterUser").val(d.users)
    $("#txtDocumentType").val(d.typeDocumentSale)
    $("#txtClientDocument").val(d.customerDocument)
    $("#txtClientName").val(d.clientName)
    $("#txtSubTotal").val(d.subtotal)
    $("#txtTaxes").val(d.totalTaxes)
    $("#txtTotal").val(d.total)
    $("#txtCash").val(d.cash)
    $("#txtChange").val(d.change)

    $("#tbProducts tbody").html("")

    var Cash = document.getElementById('txtCash').value;
    var Change = document.getElementById('txtChange').value;
    d.detailSales.forEach((item) => {
        $("#tbProducts tbody").append(
            $("<tr>").append(
                $("<td>").text(item.descriptionProduct),
                $("<td>").text(item.quantity),
                $("<td>").text(item.price),
                $("<td>").text(item.total),
                $("<td>").text(Cash),
                $("<td>").text(Change)
            )
        )
    })

    $("#linkPrint").attr("href", `/Sales/ShowPDFSale?saleNumber=${d.saleNumber}`);

    $("#modalData").modal("show");
})

*/

let tableData;

$(document).ready(function () {
    // Initialize date pickers
    $("#txtStartDate").datepicker({ dateFormat: 'dd/mm/yy' });
    $("#txtEndDate").datepicker({ dateFormat: 'dd/mm/yy' });

    // Initialize DataTable
    tableData = $('#tbsale').DataTable({
        "processing": true,
        "ajax": {
            "url": "/Sales/History?startDate=01/01/1991&endDate=01/01/1991",
            "type": "GET",
            "datatype": "json",
            "data": function (d) {
                d.startDate = formatDate($("#txtStartDate").val());
                d.endDate = formatDate($("#txtEndDate").val());
            },
            "dataSrc": "",
            "error": function (xhr, error, thrown) {
                console.log("DataTables error:", error);
                console.log("Server response:", xhr.responseText);
            }
        },
        "columns": [
            { "data": "registrationDate" },
            { "data": "saleNumber" },
            { "data": "typeDocumentSale" },
            { "data": "customerDocument" },
            { "data": "clientName" },
            { "data": "total" },
            { "data": "cash" },
            { "data": "change" },
            
            

        ],

        order: [[1, "desc"]],
        "scrollX": true,
        dom: "Bfrtip",
        buttons: [
            {
                text: 'Export Excel',
                extend: 'excelHtml5',
                filename: 'Sales History',
                exportOptions: {
                    columns: [2, 3, 4, 5, 6]
                }
            }, 'pageLength'
        ]

    });


    // Search button click event
    $("#btnSearch").click(function () {
        // Check for empty start and end date
        if ($("#txtStartDate").val().trim() == "" || $("#txtEndDate").val().trim() == "") {
            toastr.warning("", "You must enter start and end date");
            return;
        }
        var new_url = `/Sales/History?startDate=${$("#txtStartDate").val().trim()}&endDate=${$("#txtEndDate").val().trim()}`

        tableData.ajax.url(new_url).load();
        // Reload data with new parameters for pagination
        tableData.ajax.reload();
    });


});



// Function to format date as "dd/mm/yyyy"
function formatDate(dateString) {
    var parts = dateString.split("/");
    return parts[2] + "-" + parts[1] + "-" + parts[0];
}