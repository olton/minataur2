;
const lineChartOptions = {
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
    xaxis: {
        labels: {
            show: false
        }
    },
    stroke: {
        width: 1
    }
}

const updateCharts = data => {
    drawChartTPB(data)
    drawChartUserTPB(data)
    drawChartIntTPB(data)
    drawChartZkappTPB(data)
    drawChartSPB(data)
    drawChartFPB(data)
    drawChartPAR(data)
    drawChartCoinbase(data)
}

const drawChartTPB = data => {
    $("#chart-tpb").clear()
    const tx = [], bl = []
    for(let r of data.reverse()) {
        tx.push(+r.user_trans_count + +r.internal_trans_count + +r.zkapp_trans_count)
        bl.push(+r.height)
    }
    const chart = new ApexCharts(document.querySelector("#chart-tpb"), merge({}, lineChartOptions, {
        series: [{
            name: 'Trans',
            data: tx
        }],
        xaxis: {
            categories: bl
        }
    })).render();
}

const drawChartZkappTPB = data => {
    $("#chart-zkapp-tpb").clear()
    const tx = [], bl = []
    for(let r of data.reverse()) {
        tx.push(+r.zkapp_trans_count)
        bl.push(+r.height)
    }
    const chart = new ApexCharts(document.querySelector("#chart-zkapp-tpb"), merge({}, lineChartOptions, {
        series: [{
            name: 'ZkApp Tx',
            data: tx
        }],
        xaxis: {
            categories: bl
        },
        colors: ['#af9528'],
    })).render();
}

const drawChartIntTPB = data => {
    $("#chart-int-tpb").clear()
    const tx = [], bl = []
    for(let r of data.reverse()) {
        tx.push(+r.internal_trans_count)
        bl.push(+r.height)
    }
    const chart = new ApexCharts(document.querySelector("#chart-int-tpb"), merge({}, lineChartOptions, {
        series: [{
            name: 'Int Tx',
            data: tx
        }],
        xaxis: {
            categories: bl
        },
        colors: ['#ff1841'],
    })).render();
}

const drawChartUserTPB = data => {
    $("#chart-user-tpb").clear()
    const tx = [], bl = []
    for(let r of data.reverse()) {
        tx.push(+r.user_trans_count)
        bl.push(+r.height)
    }
    const chart = new ApexCharts(document.querySelector("#chart-user-tpb"), merge({}, lineChartOptions, {
        series: [{
            name: 'User Tx',
            data: tx
        }],
        xaxis: {
            categories: bl
        },
        colors: ['#4ba228'],
    })).render();
}

const drawChartSPB = data => {
    $("#chart-spb").clear()
    const tx = [], bl = []
    for(let r of data.reverse()) {
        tx.push(+r.block_slots)
        bl.push(+r.height)
    }
    const chart = new ApexCharts(document.querySelector("#chart-spb"), merge({}, lineChartOptions, {
        series: [{
            name: 'Slots',
            data: tx
        }],
        xaxis: {
            categories: bl,
        },
        colors: ['#ff7f50'],
    }))
    chart.render()
}

const drawChartFPB = data => {
    $("#chart-fpb").clear()
    const tx = [], bl = []
    for(let r of data.reverse()) {
        tx.push(+r.trans_fee/10**9)
        bl.push(+r.height)
    }
    const chart = new ApexCharts(document.querySelector("#chart-fpb"), merge({}, lineChartOptions, {
        series: [{
            name: 'Fee',
            data: tx
        }],
        xaxis: {
            categories: bl,
        },
        yaxis: {
            decimalsInFloat: 4
        },
        colors: ['#9932cc'],
    }))
    chart.render()
}

const drawChartPAR = data => {
    $("#chart-par").clear()
    const tx = [], bl = []
    for(let r of data.reverse()) {
        tx.push(+r.block_participants)
        bl.push(+r.height)
    }
    const chart = new ApexCharts(document.querySelector("#chart-par"), merge({}, lineChartOptions, {
        series: [{
            name: 'Par',
            data: tx
        }],
        xaxis: {
            categories: bl,
        },
        yaxis: {
            min: 0,
            decimalsInFloat: 0,
            forceNiceScale: true,
            floating: false,
        },
        colors: ['#000000']
    }))
    chart.render()
}

const drawChartCoinbase = data => {
    $("#chart-coinbase").clear()
    const tx = [], bl = []
    for(let r of data.reverse()) {
        tx.push(+r.coinbase/10**9)
        bl.push(+r.height)
    }
    const chart = new ApexCharts(document.querySelector("#chart-coinbase"), merge({}, lineChartOptions, {
        series: [{
            name: 'Coinbase',
            data: tx
        }],
        xaxis: {
            categories: bl,
        },
        yaxis: {
            min: 0,
            max: 1440,
            tickAmount: 2
        },
        colors: ['#1a12ec']
    }))
    chart.render()
}
