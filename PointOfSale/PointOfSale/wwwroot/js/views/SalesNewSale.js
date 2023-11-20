let ProductsForSale = [];

$(document).ready(function () {

    fetch("/Sales/ListTypeDocumentSale")
        .then(response => {
            return response.ok ? response.json() : Promise.reject(response);
        }).then(responseJson => {
            if (responseJson.length > 0) {
                responseJson.forEach((item) => {
                    $("#cboTypeDocumentSale").append(
                        $("<option>").val(item.idTypeDocumentSale).text(item.description)
                    );
                });
            }
        });


    $("#cboSearchProduct").select2({
        ajax: {
            url: "/Sales/GetProducts",
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            delay: 250,
            data: function (params) {
                return {
                    search: params.term
                };
            },
            processResults: function (data) {
                return {
                    results: data.map((item) => (
                        {
                            id: item.idProduct,
                            text: item.description,
                            brand: item.brand,
                            category: item.nameCategory,
                            photoBase64: item.photoBase64,
                            price: parseFloat(item.price)
                        }
                    ))
                };
            }
        },
        placeholder: 'Search product...',
        minimumInputLength: 1,
        templateResult: formatResults
    });

    
    
});


// WORKING BARCODE READER

$(document).ready(function (event) {

    $("#write-btn").click(function (e) {
        $("#scanner_input").removeAttr('readonly');
      
    });
    $("#scan").click(function (e) {
        $("#scanner_input").attr('readonly', true);
       
    });
    //barcode scanner code//
    Quagga.onDetected(function (result) {
        if (result.codeResult.code) {
            //$('#scanner_input').val(result.codeResult.code);

            var barcodeValue = result.codeResult.code;

         
            

            Quagga.stop();
            setTimeout(function () {
                $('#livestream_scanner').modal('hide');
                $('.modal-backdrop').remove(); // Remove the black screen backdrop
            }, 1000);

            // Open the select2-search dropdown
            $("#cboSearchProduct").select2('open');

            // Set the value of the barcode scan result in the text field
            $('.select2-search__field').val(barcodeValue).trigger('input');
        }
    });
    // end barcode scanner code


})

   


    

function formatResults(data) {

    if (data.loading)
        return data.text;

    var container = $(
        `<table width="100%">
            <tr>
                <td style="width:60px">
                    <img style="height:60px;width:60px;margin-right:10px" src="data:image/png;base64,${data.photoBase64}"/>
                </td>
                <td>
                    <p style="font-weight: bolder;margin:2px">${data.brand}</p>
                    <p style="margin:2px">${data.text}</p>
                </td>
            </tr>
         </table>`
    );

    return container;
}


$(document).on('select2:open', () => {
    document.querySelector('.select2-search__field').focus();
});



$('#cboSearchProduct').on('select2:select', function (e) {
    var data = e.params.data;

    let product_found = ProductsForSale.filter(prod => prod.idProduct == data.id)
    if (product_found.length > 0) {
        $("#cboSearchProduct").val("").trigger('change');
        toastr.warning("", "The product has already been added");
        return false
    }

    
    swal({
        title: data.brand,
        text: data.text,
        type: "input",
        showCancelButton: true,
        closeOnConfirm: false,
        inputPlaceholder: "Enter quantity",
        inputValue: '1', // Set the default quantity to 1
        inputValidator: function (value) {
            // Check if the entered value is a valid number
            if (!/^\d+$/.test(value)) {
                return 'You must enter a numeric value';
            }

            // Check if the value is a whole number
            if (parseInt(value) != parseFloat(value)) {
                return 'Decimal values are not allowed';
            }

            return null; // Input is valid
        }

       
    }, function (value) {
        //if (value === false) return false;

        
        if (value === false || value === null) {
            // If the user clicks "Cancel" or closes the input without entering a value
            $("#cboSearchProduct").val("").trigger('change');
            return false;
        }


        let quantity = parseInt(value);
        if (isNaN(quantity) || quantity <= 0) {
            toastr.warning("", "Quantity must be a positive number");
            return false;
        }

        if (value === "") {
            toastr.warning("", "You need to enter the amount");
            return false
        }


        if (isNaN(parseInt(value))) {
            toastr.warning("", "You must enter a numeric value");
            return false
        }


        let product = {
            idProduct: data.id,
            brandProduct: data.brand,
            descriptionProduct: data.text,
            categoryProducty: data.category,
            quantity: parseInt(value),
            price: data.price.toString(),
            total: (parseFloat(value) * data.price).toString()
        }

        ProductsForSale.push(product)
        showProducts_Prices();
        displayValue();
        $("#cboSearchProduct").val("").trigger('change');
        swal.close();
        

    });
    

   
});
function showProducts_Prices() {
    let TaxValue = 12;

    let total = 0;
    let tax = 0;
    let subtotal = 0;
    let percentage = TaxValue / 100;

    let cash = 0;
    let change = 0;
    

    $("#tbProduct tbody").html("")

    ProductsForSale.forEach((item) => {

        total = total + parseFloat(item.total);

      
        $("#tbProduct tbody").append(
            $("<tr>").append(
                $("<td>").append(
                    $("<button>").addClass("btn btn-danger btn-delete btn-sm").append(
                        $("<i>").addClass("mdi mdi-trash-can")
                    ).data("idProduct", item.idProduct)
                ),
                $("<td>").text(item.descriptionProduct),
                $("<td>").text(item.quantity),
                $("<td>").text(item.price),
                $("<td>").text(item.total)
            )
        )

    })

    subtotal = total / (1 + percentage);
    tax = total - subtotal;

    
   
    $("#txtSubTotal").val(subtotal.toFixed(2))
    $("#txtTotalTaxes").val(tax.toFixed(2))
    $("#txtTotal").val(total.toFixed(2))
    $("#txtCash").val(cash.toFixed(2))
   
    $("#txtChange").val(change.toFixed(2))
    




}



$(document).on("click", "button.btn-delete", function () {
    const _idproduct = $(this).data("idProduct")

    ProductsForSale = ProductsForSale.filter(p => p.idProduct != _idproduct)

    showProducts_Prices()
})

// Add an event listener to txtCash for input events
$("#txtCash").on('input', function (e) {
    const inputText = e.target.value;

    // Remove non-numeric characters from the input
    const numericInput = inputText.replace(/[^0-9.]/g, '');

    // Update the value of txtCash with the cleaned numeric input
    $(this).val(numericInput);
});
// Allow only numeric input for txtCash
$("#txtCash").on('input', function () {
    var numericInput = $(this).val().replace(/[^0-9.]/g, '');
    $(this).val(numericInput);
});

// Allow only numeric input for txtCash
$("#txtCash").on('input', function () {
    var inputText = $(this).val();

    // Remove non-numeric characters
    var numericInput = inputText.replace(/[^0-9.]/g, '');

    // Ensure the first character is not a dot (.)
    if (numericInput.startsWith('.')) {
        numericInput = numericInput.slice(1);
    }

    // Ensure there is only one dot (.) in the input
    var dotIndex = numericInput.indexOf('.');
    if (dotIndex !== -1) {
        numericInput = numericInput.slice(0, dotIndex + 1) + numericInput.slice(dotIndex + 1).replace(/\./g, '');
    }

    $(this).val(numericInput);
});


// Allow only numeric input for txtDocumentClient and limit to 11 digits
$("#txtDocumentClient").on('input', function () {
    var numericInput = $(this).val().replace(/[^0-9]/g, '');
    var limitedInput = numericInput.slice(0, 11);
    $(this).val(limitedInput);
});


$("#txtCash").on('input', function () {
    var Total = parseFloat($('#txtTotal').val());
    var Cash = parseFloat($(this).val());
    var Result = 0.00;

    if (isNaN(Cash) || Cash < 0) {
        // Handle invalid input, such as non-numeric or negative values
        $('#txtChange').val('Invalid input');
        return;
    }

    Result = Cash - Total;
    $('#txtChange').val(Result.toFixed(2)); // Display result with two decimal places
});

$("#txtDocumentClient").on('input', function () {
    var maxLength = 11;
    var inputValue = $(this).val();

    // Remove non-numeric characters
    var numericInput = inputValue.replace(/[^0-9]/g, '');

    // Limit the length to 11 digits
    var limitedInput = numericInput.slice(0, maxLength);

    // Update the value of txtDocumentClient with the limited input
    $(this).val(limitedInput);
});


$("#btnFinalizeSale").click(function () {


    if (ProductsForSale.length < 1) {
        toastr.warning("", "You must enter products");
        return;
    }
    const txtCash = $("#txtCash").val();  // Get the value of txtCash input field

    // Check for blank or non-numeric input in txtCash
    if (txtCash.trim() === "" || isNaN(parseFloat(txtCash))) {
        toastr.warning("", "Please enter a valid numeric cash amount");
        return;
    }

    const total = parseFloat($("#txtTotal").val());
    const cash = parseFloat(txtCash);

    if (cash < total) {
        toastr.warning("", "Insufficient cash amount");
        return;
    }

    const clientName = $("#txtNameClient").val();

    if (clientName.trim() === "") {
        toastr.warning("", "Client name cannot be blank");
        return;
    }


    const vmDetailSale = ProductsForSale;

    const sale = {
        idTypeDocumentSale: $("#cboTypeDocumentSale").val(),
        customerDocument: $("#txtDocumentClient").val(),
        clientName: $("#txtNameClient").val(),
        subtotal: $("#txtSubTotal").val(),
        totalTaxes: $("#txtTotalTaxes").val(),
        total: $("#txtTotal").val(),
        cash: $("#txtCash").val(),
        change: $("#txtChange").val(),

        detailSales: vmDetailSale
    }



    $("#btnFinalizeSale").closest("div.card-body").LoadingOverlay("show")

    fetch("/Sales/RegisterSale", {
        method: "POST",
        headers: { 'Content-Type': 'application/json;charset=utf-8' },
        body: JSON.stringify(sale)
    }).then(response => {

        $("#btnFinalizeSale").closest("div.card-body").LoadingOverlay("hide")
        return response.ok ? response.json() : Promise.reject(response);
    }).then(responseJson => {


        if (responseJson.state) {

            ProductsForSale = [];
            showProducts_Prices();
            displayValue();
            $("#txtDocumentClient").val("");
            $("#txtNameClient").val("");
            $("#cboTypeDocumentSale").val($("#cboTypeDocumentSale option:first").val());

            swal("Registered!", `Sale Number : ${responseJson.object.saleNumber}`, "success");
            generatePDF(responseJson.object.saleNumber);

        } else {
            swal("We're sorry", "The sale could not be registered", "error");
        }
    }).catch((error) => {
        $("#btnFinalizeSale").closest("div.card-body").LoadingOverlay("hide")
    })


})

function generatePDF(saleNumber) {
    // Make an AJAX request to the server to generate the PDF.
    fetch(`/Sales/ShowPDFSale?saleNumber=${saleNumber}`)
        .then(response => {
            return response.ok ? response.blob() : Promise.reject(response);
        })
        .then(pdfBlob => {
            // Create a Blob URL for the PDF.
            const pdfUrl = URL.createObjectURL(pdfBlob);

            // Open the PDF in a new tab/window.
            window.open(pdfUrl, '_blank');
        })
        .catch(error => {
            console.error("Error generating or opening PDF", error);
            // Handle any errors here.
        });
}