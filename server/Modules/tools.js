import {testPort} from "../Helpers/test-port.js";

export const tools_check_ports = async ips => {
    const result = {}, ports = [3089, 8302]

    if (!Array.isArray(ips)) {
        return result
    }

    for(let ip of ips) {
        result[ip] = {}
        for(let port of ports) {
            result[ip][port] = await testPort(port, {host: ip})
        }
    }
    return result
}