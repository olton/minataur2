;

const getOptions = (values, categories, title) => {
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
            categories: categories,
            tickAmount: 10,
            labels: {
                rotateAlways: true,
                formatter: (value) => {
                    const [_, time] = (""+value).split(" ")
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
            size: 4
        },
        title: {
            text: title
        }
    }
}

const getData = (data) => {
    const categories = [], values = []
    const timeOffset = new Date().getTimezoneOffset()

    for(let r of data) {
        const date = datetime(r.timestamp)//.addMinute(-timeOffset)
        categories.push(date.format("MM/DD/YYYY HH:mm"))
        values.push(+r.value)
    }
    return [values, categories]
}

const drawPriceHour = data => {
    const container = $("#price-chart-hour").clear()

    const [values, categories] = getData(data)

    const chartLine = new ApexCharts(container[0], getOptions(values, categories, 'Last Hour'));
    chartLine.render();
}

const drawPrice24h = data => {
    const container = $("#price-chart-24h").clear()

    const [values, categories] = getData(data)

    const chartLine = new ApexCharts(container[0], getOptions(values, categories, 'Last 24H'));
    chartLine.render();
}

const drawPrice48h = data => {
    const container = $("#price-chart-48h").clear()

    const [values, categories] = getData(data)

    const chartLine = new ApexCharts(container[0], getOptions(values, categories, 'Last 48H'));
    chartLine.render();
}

const drawPriceMonth = data => {
    const container = $("#price-chart-month").clear()

    const [values, categories] = getData(data)

    const chartLine = new ApexCharts(container[0], getOptions(values, categories, 'Last Month'));
    chartLine.render();
}
