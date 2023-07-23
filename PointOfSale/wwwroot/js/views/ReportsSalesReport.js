let tableData;

$(document).ready(function () {

    $("#txtStartDate").datepicker({ dateFormat: 'dd/mm/yy' });
    $("#txtEndDate").datepicker({ dateFormat: 'dd/mm/yy' });

    tableData = $('#tbdata').DataTable({
        "processing": true,
        "ajax": {
            "url": "/Reports/ReportSale?startDate=01/01/1991&endDate=01/01/1991",
            "type": "GET",
            "datatype": "json"
        },
        "columns": [
            { "data": "registrationDate" },
            { "data": "saleNumber" },
            { "data": "documentType" },
            { "data": "documentClient" },
            { "data": "clientName" },
            { "data": "subTotalSale" },
            { "data": "taxTotalSale" },
            { "data": "totalSale" },
            { "data": "product" },
            { "data": "quantity" },
            { "data": "price" },
            { "data": "total" }
        ],
        order: [[1, "desc"]],
        "scrollX": true,
        dom: "Bfrtip",
        buttons: [
            {
                text: 'Export Excel',
                extend: 'excelHtml5',
                title: '',
                filename: 'Sales Report',
            }, 'pageLength'
        ]
    });

})



$("#btnSearch").click(function () {

    if ($("#txtStartDate").val().trim() == "" || $("#txtEndDate").val().trim() == "") {
        toastr.warning("", "You must enter start and end date");
        return;
    }

    var new_url = `/Reports/ReportSale?startDate=${$("#txtStartDate").val().trim()}&endDate=${$("#txtEndDate").val().trim()}`

    tableData.ajax.url(new_url).load();
})
