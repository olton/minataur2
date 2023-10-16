;

let daemonActivity = null

const updateDaemonStatus = (data) => {
    // console.log(JSON.parse(daemonStatus))
    if (!data) {
        $("#daemon-status-container").css("opacity", .2)
        daemonActivity = Metro.activity.open({
            type: 'cycle',
            overlayColor: '#fff',
            overlayAlpha: .3
        })
        return
    }
    if (daemonActivity) Metro.activity.close(daemonActivity)
    $("#daemon-status-container").css("opacity", 1)
    const status = JSON.parse(data)
    $("#num_accounts").html(num2fmt(status.num_accounts))
    $("#blockchain_length").html(num2fmt(status.blockchain_length))
    $("#peers").html(num2fmt(status.peers.length))
    $("#global_slot_since_genesis_best_tip").html(num2fmt(status.global_slot_since_genesis_best_tip))
    $("#highest_block_length_received").html(num2fmt(status.highest_block_length_received))
    $("#highest_unvalidated_block_length_received").html(num2fmt(status.highest_unvalidated_block_length_received))
    $("#user_commands_sent").html(num2fmt(status.user_commands_sent))
    $("#sync_status").html(status.sync_status)
    $("#chain_id").html(shorten(status.chain_id, 12))
    $("#commit_id").html(shorten(status.commit_id, 12))
    $("#consensus_mechanism").html(status.consensus_mechanism)
    $("#ledger_merkle_root").html(shorten(status.ledger_merkle_root, 12))
    $("#state_hash").html(shorten(status.state_hash, 12))
    $("#consensus_time_best_tip").html(`epoch: ${Math.floor(status.consensus_time_best_tip.slot_number/status.consensus_time_best_tip.slots_per_epoch)}, slot: ${status.consensus_time_best_tip.slot_number - status.consensus_time_best_tip.slots_per_epoch}`)
    $("#consensus_time_now").html(`epoch: ${Math.floor(status.consensus_time_now.slot_number/status.consensus_time_now.slots_per_epoch)}, slot: ${status.consensus_time_now.slot_number - status.consensus_time_now.slots_per_epoch}`)

    const uptime = Metro.utils.secondsToTime(status.uptime_secs)
    $("#uptime_secs").html(`${uptime.d}d, ${uptime.h}h ${uptime.m}m`)
}