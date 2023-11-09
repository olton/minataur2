;

const getOptions = (values, title) => {
    return {
        series: [{
            data: values
        }],
        chart: {
            type: 'line',
            toolbar: {
                show: false
            },
            animations: {
                enabled: false,
            },
            height: 350,
            parentHeightOffset: 0,
        },
        xaxis: {
            type: "category",
            tickAmount: 10,
            labels: {
                rotateAlways: true,
                formatter: (value) => {
                    const [date, time] = (""+value).split(" ")
                    return time
                }
            }
        },
        yaxis: {
            tickAmount: 10
        },
        stroke: {
            width: 2,
            curve: 'smooth',
        },
        markers: {
            size: 0,
            colors: "#468cff"
        },
        title: {
            text: title
        }
    }
}

const getData = (data) => {
    const values = []
    const timeOffset = new Date().getTimezoneOffset()

    for(let r of data) {
        const date = datetime(r.timestamp)
        values.push({
            x: date.format("MM/DD/YYYY HH:mm"),
            y: +r.value
        })
    }
    return values
}

let chartHour, chart48H, chartMonth, chartCandles

const drawPriceHour = data => {
    const container = $("#price-chart-hour")
    const values = getData(data)

    if (!chartHour) {
        chartHour = new ApexCharts(container[0], merge({}, getOptions(values, 'Last Hour'), {
            xaxis: {
                tickAmount: 10
            }
        }));
        chartHour.render();
    } else {
        chartHour.updateSeries([{
            data: values
        }])
    }
}

const drawPrice48h = data => {
    const container = $("#price-chart-48h")
    const values = getData(data)

    if (!chart48H) {
        chart48H = new ApexCharts(container[0], merge({}, getOptions(values, 'Last 48H'), {
            xaxis: {
                tickAmount: 10,
                labels: {
                    rotateAlways: true,
                    formatter: (value) => {
                        return value ? datetime(value).format("DD, MMM, HH:mm") : ""
                    }
                }
            }
        }));
        chart48H.render();
    } else {
        chart48H.updateSeries([{
            data: values
        }])
    }
}

const drawPriceMonth = data => {
    const container = $("#price-chart-month")
    const values = getData(data)

    if (!chartMonth) {
        chartMonth = new ApexCharts(container[0], merge({}, getOptions(values, 'Last Month'), {
            xaxis: {
                tickAmount: 10,
                labels: {
                    rotateAlways: true,
                    formatter: (value) => {
                        return value ? datetime(value).format("DD, MMM, HH:mm") : ""
                    }
                }
            },
            markers: {
                size: 0,
                strokeWidth: 1
            }
        }));
        chartMonth.render();
    } else {
        chartMonth.updateSeries([{
            data: values
        }])
    }
}


const drawPriceCandles = data => {
    const container = $("#price-chart-candles")
    const dd = []
    for(let r of data.reverse()) {
        dd.push({
            x: datetime(r._day).format("YYYY/MM/DD"),
            y: [r.o, r.h, r.l, r.c]
        })
    }

    if (!chartCandles) {
        chartCandles = new ApexCharts(container[0], {
            series: [{
                data: dd
            }],
            chart: {
                type: 'candlestick',
                width: "100%",
                height: 350,
                animations: {
                    enabled: false,
                },
                toolbar: {
                    show: false
                },
            },
            title: {
                text: 'CandleStick Last 30 Days',
                align: 'left'
            },
            xaxis: {
                tickAmount: 10,
                labels: {
                    rotateAlways: true,
                    formatter: (value) => {
                        return value ? datetime(value).format("DD, MMM") : ""
                    }
                }
            },
            yaxis: {
                tooltip: {
                    enabled: true
                }
            }
        })
        chartCandles.render()
    } else {
        chartCandles.updateSeries([{
            data: dd
        }])
    }
}