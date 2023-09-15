export const ip_location = async (ip) => {
    const response = await fetch(`https://ipapi.co/${ip}/json/`)
    if (!response.ok) {
        return null
    }
    return await response.json()
}