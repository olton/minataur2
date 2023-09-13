import fetch from "node-fetch"
import {log} from "../Helpers/log.js"
import {datetime} from "@olton/datetime"

export const UPTIME_ENDPOINT = `https://uptime.minaprotocol.com/uptimescore/`
export const UPTIME_SNARKWORK = `snarkwork`
export const UPTIME_SIDECAR = `sidecar`
export const UPTIME_DEFAULT = undefined
export const UPTIME_SCORE_MAX = 1_000_000

const fetchUptimeApi = async (query, timestamp) => {
    try {
        let url = UPTIME_ENDPOINT+query

        if (timestamp) {
            url += (url.endsWith('/') ? '' : '/')+encodeURIComponent(datetime(timestamp).format("YYYY-MM-DDTHH:mm:ss")+"Z")
        }

        console.log(url)

        const result = await fetch(
            url,
            {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )

        return await (result.ok ? result.json() : result.text())
    } catch (e) {
        const msg = `The Request to Uptime API war aborted! ${e.message}`
        log(msg, 'error', e.stack)
        return msg
    }
}

const Result = (result) => typeof result === 'string' ? {ok: false, error: result} : {ok: true, result}

export const uptimeScore = async (type) => {
    return Result(await fetchUptimeApi(`${type ? type : ''}`))
}

export const uptimeAddress = async (address, type) => {
    return Result(await fetchUptimeApi(`${address}${type ? '/'+type : ''}`))
}

export const uptimeAddressAt = async (address, timestamp, type = UPTIME_SNARKWORK) => {
    return Result(await fetchUptimeApi(`${address}${type ? '/'+type : ''}`, timestamp))
}

const isAddress = a => a.startsWith(`B62q`)

const collect = (data, filter = false) => {
    let result = []
    let position = 1
    for (let r of data) {
        if (!filter) {
            result.push({
                ...r,
                position
            })
        } else {
            let record = {
                ...r,
                position
            }
            if (typeof filter === 'function' && filter.apply(null, [record])) {
                result.push(record)
            }
        }
        position++
    }
    return result
}

export const uptime = async (type) => {
    const request = await uptimeScore(type)
    if (!request.ok) {
        throw new Error(request.error)
    }
    return collect(request.result)
}

export const uptimePositionRange = async (type, from = 0, to) => {
    const request = await uptimeScore(type)
    if (!request.ok) {
        throw new Error(request.error)
    }
    return collect(request.result, r => r.position >= from && r.position <= (to || request.result.length))
}

export const uptimeScoreRange = async (type, from = UPTIME_SCORE_MAX, to = 0) => {
    const request = await uptimeScore(type)
    if (!request.ok) {
        throw new Error(request.error)
    }
    return collect(request.result, r => +r.score <= from && +r.score >= to)
}

export const uptimeScoreTop = async (type, length = 120) => {
    const request = await uptimeScore(type)
    if (!request.ok) {
        throw new Error(request.error)
    }
    return collect(request.result, r => r.position <= length)
}

export const uptimeScoreFor = async (address = "", type) => {
    if (!address || !isAddress(address)) return null

    const request = await uptimeScore(type)
    if (!request.ok) {
        throw new Error(request.error)
    }
    const result = collect(request.result, r => r.block_producer_key === address.trim())
    return result.length ? result[0] : null
}

export const uptimeScoreGroup = async (group = [], type) => {
    if (group.length === 0) return []

    const request = await uptimeScore(type)
    if (!request.ok) {
        throw new Error(request.error)
    }
    return collect(request.result, r => group.includes(r.block_producer_key))
}
