;
const parseSearch = data => {
    const target = $("#search-result tbody").clear()
    const searchResultTitle = $("#search-result-title").clear()
    const searchResultLength = data.accounts && data.accounts.length || data.blocks && data.blocks.length || data.transactions && data.transactions.length

    searchResultTitle.html(`
        We found <b>${searchResultLength}</b> result(s) by your request:
    `)

    let tr, index

    if (data.accounts) {
        tr = $("<tr>").appendTo(target)
        tr.append(
            $("<td>").addClass('text-bold').attr("colspan", 2).html(`Account(s): ${data.accounts.length}`)
        )
        index = 1
        for(let a of data.accounts) {
            tr = $("<tr>").appendTo(target)
            tr.append( $("<td>").css("width", "30px").html(`${index}.`) )
            tr.append( $("<td>").html(`
                <div class="d-flex flex-align-center">
                    <a class="link enlarge-2" href="/account/${a.key}">${shorten(a.key, 12)}</a>
                    <span class="${a.locked ? 'ml-1 mif-lock' : ''}"></span>
                </div>
                <div class="text-small">
                    <span>Name: </span>
                    <span class="text-bold">${a.name || 'NoName'}</span>
                </div>
                <div class="text-small">
                    <span>Balance: </span>
                    <span class="text-bold">${normMina(a.balance).format(9, null, ",", ".")}</span>
                    <span>mina</span>
                </div>
            `) )

            index++
        }
    }

    if (data.blocks) {
        tr = $("<tr>").appendTo(target)
        tr.append(
            $("<td>").addClass('text-bold').attr("colspan", 2).html(`Blocks(s): ${data.blocks.length}`)
        )
        index = 1
        for(let a of data.blocks) {
            tr = $("<tr>").appendTo(target)
            tr.append( $("<td>").css("width", "30px").html(`${index}.`) )
            tr.append( $("<td>").html(`
                <div class="d-flex flex-align-center">
                    <span class="mr-1 mif-stop ${a.chain_status === 'pending' ? 'fg-cyan' : a.chain_status === 'canonical' ? 'fg-green' : 'fg-red'}"></span>
                    <a class="link enlarge-2" href="/block/${a.hash}">${shorten(a.hash, 12)}</a>
                </div>
                <div class="text-small">
                    <span>Height: </span>
                    <span class="text-bold">${a.height}</span>
                    <span>Coinbase: </span>
                    <span class="text-bold">${normMina(a.coinbase).format(9, null, ",", ".")}</span>
                    <span>Producer: </span>
                    <a href="/account/${a.creator_key}" class="link text-bold">${shorten(a.creator_key, 12)}</a>
                </div>
            `) )

            index++
        }
    }

    if (data.transactions) {
        tr = $("<tr>").appendTo(target)
        tr.append(
            $("<td>").addClass('text-bold').attr("colspan", 2).html(`Transaction(s): ${data.transactions.length}`)
        )
        index = 1
        for(let a of data.transactions) {
            tr = $("<tr>").appendTo(target)
            tr.append( $("<td>").css("width", "30px").html(`${index}.`) )
            tr.append( $("<td>").html(`
                <div class="d-flex flex-align-center">
                    <span style="padding: 2px 4px;" class="mr-1 fg-white reduce-2 ${a.status === 'applied' ? 'bg-green' : 'bg-red'}">${a.command_type}</span>
                    <a class="link enlarge-2" href="/transaction/${a.hash}">${shorten(a.hash, 12)}</a>
                </div>
                <div class="text-small">
                    <div>
                        <span>Block: </span>
                        <a href="/block/${a.block_hash}" class="link text-bold">${shorten(a.block_hash, 12)}</a>
                        <span>Height: </span>
                        <span class="text-bold">${a.height}</span>
                    </div>
                    <div>
                        <span>Participans: </span>
                        <a href="/account/${a.sender_key}" class="link text-bold">${shorten(a.sender_key, 12)}</a>
                        <span class="mif-arrow-right"></span>
                        <a href="/account/${a.receiver_key}" class="link text-bold">${shorten(a.receiver_key, 12)}</a>
                    </div>
                    <div>
                        <span>Amount: </span>
                        <span class="text-bold">${normMina(a.amount).format(9, null, ",", ".")}</span>
                        <span>Fee: </span>
                        <span class="text-bold">${normMina(a.fee).format(9, null, ",", ".")}</span>
                    </div>
                </div>
            `) )

            index++
        }
    }
}