$(document).ready(function () {

    $("div.container-fluid").LoadingOverlay("show")

    fetch("/Admin/GetSummary")
        .then(response => {
            $("div.container-fluid").LoadingOverlay("hide")
            return response.ok ? response.json() : Promise.reject(response);
        }).then(responseJson => {

            if (responseJson.state) {

                let d = responseJson.object;

                $("#totalSale").text(d.totalSales);
                $("#totalIncome").text(d.totalIncome)
                $("#totalProducts").text(d.totalProducts)
                $("#totalCategories").text(d.totalCategories)

                let barchart_labels;
                let barchar_data;
                if (d.salesLastWeek.length > 0) {
                    barchart_labels = d.salesLastWeek.map((item) => { return item.date })
                    barchar_data = d.salesLastWeek.map((item) => { return item.total })
                } else {
                    barchart_labels = ["without results"]
                    barchar_data = [0]
                }

                let piechart_labels;
                let piechart_data;
                if (d.productsTopLastWeek.length > 0) {
                    piechart_labels = d.productsTopLastWeek.map((item) => { return item.product })
                    piechart_data = d.productsTopLastWeek.map((item) => { return item.quantity })
                } else {
                    piechart_labels = ["without results"];
                    piechart_data = [0];
                }

                var controlSale = document.getElementById("charSales");
                var myBarChart = new Chart(controlSale, {
                    type: 'bar',
                    data: {
                        labels: barchart_labels,
                        datasets: [{
                            label: "Quantity",
                            backgroundColor: "#4e73df",
                            hoverBackgroundColor: "#2e59d9",
                            borderColor: "#4e73df",
                            data: barchar_data,
                        }],
                    },
                    options: {
                        maintainAspectRatio: false,
                        legend: {
                            display: false
                        },
                        scales: {
                            xAxes: [{
                                gridLines: {
                                    display: false,
                                    drawBorder: false
                                },
                                maxBarThickness: 50,
                            }],
                            yAxes: [{
                                ticks: {
                                    min: 0,
                                    maxTicksLimit: 5
                                }
                            }],
                        },
                    }
                });

                let controlProduct = document.getElementById("charProducts");
                let myPieChart = new Chart(controlProduct, {
                    type: 'doughnut',
                    data: {
                        labels: piechart_labels,
                        datasets: [{
                            data: piechart_data,
                            backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc', "#FF785B"],
                            hoverBackgroundColor: ['#2e59d9', '#17a673', '#2c9faf', "#FF5733"],
                            hoverBorderColor: "rgba(234, 236, 244, 1)",
                        }],
                    },
                    options: {
                        maintainAspectRatio: false,
                        tooltips: {
                            backgroundColor: "rgb(255,255,255)",
                            bodyFontColor: "#858796",
                            borderColor: '#dddfeb',
                            borderWidth: 1,
                            xPadding: 15,
                            yPadding: 15,
                            displayColors: false,
                            caretPadding: 10,
                        },
                        legend: {
                            display: true
                        },
                        cutoutPercentage: 80,
                    },
                });


            } else {
            }
        })
        .catch((error) => {
            $("div.container-fluid").LoadingOverlay("hide")
        })

})