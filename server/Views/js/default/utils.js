const shorten = (v, l = 5) => !v ? v : `${v.substring(0, l) + '...' + v.substring(v.length - l)}`

const link = (text, href, cls) => `<a class="${cls}" href="${href}">${text}</a>`

const copy2clipboard = (text) => {
    // navigator.clipboard.writeText(text)
    const el = document.createElement('textarea')
    el.value = text
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)
}

$("body").on("click", ".copy-data-to-clipboard", function() {
    copy2clipboard($(this).attr("data-value"));
    Metro.toast.create("Data copied to clipboard!")
})

const exp2dec = (exponentialNumber) => {
    const str = exponentialNumber.toString();
    if (str.indexOf('e') !== -1) {
        const exponent = parseInt(str.split('-')[1], 10);
        return exponentialNumber.toFixed(exponent);
    } else {
        return exponentialNumber;
    }
}

const normMina = (nano = 0, type = "number") => {
    let [_temp1, _temp2] = (nano / 10**9).toFixed(9).toString().split(".")
    let result = [_temp1?_temp1:0, _temp2?_temp2:0]

    switch (type.toLowerCase()) {
        case "array": return result
        case "string": return result.join(".")
        default: return exp2dec(+(result.join(".")))
    }
}

const num2fmt = (v, s = " ") => Number(v).format(0, null, s, ".")

const clearText = ( str ) => (str + '').replace(/[<>="'*+?^${}()|[\]\\]/g, '').replace(/\u0000/g, '\\0')