

const updateCharts = data => {
    drawChartTPB(data)
    drawChartSPB(data)
    drawChartFPB(data)
    drawChartPAR(data)
}

const drawChartTPB = data => {
    $("#chart-tpb").clear()
    const tx = [], bl = []
    for(let r of data.reverse()) {
        tx.push(+r.user_trans_count + +r.internal_trans_count + +r.zkapp_trans_count)
        bl.push(+r.height)
    }
    const chart = new ApexCharts(document.querySelector("#chart-tpb"), {
        chart: {
            type: 'line',
            toolbar: {
                show: false
            },
            animations: {
                speed: 300
            },
            height: 150,
        },
        series: [{
            name: 'TPB',
            data: tx
        }],
        xaxis: {
            categories: bl,
            labels: {
                show: false
            }
        },
        stroke: {
            width: 1
        }
    }).render();
}

const drawChartSPB = data => {
    $("#chart-spb").clear()
    const tx = [], bl = []
    for(let r of data.reverse()) {
        tx.push(+r.block_slots)
        bl.push(+r.height)
    }
    const chart = new ApexCharts(document.querySelector("#chart-spb"), {
        chart: {
            type: 'line',
            toolbar: {
                show: false
            },
            animations: {
                speed: 300
            },
            height: 150,
        },
        series: [{
            name: 'SPB',
            data: tx
        }],
        xaxis: {
            categories: bl,
            labels: {
                show: false
            }
        },
        stroke: {
            width: 1
        },
        colors: ['#ff7f50']

    }).render();
}

const drawChartFPB = data => {
    $("#chart-fpb").clear()
    const tx = [], bl = []
    for(let r of data.reverse()) {
        tx.push(+r.trans_fee/10**9)
        bl.push(+r.height)
    }
    const chart = new ApexCharts(document.querySelector("#chart-fpb"), {
        chart: {
            type: 'line',
            toolbar: {
                show: false
            },
            animations: {
                speed: 300
            },
            height: 150,
        },
        series: [{
            name: 'SPB',
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
        colors: ['#9932cc']

    }).render();
}

const drawChartPAR = data => {
    $("#chart-par").clear()
    const tx = [], bl = []
    for(let r of data.reverse()) {
        tx.push(+r.block_participants)
        bl.push(+r.height)
    }
    const chart = new ApexCharts(document.querySelector("#chart-par"), {
        chart: {
            type: 'line',
            toolbar: {
                show: false
            },
            animations: {
                speed: 300
            },
            height: 150,
        },
        series: [{
            name: 'SPB',
            data: tx
        }],
        xaxis: {
            categories: bl,
            labels: {
                show: false
            }
        },
        stroke: {
            width: 1
        },
        colors: ['#6b8e23']
    }).render();
}