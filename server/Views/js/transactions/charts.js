;

const updateChartTransInBlock = data => {
    $("#chart-trans-in-block").clear()
    const tx = [], bl = []
    let index = 0
    for(let r of data.reverse()) {
        tx.push(+r.user_trans_count)
        bl.push(+r.height)
        index++
    }
    const chart = new ApexCharts(document.querySelector("#chart-trans-in-block"), {
        chart: {
            type: 'line',
            toolbar: {
                show: false
            },
            animations: {
                speed: 300
            },
            height: 150,
            parentHeightOffset: 0,
        },
        series: [{
            name: 'Tx',
            data: tx
        }],
        xaxis: {
            categories: bl,
            labels: {
                show: false
            }
        },
        yaxis: {
            decimalsInFloat: 4
        },
        stroke: {
            width: 1
        },
        colors: ['#ff7f50']

    }).render();
}

const updateTransCharts = (data) => {
    updateChartFees(data)
    updateChartAmount(data)
    updateChartStatus(data)
}

const updateChartFees = data => {
    $("#chart-trans-fee").clear()
    const tx = [], bl = []
    let index = 0
    for(let r of data.reverse()) {
        tx.push(+r.fee/10**9)
        bl.push(index)
        index++
    }
    const chart = new ApexCharts(document.querySelector("#chart-trans-fee"), {
        chart: {
            type: 'line',
            toolbar: {
                show: false
            },
            animations: {
                speed: 300
            },
            height: 150,
            parentHeightOffset: 0,
        },
        series: [{
            name: 'FEE',
            data: tx
        }],
        xaxis: {
            categories: bl,
            labels: {
                show: false
            }
        },
        yaxis: {
            decimalsInFloat: 4
        },
        stroke: {
            width: 1
        },
        colors: ['#7b68ee']

    }).render();
}

const updateChartAmount = data => {
    $("#chart-trans-amount").clear()
    const tx = [], bl = []
    let index = 0
    for(let r of data.reverse()) {
        tx.push(+r.amount/10**9)
        bl.push(index)
        index++
    }
    const chart = new ApexCharts(document.querySelector("#chart-trans-amount"), {
        chart: {
            type: 'line',
            toolbar: {
                show: false
            },
            animations: {
                speed: 300
            },
            height: 150,
            parentHeightOffset: 0,
        },
        series: [{
            name: 'AMOUNT',
            data: tx
        }],
        xaxis: {
            categories: bl,
            labels: {
                show: false
            }
        },
        yaxis: {
            decimalsInFloat: 4
        },
        stroke: {
            width: 1
        },
        colors: ['#00bfff']

    }).render();
}

const updateChartStatus = data => {
    $("#chart-trans-status").clear()
    let index = 0, applied = 0, failed = 0
    for(let r of data.reverse()) {
        if (r.status === 'applied') applied++
        if (r.status === 'failed') failed++
        index++
    }
    const chart = new ApexCharts(document.querySelector("#chart-trans-status"), {
        chart: {
            type: 'donut',
            toolbar: {
                show: false
            },
            animations: {
                speed: 300
            },
            height: 172,
            parentHeightOffset: 0,
        },
        series: [applied, failed],
        labels: ['Applied', 'Failed'],
        colors: ['#94ff6a', '#ff1841'],
        legend: {
            show: false,
            position: 'bottom'
        }
    }).render();
}