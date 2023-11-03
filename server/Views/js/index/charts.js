;
const lineChartOptions = {
    chart: {
        type: 'line',
        toolbar: {
            show: false
        },
        animations: {
            enabled: false,
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
    },
    noData: {
        text: 'Loading...'
    },
    tooltip: {
        x: {
            formatter: (val, obj) => {
                return `${obj.w.globals.categoryLabels[val - 1]}`
            }
        },
        y: {
            formatter: (val, obj) => {
                return `${val}`
            }
        },
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

let chartTPB,
    chartZkappTPB,
    chartIntTPB,
    chartUserTPB,
    chartSPB,
    chartFPB,
    chartPAR,
    chartCoinbase,
    chartPrice

const drawChartTPB = data => {
    const dd = []
    for(let r of data.reverse()) {
        dd.push({
            y: +r.user_trans_count + +r.internal_trans_count + +r.zkapp_trans_count,
            x: +r.height
        })
    }
    if (!chartTPB) {
        chartTPB = new ApexCharts(document.querySelector("#chart-tpb"), merge({}, lineChartOptions, {
            series: [{
                name: 'Trans',
                data: dd
            }]
        }))
        chartTPB.render();
    } else {
        chartTPB.updateSeries([{
            name: 'Trans',
            data: dd
        }])
    }
}

const drawChartZkappTPB = data => {
    const dd = []
    for(let r of data) {
        dd.push({
            y: +r.zkapp_trans_count,
            x: +r.height
        })
    }
    if (!chartZkappTPB) {
        chartZkappTPB = new ApexCharts(document.querySelector("#chart-zkapp-tpb"), merge({}, lineChartOptions, {
            series: [{
                name: 'ZkApp Tx',
                data: dd
            }],
            colors: ['#af9528'],
        }))
        chartZkappTPB.render();
    } else {
        chartZkappTPB.updateSeries([{
            name: 'ZkApp Tx',
            data: dd
        }])
    }
}

const drawChartIntTPB = data => {
    const dd = []
    for(let r of data) {
        dd.push({
            y: +r.internal_trans_count,
            x: +r.height
        })
    }
    if (!chartIntTPB) {
        chartIntTPB = new ApexCharts(document.querySelector("#chart-int-tpb"), merge({}, lineChartOptions, {
            series: [{
                name: 'Int Tx',
                data: dd
            }],
            colors: ['#ff1841'],
        }))
        chartIntTPB.render()
    } else {
        chartIntTPB.updateSeries([{
            name: 'Int Tx',
            data: dd
        }])
    }
}

const drawChartUserTPB = data => {
    const dd = []
    for(let r of data) {
        dd.push({
            y: +r.user_trans_count,
            x: +r.height
        })
    }
    if (!chartUserTPB) {
        chartUserTPB = new ApexCharts(document.querySelector("#chart-user-tpb"), merge({}, lineChartOptions, {
            series: [{
                name: 'User Tx',
                data: dd
            }],
            colors: ['#4ba228'],
        }))
        chartUserTPB.render();
    } else {
        chartUserTPB.updateSeries([{
            name: 'User Tx',
            data: dd
        }])
    }
}

const drawChartSPB = data => {
    const dd = []
    for(let r of data) {
        dd.push({
            y: +r.block_slots,
            x: +r.height
        })
    }
    if (!chartSPB) {
        chartSPB = new ApexCharts(document.querySelector("#chart-spb"), merge({}, lineChartOptions, {
            series: [{
                name: 'Slots',
                data: dd
            }],
            colors: ['#ff7f50'],
        }))
        chartSPB.render()
    } else {
        chartSPB.updateSeries([{
            name: 'Slots',
            data: dd
        }])
    }
}

const drawChartFPB = data => {
    const dd = []
    for(let r of data) {
        dd.push({
            y: +r.trans_fee/10**9,
            x: +r.height
        })
    }
    if (!chartFPB) {
        chartFPB = new ApexCharts(document.querySelector("#chart-fpb"), merge({}, lineChartOptions, {
            series: [{
                name: 'Fee',
                data: dd
            }],
            yaxis: {
                decimalsInFloat: 4
            },
            colors: ['#9932cc'],
        }))
        chartFPB.render()
    } else {
        chartFPB.updateSeries([{
            name: 'Fee',
            data: dd
        }])
    }
}

const drawChartPAR = data => {
    const dd = []
    for(let r of data) {
        dd.push({
            y: +r.block_participants,
            x: +r.height
        })
    }
    if (!chartPAR) {
        chartPAR = new ApexCharts(document.querySelector("#chart-par"), merge({}, lineChartOptions, {
            series: [{
                name: 'Par',
                data: dd
            }],
            yaxis: {
                min: 0,
                decimalsInFloat: 0,
                forceNiceScale: true,
                floating: false,
            },
            colors: ['#000000']
        }))
        chartPAR.render()
    } else {
        chartPAR.updateSeries([{
            name: 'Par',
            data: dd
        }])
    }
}

const drawChartCoinbase = data => {
    const dd = []
    for(let r of data) {
        dd.push({
            y: +r.coinbase/10**9,
            x: +r.height
        })
    }
    if (!chartCoinbase) {
        chartCoinbase = new ApexCharts(document.querySelector("#chart-coinbase"), merge({}, lineChartOptions, {
            series: [{
                name: 'Coinbase',
                data: dd
            }],
            yaxis: {
                min: 0,
                max: 1440,
                tickAmount: 2
            },
            colors: ['#1a12ec']
        }))
        chartCoinbase.render()
    } else {
        chartCoinbase.updateSeries([{
            name: 'Coinbase',
            data: dd
        }])
    }
}

const drawPriceChart = data => {
    const dd = []
    for(let r of data.reverse()) {
        dd.push({
            y: +r.value,
            x: datetime(r.timestamp).time()
        })
    }
    if (!chartPrice) {
        chartPrice = new ApexCharts($("#price-chart-sparkle")[0], merge({}, lineChartOptions, {
            chart: {
                sparkline: {
                    enabled: true
                },
                height: 20,
            },
            series: [{
                name: "Price",
                data: dd
            }],
            yaxis: {
                decimalsInFloat: 4,
                labels: {
                    formatter: function (val) {
                        return val.toFixed(4)
                    }
                }
            },
            colors: ['#50a8ff'],
            tooltip: {
                fixed: {
                    enabled: false
                },
                x: {
                    show: false
                },
                y: {
                    title: {
                        formatter: function (seriesName) {
                            return ''
                        }
                    }
                },
                marker: {
                    show: false
                }
            }
        }))
        chartPrice.render()
    } else {
        chartPrice.updateSeries([{
            name: "Price",
            data: dd
        }])
    }
}