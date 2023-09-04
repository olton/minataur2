import {TextDecoder} from "util";
import {decode} from "@faustbrian/node-base58";

export const decodeMemo = memo => (new TextDecoder().decode(decode(memo).slice(3, -4))).replace(/\0/g, "")

export const checkMemoForScam = memo => {
    const _memo = memo.toLowerCase()
    return (
        _memo.includes('airdrop') ||
        _memo.includes('announcing') ||
        _memo.includes('warning') ||
        _memo.includes('important') ||
        _memo.includes('mina-foundation.org') ||
        _memo.includes('clorio')
    )
}