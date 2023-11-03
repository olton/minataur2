;

let chartCoinbase, chartTrans, chartFee, chartSlots

const updateBlockchainCharts = data => {
    updateChartCoinbase(data)
    updateChartTrans(data)
    updateChartFee(data)
    updateChartSlots(data)
}

const updateChartCoinbase = data => {
    const dd = []
    for(let r of data.rows.reverse()) {
        if (r.chain_status !== 'canonical') continue
        dd.push({
            y: +r.coinbase/10**9,
            x: +r.height,
        })
    }
    if (!chartCoinbase) {
        chartCoinbase = new ApexCharts(document.querySelector("#chart-blockchain-coinbase"), {
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
                name: 'COINBASE',
                data: dd
            }],
            xaxis: {
                labels: {
                    show: false
                }
            },
            yaxis: {
                min: 0,
                max: 1440,
                tickAmount: 2
            },
            stroke: {
                width: 1
            }
        })
        chartCoinbase.render()
    } else {
        chartCoinbase.updateSeries([{
            name: 'COINBASE',
            data: dd
        }])
    }
}

const updateChartTrans = data => {
    const dd = []
    for(let r of data.rows) {
        if (r.chain_status !== 'canonical') continue
        dd.push({
            y: +r.user_trans_count + +r.internal_trans_count + +r.zkapp_trans_count,
            x: +r.height
        })
    }
    if (!chartTrans) {
        chartTrans = new ApexCharts(document.querySelector("#chart-blockchain-trans"), {
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
            colors: ["#ff7f50"],
            series: [{
                name: 'TPB',
                data: dd
            }],
            xaxis: {
                labels: {
                    show: false
                }
            },
            yaxis: {
                min: 0,
                tickAmount: 4
            },
            stroke: {
                width: 1
            }
        })
        chartTrans.render();
    } else {
        chartTrans.updateSeries([{
            name: 'TPB',
            data: dd
        }])
    }
}

const updateChartFee = data => {
    const dd = []
    for(let r of data.rows) {
        if (r.chain_status !== 'canonical') continue
        dd.push({
            y: +r.trans_fee/10**9,
            x: +r.height
        })
    }
    if (!chartFee) {
        chartFee = new ApexCharts(document.querySelector("#chart-blockchain-fee"), {
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
            colors: ["#9932cc"],
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
                min: 0,
                tickAmount: 4,
                decimalsInFloat: 4,
            },
            stroke: {
                width: 1
            }
        })
        chartFee.render()
    } else {
        chartFee.updateSeries([{
            name: 'FEE',
            data: dd
        }])
    }
}
const updateChartSlots = data => {
    const dd = []
    for(let r of data.rows) {
        if (r.chain_status !== 'canonical') continue
        dd.push({
            y: +r.block_slots,
            x: +r.height
        })
    }
    if (!chartSlots) {
        chartSlots = new ApexCharts(document.querySelector("#chart-blockchain-slots"), {
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
            colors: ["#556b2f"],
            series: [{
                name: 'SPB',
                data: dd
            }],
            xaxis: {
                labels: {
                    show: false
                }
            },
            yaxis: {
                min: 0,
                tickAmount: 4,
                decimalsInFloat: 0,
            },
            stroke: {
                width: 1
            }
        })
        chartSlots.render();
    } else {
        chartSlots.updateSeries([{
            name: 'SPB',
            data: dd
        }])
    }
}
