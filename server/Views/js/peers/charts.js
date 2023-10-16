;
const drawPeersChart = (data) => {
    $("#peers-chart").clear()
    const chart = new ApexCharts(document.querySelector("#peers-chart"), {
        chart: {
            type: 'donut',
            toolbar: {
                show: true
            },
            animations: {
                enabled: false,
                speed: 300
            },
            height: 400,
            // parentHeightOffset: 0,
        },
        series: Object.values(data),
        labels: Object.keys(data),
        legend: {
            show: true,
            position: 'bottom'
        }
    }).render();
}