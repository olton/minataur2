export const get_arguments = () => {
    const args = process.argv.slice(2)
    const obj = {}
    let startArgIndex = 0

    obj.__rest = []

    while (startArgIndex < args.length) {
        let _value = args[startArgIndex], _next = args[startArgIndex + 1]
        let key, val

        if (_value.slice(0, 2) === '--') {
            key = _value.slice(2)
            val = _next

            startArgIndex++
        } else if (_value.slice(0, 1) === '-') {
            key = _value.slice(1)
            val = true
        } else {
            val = obj.__rest.push(_value)
        }

        obj[key] = isNaN(val) ? val : +val

        startArgIndex++
    }

    return obj
}