
const log = (...rest) => console.log(datetime().format(config.format.datetime), ...rest)
const info = (...rest) => console.info(datetime().format(config.format.datetime), ...rest)
const error = (...rest) => console.error(datetime().format(config.format.datetime), ...rest)