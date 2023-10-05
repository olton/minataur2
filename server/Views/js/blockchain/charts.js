;
const updateBlockchainCharts = data => {
    updateChartCoinbase(data)
    updateChartTrans(data)
    updateChartFee(data)
    updateChartSlots(data)
}

const updateChartCoinbase = data => {
    $("#chart-blockchain-coinbase").clear()
    const tx = [], bl = []
    for(let r of data.rows.reverse()) {
        if (r.chain_status !== 'canonical') continue
        tx.push(+r.coinbase/10**9)
        bl.push(+r.height)
    }
    const chart = new ApexCharts(document.querySelector("#chart-blockchain-coinbase"), {
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
            name: 'COINBASE',
            data: tx
        }],
        xaxis: {
            categories: bl,
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
    }).render();
}

const updateChartTrans = data => {
    $("#chart-blockchain-trans").clear()
    const tx = [], bl = []
    for(let r of data.rows) {
        if (r.chain_status !== 'canonical') continue
        tx.push(+r.user_trans_count + +r.internal_trans_count + +r.zkapp_trans_count)
        bl.push(+r.height)
    }
    const chart = new ApexCharts(document.querySelector("#chart-blockchain-trans"), {
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
        colors: ["#ff7f50"],
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
        yaxis: {
            min: 0,
            tickAmount: 4
        },
        stroke: {
            width: 1
        }
    }).render();
}

const updateChartFee = data => {
    $("#chart-blockchain-fee").clear()
    const tx = [], bl = []
    for(let r of data.rows) {
        if (r.chain_status !== 'canonical') continue
        tx.push(+r.trans_fee/10**9)
        bl.push(+r.height)
    }
    const chart = new ApexCharts(document.querySelector("#chart-blockchain-fee"), {
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
        colors: ["#9932cc"],
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
        yaxis: {
            min: 0,
            tickAmount: 4,
            decimalsInFloat: 4,
        },
        stroke: {
            width: 1
        }
    }).render();
}
const updateChartSlots = data => {
    $("#chart-blockchain-slots").clear()
    const tx = [], bl = []
    for(let r of data.rows) {
        if (r.chain_status !== 'canonical') continue
        tx.push(+r.block_slots)
        bl.push(+r.height)
    }
    const chart = new ApexCharts(document.querySelector("#chart-blockchain-slots"), {
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
        colors: ["#556b2f"],
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
        yaxis: {
            min: 0,
            tickAmount: 4,
            decimalsInFloat: 0,
        },
        stroke: {
            width: 1
        }
    }).render();
}
