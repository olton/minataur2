;

let chartTrans, chartAmount, chartFee, chartStatus

const updateChartTransInBlock = data => {
    const dd = []
    let index = 0
    for(let r of data.reverse()) {
        dd.push({
            y: +r.user_trans_count,
            x: +r.height
        })
        index++
    }
    if (!chartTrans) {
        chartTrans = new ApexCharts(document.querySelector("#chart-trans-in-block"), {
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
            series: [{
                name: 'Tx',
                data: dd
            }],
            xaxis: {
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

        })
        chartTrans.render();
    } else {
        chartTrans.updateSeries([{
            name: 'Tx',
            data: dd
        }])
    }
}

const updateTransCharts = (data) => {
    updateChartFees(data)
    updateChartAmount(data)
    updateChartStatus(data)
}

const updateChartFees = data => {
    const dd = []
    let index = 0
    for(let r of data.reverse()) {
        dd.push({
            y: +r.fee/10**9,
            x: index
        })
        index++
    }
    if (!chartFee) {
        chartFee = new ApexCharts(document.querySelector("#chart-trans-fee"), {
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
            series: [{
                name: 'FEE',
                data: dd
            }],
            xaxis: {
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

        })
        chartFee.render()
    } else {
        chartFee.updateSeries([{
            name: 'FEE',
            data: dd
        }])
    }
}

const updateChartAmount = data => {
    const dd = []
    let index = 0
    for(let r of data.reverse()) {
        dd.push({
            y: +r.amount/10**9,
            x: index
        })
        index++
    }
    if (!chartAmount) {
        chartAmount = new ApexCharts(document.querySelector("#chart-trans-amount"), {
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
            series: [{
                name: 'AMOUNT',
                data: dd
            }],
            xaxis: {
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

        })
        chartAmount.render()
    } else {
        chartAmount.updateSeries([{
            name: 'AMOUNT',
            data: dd
        }])
    }
}

const updateChartStatus = data => {
    let index = 0, applied = 0, failed = 0
    for(let r of data.reverse()) {
        if (r.status === 'applied') applied++
        if (r.status === 'failed') failed++
        index++
    }
    if (!chartStatus) {
        chartStatus = new ApexCharts(document.querySelector("#chart-trans-status"), {
            chart: {
                type: 'donut',
                toolbar: {
                    show: false
                },
                animations: {
                    enabled: false,
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
        })
        chartStatus.render()
    } else {
        chartStatus.updateSeries([applied, failed])
    }
}