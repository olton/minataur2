import {exec} from "child_process";

export const exec_mina_client_status = cb => {
    exec("mina client status --json", (error, stdout, stderror) => {
        if (error) {
            cb.apply(null, [null])
            return null
        }
        cb.apply(null, [stdout])
    })
}