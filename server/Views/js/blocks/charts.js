;
const chartOptions = {
    height: 100,
    title: false,
    padding: {
        bottom: 20,
        right: 20,
        top: 20,
    },
    axis: {
        y: {
            label: {
                fixed: 0,
                count: 5,
                step: "auto",
                font: {
                    size: 10
                }
            }
        },
        x: {
            label: false
        },
    },
    legend: false,
    border: false,
}

const updateBlockchainCharts = data => {
    updateChartCoinbase(data)
    updateChartTrans(data)
    updateChartFee(data)
    updateChartSlots(data)
}


const updateChartCoinbase = data => {
    let _data = []
    let index = 0
    for(let r of data.rows.reverse()) {
        if (r.chain_status !== 'canonical') continue
        _data.push([+r.height, +r.coinbase/10**9])
        index++
    }
    const areas = [
        {
            name: "Coinbase"
        }
    ]
    chart.lineChart("#chart-blockchain-coinbase", [_data], {
        lines: areas,
        ...chartOptions,
        colors: [chart.defaultColors.cornflowerBlue],
        axis: {
            y: {
                label: {
                    fixed: 0,
                    count: 2,
                    step: "auto",
                    font: {
                        size: 10
                    }
                }
            },
            x: {
                label: false
            },
        },
        boundaries: {
            minY: 0,
            maxY: 1440
        },
        onTooltipShow: (data) => {
            const [block, coinbase] = data
            return `<span>Block: ${block}, Coinbase: ${coinbase}</span>`
        }
    })
}


const updateChartTrans = data => {
    let _data = []
    let index = 0
    for(let r of data.rows.reverse()) {
        if (r.chain_status !== 'canonical') continue
        _data.push([+r.height, +r.trans_count])
        index++
    }
    const areas = [
        {
            name: "TPB"
        }
    ]
    chart.lineChart("#chart-blockchain-trans", [_data], {
        lines: areas,
        ...chartOptions,
        colors: [chart.defaultColors.coral],
        boundaries: {
            minY: 0
        },
        onTooltipShow: (data) => {
            const [block, transactionsCount] = data
            return `<span>Block: ${block}, Trans: ${transactionsCount}</span>`
        }
    })
}

const updateChartFee = data => {
    let _data = []
    let index = 0
    for(let r of data.rows.reverse()) {
        if (r.chain_status !== 'canonical') continue
        _data.push([+r.height, +r.trans_fee])
        index++
    }
    const areas = [
        {
            name: "Fee"
        }
    ]
    chart.lineChart("#chart-blockchain-fee", [_data], {
        lines: areas,
        ...chartOptions,
        colors: [chart.defaultColors.darkOrchid],
        boundaries: {
            minY: 0
        },
        padding: {
            bottom: 20,
            right: 20,
            top: 20,
            left: 60,
        },
        onTooltipShow: (data) => {
            const [block, fee] = data
            return `<span>Block: ${block}, Fee: ${fee/10**9}</span>`
        },
        onDrawLabelY: (val) => {
            return (val / 10**9).toFixed(4)
        }
    })
}

const updateChartSlots = data => {
    let _data = []
    let index = 0
    for(let r of data.rows.reverse()) {
        if (r.chain_status !== 'canonical') continue
        _data.push([+r.height, +r.block_slots])
        index++
    }
    const areas = [
        {
            name: "Fee"
        }
    ]
    chart.lineChart("#chart-blockchain-slots", [_data], {
        lines: areas,
        ...chartOptions,
        colors: [chart.defaultColors.darkOliveGreen],
        boundaries: {
            minY: 0
        },
        onTooltipShow: (data) => {
            const [block, slots] = data
            return `<span>Block: ${block}, Fee: ${slots}</span>`
        }
    })
}
