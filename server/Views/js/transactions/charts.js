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
    arrows: false,
    legend: false,
    border: false,
}

const updateTransCharts = (data) => {
    updateChartFees(data)
    updateChartAmount(data)
    updateChartStatus(data)
}

const updateChartTransInBlock = data => {
    let _data = []
    let index = 0
    for(let r of data.reverse()) {
        _data.push([+r.height, +r.user_trans_count])
        index++
    }
    const areas = [
        {
            name: "TPB"
        }
    ]
    chart.lineChart("#chart-trans-in-block", [_data], {
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

const updateChartFees = data => {
    let _data = []
    let index = 0
    for(let r of data.reverse()) {
        _data.push([index, +r.fee])
        index++
    }
    const areas = [
        {
            name: "TPB"
        }
    ]
    chart.lineChart("#chart-trans-fee", [_data], {
        lines: areas,
        ...chartOptions,
        colors: [chart.defaultColors.mediumSlateBlue],
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
            const [block, transactionsCount] = data
            return `<span>Fee: ${transactionsCount}</span>`
        },
        onDrawLabelY: (val) => {
            return (val / 10**9).toFixed(4)
        }
    })
}

const updateChartAmount = data => {
    let _data = []
    let index = 0
    for(let r of data.reverse()) {
        _data.push([index, +r.amount])
        index++
    }
    const areas = [
        {
            name: "TPB"
        }
    ]
    chart.lineChart("#chart-trans-amount", [_data], {
        lines: areas,
        ...chartOptions,
        colors: [chart.defaultColors.deepSkyBlue],
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
            const [block, transactionsCount] = data
            return `<span>Amount: ${transactionsCount}</span>`
        },
        onDrawLabelY: (val) => {
            return (val / 10**9).toFixed(4)
        }
    })
}

const updateChartStatus = data => {
    let applied = 0, failed = 0
    let index = 0
    for(let r of data.reverse()) {
        if (r.status === 'applied') applied++
        if (r.status === 'failed') failed++
        index++
    }
    chart.barChart("#chart-trans-status", [applied, failed], {
        height: 100,
        bars: ["Applied", "Failed"],
        colors: ["green", "red"],
        title: false,
        barDistance: 10,
        groupDistance: 10,
        arrows: false,
        border: false,
        boundaries: {
            max: applied + failed
        },
        padding: {
            top: 10
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
            }
        }
    })
}