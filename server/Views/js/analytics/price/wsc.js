globalThis.wsController = (ws, res) => {
    const {channel, data} = res

    switch (channel) {
        case "welcome": {
            $(".live").show((el)=>$(el).css("display", "flex"))
            log(`Welcome to Minataur Server!`)
            request("price")
            request("price_hour")
            request("price_48h")
            request("price_month")
            request("price_candles")
            break
        }
        case "price": {
            updatePrice(data)
            setTimeout(request, 60000, "price")
            break
        }
        case "price_hour": {
            drawPriceHour(data)
            setTimeout(request, 60000, "price_hour")
            break
        }
        case "price_48h": {
            drawPrice48h(data)
            setTimeout(request, 60000, "price_48h")
            break
        }
        case "price_month": {
            drawPriceMonth(data)
            setTimeout(request, 60000, "price_month")
            break
        }
        case "price_candles": {
            drawPriceCandles(data)
            setTimeout(request, 60000, "price_candles")
            break
        }
    }
}