;

let chartTx, chartCoinbase, chartFee, chartSlots, chartTimes, chartParticipants

const getChartOptions = () => {
    return {
        chart: {
            type: 'area',
            toolbar: {
                show: false
            },
            animations: {
                enabled: false,
            },
            height: 450,
            parentHeightOffset: 0,
        },
        dataLabels: {
            enabled: false
        },
        xaxis: {
            type: "category",
            tickAmount: 10,
            labels: {
                rotateAlways: true,
                formatter: (value) => {
                    return value
                }
            }
        },
        yaxis: {
            tickAmount: 10
        },
        stroke: {
            width: 1,
            curve: 'smooth',
        },
        markers: {
            size: 0,
        },
    }
}

const drawCharts = data => {
    drawChartTx(data)
    drawChartCoinbase(data)
    drawChartFee(data)
    drawChartSlots(data)
    drawChartTimes(data)
    drawChartParticipants(data)
}

const drawChartTx = data => {
    const container = $("#chart-tx")
    const seriesUserTx = {
        name: "User Tx",
        data: []
    }
    const seriesIntTx = {
        name: "Internal Cmd",
        data: []
    }
    const seriesZkApp = {
        name: "ZkApp",
        data: []
    }


    for(let row of data.rows.reverse()) {
        seriesUserTx.data.push({
            y: +row.user_trans_count,
            x: +row.height
        })
        seriesIntTx.data.push({
            y: +row.internal_trans_count,
            x: +row.height
        })
        seriesZkApp.data.push({
            y: +row.zkapp_trans_count,
            x: +row.height
        })
    }

    if (!chartTx) {
        chartTx = new ApexCharts(container[0], merge({}, getChartOptions(), {
            series: [seriesUserTx, seriesIntTx, seriesZkApp],
            title: {
                text: "Transactions in block"
            },
            legend: {
                position: "bottom"
            }
        }))
        chartTx.render()
    } else {
        chartTx.updateSeries([seriesUserTx, seriesIntTx, seriesZkApp])
    }
}

const drawChartCoinbase = data => {
    const container = $("#chart-coinbase")
    const series = {
        name: "Coinbase",
        data: []
    }

    for(let row of data.rows) {
        series.data.push({
            y: +row.coinbase/10**9,
            x: +row.height
        })
    }

    if (!chartCoinbase) {
        chartCoinbase = new ApexCharts(container[0], merge({}, getChartOptions(), {
            chart: {
                height: 300,
            },
            series: [series],
            title: {
                text: "Block Coinbase"
            },
            yaxis: {
                min: 0,
                max: 1440,
                tickAmount: 2
            },
            colors: ["#7d46ad"]
        }))
        chartCoinbase.render()
    } else {
        chartCoinbase.updateSeries([series])
    }
}

const drawChartFee = data => {
    const container = $("#chart-fee")
    const series = {
        name: "Fee",
        data: []
    }

    for(let row of data.rows.reverse()) {
        series.data.push({
            y: +row.trans_fee/10**9,
            x: +row.height
        })
    }

    if (!chartFee) {
        chartFee = new ApexCharts(container[0], merge({}, getChartOptions(), {
            chart: {
                height: 300
            },
            series: [series],
            title: {
                text: "User Transaction Fee"
            },
            colors: ["#e950b4"]
        }))
        chartFee.render()
    } else {
        chartFee.updateSeries([series])
    }
}

const drawChartSlots = data => {
    const container = $("#chart-slots")
    const series = {
        name: "Slots",
        data: []
    }

    for(let row of data.rows) {
        series.data.push({
            y: +row.block_slots,
            x: +row.height
        })
    }

    if (!chartSlots) {
        chartSlots = new ApexCharts(container[0], merge({}, getChartOptions(), {
            chart: {
                height: 300
            },
            series: [series],
            title: {
                text: "Slots on Block"
            },
            colors: ["#ff8c0f"]
        }))
        chartSlots.render()
    } else {
        chartSlots.updateSeries([series])
    }
}

const drawChartTimes = data => {
    const container = $("#chart-times")
    const series = {
        name: "Minutes",
        data: []
    }

    for(let row of data.rows) {
        series.data.push({
            y: +row.block_timelapse,
            x: +row.height
        })
    }

    if (!chartTimes) {
        chartTimes = new ApexCharts(container[0], merge({}, getChartOptions(), {
            chart: {
                height: 300
            },
            series: [series],
            title: {
                text: "Minutes on Block"
            },
            colors: ["#8bba60"]
        }))
        chartTimes.render()
    } else {
        chartTimes.updateSeries([series])
    }
}

const drawChartParticipants = data => {
    const container = $("#chart-participants")
    const series = {
        name: "Participants",
        data: []
    }

    for(let row of data.rows) {
        series.data.push({
            y: +row.block_participants,
            x: +row.height
        })
    }

    if (!chartParticipants) {
        chartParticipants = new ApexCharts(container[0], merge({}, getChartOptions(), {
            chart: {
                height: 300
            },
            series: [series],
            title: {
                text: "Block Dispute Participants"
            },
            colors: ["#6495ed"],
            yaxis: {
                min: 0,
                max: 10,
                tickAmount: 10,
                labels: {
                    formatter: function(val) {
                        return val.toFixed(0);
                    }
                }
            },
        }))
        chartParticipants.render()
    } else {
        chartParticipants.updateSeries([series])
    }
}
