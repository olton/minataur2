;
const updatePrice = data => {
    console.log(data)
    $("#current_price").html(data.current_price)
    $("#last_updated").html(datetime(data.last_updated).format(config.format.datetime))
    $("#ath").html((data.ath).toFixed(6))
    $("#ath_date").html(datetime(data.ath_date).format(config.format.datetime))
    $("#atl").html(data.atl)
    $("#atl_date").html(datetime(data.atl_date).format(config.format.datetime))
    $("#high_24h").html(data.high_24h)
    $("#low_24h").html(data.low_24h)
    $("#price_change_24h").html((data.price_change_24h).toFixed(6))
    $("#price_change_percentage_24h").html(`(${(data.price_change_percentage_24h).toFixed(2)}%)`)
}