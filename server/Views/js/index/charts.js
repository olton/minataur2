;
const chartOptions = {
    height: 120,
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
    arrows: false,
    legend: false,
    border: false,
}

const updateCharts = (data) => {
    updateChartTPB(data)
    updateChartSPB(data)
    updateChartFPB(data)
    updateChartPAR(data)
}

const updateChartTPB = data => {
    let _data = []
    let index = 0
    for(let r of data.reverse()) {
        _data.push([+r.height, +r.user_trans_count + +r.internal_trans_count + +r.zkapp_trans_count])
        index++
    }
    const areas = [
        {
            name: "TPB"
        }
    ]
    chart.lineChart("#chart-tpb", [_data], {
        lines: areas,
        ...chartOptions,
        colors: [chart.defaultColors.cornflowerBlue],
        onTooltipShow: (data) => {
            const [block, transactionsCount] = data
            return `<span>Block: ${block}, Trans: ${transactionsCount}</span>`
        }
    })
}

const updateChartSPB = data => {
    let _data = []
    let index = 0
    for(let r of data.reverse()) {
        _data.push([+r.height, +r.block_slots])
        index++
    }
    const areas = [
        {
            name: "SPB"
        }
    ]
    chart.lineChart("#chart-spb", [_data], {
        lines: areas,
        ...chartOptions,
        colors: [chart.defaultColors.coral],
        onTooltipShow: (data) => {
            const [block, slotsCount] = data
            return `<span>Block: ${block}, Slots: ${slotsCount}</span>`
        }
    })
}

const updateChartPAR = data => {
    let _data = []
    let index = 0
    for(let r of data.reverse()) {
        _data.push([+r.height, +r.block_participants])
        index++
    }
    const areas = [
        {
            name: "SPB"
        }
    ]
    chart.lineChart("#chart-par", [_data], {
        lines: areas,
        ...chartOptions,
        colors: [chart.defaultColors.oliveDrab],
        onTooltipShow: (data) => {
            const [block, count] = data
            return `<span>Block: ${block}, Parts: ${count}</span>`
        }
    })
}

const updateChartFPB = data => {
    let _data = []
    let index = 0
    for(let r of data.reverse()) {
        _data.push([+r.height, +r.trans_fee])
        index++
    }
    const areas = [
        {
            name: "FPB"
        }
    ]
    chart.lineChart("#chart-fpb", [_data], {
        lines: areas,
        ...chartOptions,
        padding: {
            bottom: 20,
            right: 20,
            top: 20,
            left: 60,
        },
        colors: [chart.defaultColors.darkOrchid],
        onTooltipShow: (data) => {
            const [block, transactionsFee] = data
            return `<span>Block: ${block}, Fee: ${transactionsFee / 10**9}</span>`
        },
        onDrawLabelY: (val) => {
            return (val / 10**9).toFixed(4)
        }
    })
}
