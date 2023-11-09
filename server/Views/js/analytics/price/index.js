;
const updatePrice = data => {
    $("#current_price").html(data.current_price.toFixed(4))
    $("#last_updated").html(datetime(data.last_updated).format(config.format.datetime))
    $("#ath").html((data.ath).toFixed(4))
    $("#ath_date").html(datetime(data.ath_date).format(config.format.datetime))
    $("#atl").html(data.atl.toFixed(4))
    $("#atl_date").html(datetime(data.atl_date).format(config.format.datetime))
    $("#high_24h").html(data.high_24h.toFixed(4))
    $("#low_24h").html(data.low_24h.toFixed(4))
    $("#price_change_24h").html((data.price_change_24h).toFixed(4))
    $("#price_change_percentage_24h").html(`${(data.price_change_percentage_24h).toFixed(2)}%`)
    $("#total-supply").html(`${num2fmt(data.total_supply, ",")}`)
    $("#last-updated").html(`Updated: ${datetime(data.last_updated).format(config.format.datetime)}`)
}