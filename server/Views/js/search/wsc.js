globalThis.wsController = (ws, res) => {
    const {channel, data} = res

    switch (channel) {
        case "welcome": {
            $(".live").show((el)=>$(el).css("display", "flex"))
            log(`Welcome to Minataur Server!`)
            request("search", {query: globalThis.searchQuery})
            break
        }
        case "search": {
            parseSearch(data)
            break
        }
    }
}