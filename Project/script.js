document.addEventListener("DOMContentLoaded", () => {
    const monthDropdown = document.getElementById("month");
    const searchInput = document.getElementById("search");
    const prevButton = document.getElementById("prev");
    const nextButton = document.getElementById("next");
    const transactionTableBody = document.getElementById("transaction-table-body");
    const totalSaleSpan = document.getElementById("total-sale");
    const totalSoldSpan = document.getElementById("total-sold");
    const totalNotSoldSpan = document.getElementById("total-not-sold");
    const barChartCanvas = document.getElementById("bar-chart");
    const pieChartCanvas = document.getElementById("pie-chart");

    let currentPage = 1;
    const transactionsPerPage = 10;

    const fetchTransactions = async (month, search = "", page = 1) => {
        try {
            const response = await fetch(`/api/transactions?month=${month}&search=${search}&page=${page}&perPage=${transactionsPerPage}`);
            const data = await response.json();
            renderTable(data.transactions);
        } catch (error) {
            console.error("Error fetching transactions:", error);
        }
    };

    const fetchStatistics = async (month) => {
        try {
            const response = await fetch(`/api/statistics?month=${month}`);
            const data = await response.json();
            totalSaleSpan.textContent = `$${data.totalSale}`;
            totalSoldSpan.textContent = data.totalSold;
            totalNotSoldSpan.textContent = data.totalNotSold;
        } catch (error) {
            console.error("Error fetching statistics:", error);
        }
    };

    const renderTable = (transactions) => {
        transactionTableBody.innerHTML = "";
        transactions.forEach((transaction) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${transaction.title}</td>
                <td>${transaction.description}</td>
                <td>${transaction.price}</td>
                <td>${transaction.date}</td>
            `;
            transactionTableBody.appendChild(row);
        });
    };

    const setupCharts = async (month) => {
        try {
            const response = await fetch(`/api/charts?month=${month}`);
            const data = await response.json();

            // Bar Chart
            new Chart(barChartCanvas, {
                type: "bar",
                data: {
                    labels: data.priceRanges.map(range => range.label),
                    datasets: [{
                        label: "# of Items",
                        data: data.priceRanges.map(range => range.count),
                        backgroundColor: "rgba(75, 192, 192, 0.2)",
                        borderColor: "rgba(75, 192, 192, 1)",
                        borderWidth: 1
                    }]
                },
                options: { responsive: true }
            });

            // Pie Chart
            new Chart(pieChartCanvas, {
                type: "pie",
                data: {
                    labels: data.categories.map(cat => cat.label),
                    datasets: [{
                        data: data.categories.map(cat => cat.count),
                        backgroundColor: ["#ff6384", "#36a2eb", "#cc65fe", "#ffce56"],
                    }]
                },
                options: { responsive: true }
            });
        } catch (error) {
            console.error("Error setting up charts:", error);
        }
    };

    // Event Listeners
    monthDropdown.addEventListener("change", () => {
        const selectedMonth = monthDropdown.value;
        fetchTransactions(selectedMonth);
        fetchStatistics(selectedMonth);
        setupCharts(selectedMonth);
    });

    searchInput.addEventListener("input", () => {
        const searchValue = searchInput.value;
        const selectedMonth = monthDropdown.value;
        fetchTransactions(selectedMonth, searchValue);
    });

    prevButton.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            fetchTransactions(monthDropdown.value, searchInput.value, currentPage);
        }
    });

    nextButton.addEventListener("click", () => {
        currentPage++;
        fetchTransactions(monthDropdown.value, searchInput.value, currentPage);
    });

    // Initial Load
    fetchTransactions("March");
    fetchStatistics("March");
    setupCharts("March");
});


document.addEventListener("DOMContentLoaded", () => {
    const barChartCanvas = document.getElementById("bar-chart");

    // Dummy data for bar chart
    const barChartData = {
        labels: ["0-100", "101-200", "201-300", "301-400", "401-500", "501-600", "601-700", "701-800", "801-900", "901+"],
        datasets: [
            {
                label: "# of Items",
                data: [5, 8, 10, 2, 6, 4, 3, 1, 0, 2],
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
            },
        ],
    };

    const barChartOptions = {
        responsive: true,
        scales: {
            x: {
                title: {
                    display: true,
                    text: "Price Range",
                },
            },
            y: {
                title: {
                    display: true,
                    text: "Number of Items",
                },
                beginAtZero: true,
            },
        },
    };

    // Initialize Bar Chart
    new Chart(barChartCanvas, {
        type: "bar",
        data: barChartData,
        options: barChartOptions,
    });
});
