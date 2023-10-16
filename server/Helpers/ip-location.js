import {raw} from "express";

export const ip_location = async (ip) => {
    const response = await fetch(`https://ipapi.co/${ip}/json/`)
    if (!response.ok) {
        return null
    }
    return await response.json()
}

export const ip_location_one = async (ip) => {
    const response = await fetch(`http://ip-api.com/json/${ip}?fields=61439`)
    if (!response.ok) {
        return null
    }
    return await response.json()
}

export const ip_location_batch = async (ips) => {
    try {
        const response = await fetch(`http://ip-api.com/batch?fields=61439`, {
            method: "POST",
            body: JSON.stringify(ips)
        })
        console.log(response.headers)
        if (!response.ok) {
            return null
        }
        return await response.json()
    } catch (e) {
        return null
    }
}