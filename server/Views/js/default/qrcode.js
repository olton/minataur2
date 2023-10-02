$("body").on("click", ".mif-qrcode, .gen-qrcode", function(event){
    event.preventDefault()
    const data = $(this).attr("data-value")
    console.log(data)
    Metro.dialog.create({
        title: "QR-Code",
        content: "<div id='js-qr-code' style='width: 240px; height: 240px;'></div>",
        width: 290
    })
    setTimeout(()=>{
        new QRCode("js-qr-code", {
            text: data,
            width: 240,
            height: 240,
            colorDark : "#9d26c2",
            colorLight : "#ffffff",
            correctLevel : QRCode.CorrectLevel.H
        })
    }, 100)

})