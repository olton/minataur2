;

const checkPorts = (form) => {
    const ip = form.elements["ips"].value.trim()
    if (!ip) {
        Metro.toast.create("Please enter at least one IP address!")
        return
    }
    if (globalThis.webSocket) {
        $("#loader").show()
        $("#check-button").addClass("disabled")
        request('check_ports', {ip: ip.split("\n")})
    }
}

const showResult = data => {
    $("#loader").hide()
    $("#check-button").removeClass("disabled")
    const target = $("#check-ports-result tbody").clear()
    for(ip in data) {
        $("<tr>").html(`
            <td>${ip}</td>
            <td><span class="text-muted mr-2">itn-graph-ql</span></td>
            <td>3089</td>
            <td>${data[ip]["3089"] ? '<span class="mif-checkmark fg-green"></span>' : '<span class="mif-stop fg-red"></span>'}</td>
        `).appendTo(target)
        $("<tr>").html(`
            <td>${ip}</td>
            <td><span class="text-muted mr-2">libp2p</span></td>
            <td>8302</td>
            <td>${data[ip]["8302"] ? '<span class="mif-checkmark fg-green"></span>' : '<span class="mif-stop fg-red"></span>'}</td>
        `).appendTo(target)
    }
}