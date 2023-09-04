;
const chartOptions = {
    height: 150,
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

const updateCharts = (data) => {
    updateChartTPB(data)
    updateChartSPB(data)
    updateChartFPB(data)
}

const updateChartTPB = data => {
    let _data = []
    let index = 0
    for(let r of data.reverse()) {
        _data.push([index, +r.trans_count])
        index++
    }
    const areas = [
        {
            name: "TPB"
        }
    ]
    chart.areaChart("#chart-tpb", [_data], {
        areas,
        ...chartOptions,
        colors: [chart.defaultColors.cornflowerBlue],
        onTooltipShow: (data) => {
            const [_, transactionsCount] = data
            return `<span>Transactions: ${transactionsCount}</span>`
        }
    })
}

const updateChartSPB = data => {
    let _data = []
    let index = 0
    for(let r of data.reverse()) {
        _data.push([index, +r.block_slots])
        index++
    }
    const areas = [
        {
            name: "SPB"
        }
    ]
    chart.areaChart("#chart-spb", [_data], {
        areas,
        ...chartOptions,
        colors: [chart.defaultColors.coral],
        onTooltipShow: (data) => {
            const [_, slotsCount] = data
            return `<span>Slots: ${slotsCount}</span>`
        }
    })
}

const updateChartFPB = data => {
    let _data = []
    let index = 0
    for(let r of data.reverse()) {
        _data.push([index, +r.trans_fee])
        index++
    }
    const areas = [
        {
            name: "FPB"
        }
    ]
    chart.areaChart("#chart-fpb", [_data], {
        areas,
        ...chartOptions,
        padding: {
            bottom: 20,
            right: 20,
            top: 20,
            left: 60,
        },
        colors: [chart.defaultColors.darkOrchid],
        onTooltipShow: (data) => {
            const [_, transactionsFee] = data
            return `<span>Fee: ${transactionsFee / 10**9}</span>`
        },
        onDrawLabelY: (val) => {
            return (val / 10**9).toFixed(4)
        }
    })
}
