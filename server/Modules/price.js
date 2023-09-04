import fetch from "node-fetch"
import {log} from "../Helpers/log.js"

export const get_price_info = async (currency = 'usd') => {
    try {
        const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=%CURRENCY%&ids=mina-protocol`.replace("%CURRENCY%", currency.toLowerCase())
        const data = await fetch(url)

        return !data.ok ? null : await data.json()
    } catch (e) {
        log(`Error retrieving price from provider`, 'error', e.message)
        return null
    }
}
