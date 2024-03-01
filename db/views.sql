create view public.v_block_stats
            (id, height, internal_trans_count, zkapp_trans_count, user_trans_count, trans_fee, block_slots,
             block_timelapse, block_participants, coinbase)
as
WITH bl AS (SELECT b.id,
                   b.height,
                   COALESCE((SELECT count(ic.id::double precision) AS sum
                             FROM internal_commands ic
                                      LEFT JOIN blocks_internal_commands bic ON bic.internal_command_id = ic.id
                             WHERE bic.block_id = b.id), 0::numeric::bigint)           AS internal_trans_count,
                   COALESCE((SELECT count(zc.id::double precision) AS sum
                             FROM zkapp_commands zc
                                      LEFT JOIN blocks_zkapp_commands bzc ON bzc.zkapp_command_id = zc.id
                             WHERE bzc.block_id = b.id), 0::numeric::bigint)           AS zkapp_trans_count,
                   COALESCE((SELECT count(ic.fee::double precision) AS sum
                             FROM user_commands ic
                                      LEFT JOIN blocks_user_commands bic ON bic.user_command_id = ic.id
                             WHERE bic.block_id = b.id), 0::numeric::bigint)           AS user_trans_count,
                   COALESCE((SELECT sum(ic.fee::double precision) AS sum
                             FROM user_commands ic
                                      LEFT JOIN blocks_user_commands bic ON bic.user_command_id = ic.id
                             WHERE bic.block_id = b.id), 0::numeric::double precision) AS trans_fee,
                   b.global_slot_since_genesis - ((SELECT b2.global_slot_since_genesis
                                                   FROM blocks b2
                                                   WHERE b2.height = (b.height - 1)
                                                     AND b2.chain_status = 'canonical'::chain_status_type
                                                   LIMIT 1))                           AS block_slots,
                   (SELECT count(*) AS count
                    FROM blocks b1
                    WHERE b1.height = b.height)                                        AS block_participants,
                   COALESCE((SELECT sum(ic.fee::double precision) AS sum
                             FROM internal_commands ic
                                      LEFT JOIN blocks_internal_commands bic ON bic.internal_command_id = ic.id
                             WHERE bic.block_id = b.id
                               AND ic.command_type = 'coinbase'::internal_command_type),
                            0::numeric::double precision)                              AS coinbase
            FROM blocks b
            WHERE b.chain_status = 'canonical'::chain_status_type
            ORDER BY b.height DESC
            LIMIT 100)
SELECT bl.id,
       bl.height,
       bl.internal_trans_count,
       bl.zkapp_trans_count,
       bl.user_trans_count,
       bl.trans_fee,
       bl.block_slots,
       bl.block_slots * 3 AS block_timelapse,
       bl.block_participants,
       bl.coinbase
FROM bl;

alter table public.v_block_stats
    owner to postgres;

create view public.v_block_stats_avg
            (avg_slots, avg_internal_trans_count, avg_zkapp_trans_count, avg_user_trans_count, avg_trans_fee,
             avg_time) as
SELECT avg(b.block_slots)          AS avg_slots,
       avg(b.internal_trans_count) AS avg_internal_trans_count,
       avg(b.zkapp_trans_count)    AS avg_zkapp_trans_count,
       avg(b.user_trans_count)     AS avg_user_trans_count,
       round(avg(b.trans_fee))     AS avg_trans_fee,
       avg(b.block_timelapse)      AS avg_time
FROM v_block_stats b;

alter table public.v_block_stats_avg
    owner to postgres;

create view public.v_commands_in_block
            (id, height, user_commands_count, internal_commands_count, zkapp_commands_count) as
SELECT b.id,
       b.height,
       COALESCE((SELECT count(1) AS count
                 FROM blocks_user_commands buc
                 WHERE buc.block_id = b.id), 0::bigint) AS user_commands_count,
       COALESCE((SELECT count(1) AS count
                 FROM blocks_internal_commands bic
                 WHERE bic.block_id = b.id), 0::bigint) AS internal_commands_count,
       COALESCE((SELECT count(1) AS count
                 FROM blocks_zkapp_commands bzc
                 WHERE bzc.block_id = b.id), 0::bigint) AS zkapp_commands_count
FROM blocks b
WHERE b.chain_status = 'canonical'::chain_status_type
ORDER BY b.height DESC;

alter table public.v_commands_in_block
    owner to postgres;

create view public.v_block_info
            (id, height, hash, timestamp, chain_status, global_slot_since_genesis, global_slot_since_hard_fork,
             slot_in_epoch, epoch_since_genesis, epoch_since_hard_fork, coinbase, user_trans_count,
             internal_trans_count, zkapp_trans_count, participants_count, block_slots, creator_id, creator_name,
             creator_key, block_winner_id, block_winner_name, block_winner_key, receiver_id, coinbase_receiver_name,
             coinbase_receiver_key, version, snarked_ledger_hash, vrf_output, block_total_currency, staking_epoch_id,
             staking_epoch_length, staking_epoch_seed, staking_epoch_total_currency, staking_epoch_start_checkpoint,
             staking_epoch_lock_checkpoint, next_epoch_id, next_epoch_length, next_epoch_seed,
             next_epoch_total_currency, next_epoch_start_checkpoint, next_epoch_lock_checkpoint, parent_hash, distance)
as
WITH coinbase_receiver AS (SELECT bic.block_id,
                                  ic.receiver_id
                           FROM internal_commands ic
                                    LEFT JOIN blocks_internal_commands bic ON bic.internal_command_id = ic.id
                           WHERE ic.command_type = 'coinbase'::internal_command_type)
SELECT b.id,
       b.height,
       b.state_hash                                                                                        AS hash,
       b."timestamp",
       b.chain_status,
       b.global_slot_since_genesis,
       b.global_slot_since_hard_fork,
       b.global_slot_since_genesis::double precision - floor((b.global_slot_since_genesis / 7140)::double precision) *
                                                       7140::double precision                              AS slot_in_epoch,
       floor((b.global_slot_since_genesis / 7140)::double precision)                                       AS epoch_since_genesis,
       floor((b.global_slot_since_hard_fork / 7140)::double precision)                                     AS epoch_since_hard_fork,
       COALESCE((SELECT sum(ic.fee::double precision) AS sum
                 FROM internal_commands ic
                          LEFT JOIN blocks_internal_commands bic ON bic.internal_command_id = ic.id
                 WHERE bic.block_id = b.id
                   AND ic.command_type = 'coinbase'::internal_command_type), 0::numeric::double precision) AS coinbase,
       COALESCE((SELECT count(uc.id::double precision) AS sum
                 FROM user_commands uc
                          LEFT JOIN blocks_user_commands buc ON buc.user_command_id = uc.id
                 WHERE buc.block_id = b.id),
                0::numeric::bigint)                                                                        AS user_trans_count,
       COALESCE((SELECT count(ic.id::double precision) AS sum
                 FROM internal_commands ic
                          LEFT JOIN blocks_internal_commands bic ON bic.internal_command_id = ic.id
                 WHERE bic.block_id = b.id),
                0::numeric::bigint)                                                                        AS internal_trans_count,
       COALESCE((SELECT count(zc.id::double precision) AS sum
                 FROM zkapp_commands zc
                          LEFT JOIN blocks_zkapp_commands bzc ON bzc.zkapp_command_id = zc.id
                 WHERE bzc.block_id = b.id),
                0::numeric::bigint)                                                                        AS zkapp_trans_count,
       (SELECT count(*) AS count
        FROM blocks b1
        WHERE b1.height = b.height)                                                                        AS participants_count,
       COALESCE(b.global_slot_since_genesis - ((SELECT b2.global_slot_since_genesis
                                                FROM blocks b2
                                                WHERE b2.height = (b.height - 1)
                                                  AND b2.chain_status = 'canonical'::chain_status_type
                                                LIMIT 1)),
                0::bigint)                                                                                 AS block_slots,
       b.creator_id,
       COALESCE(p.name, 'noname'::character varying)                                                       AS creator_name,
       pk.value                                                                                            AS creator_key,
       b.block_winner_id,
       COALESCE(p2.name, 'noname'::character varying)                                                      AS block_winner_name,
       pk2.value                                                                                           AS block_winner_key,
       cb.receiver_id,
       COALESCE(p3.name, 'noname'::character varying)                                                      AS coinbase_receiver_name,
       pk3.value                                                                                           AS coinbase_receiver_key,
       concat(pv.network, '.', pv.transaction, '.', pv.patch)                                                      AS version,
       sn.value                                                                                            AS snarked_ledger_hash,
       b.last_vrf_output                                                                                   AS vrf_output,
       b.total_currency                                                                                    AS block_total_currency,
       ep1.id                                                                                              AS staking_epoch_id,
       ep1.epoch_length                                                                                    AS staking_epoch_length,
       ep1.seed                                                                                            AS staking_epoch_seed,
       ep1.total_currency                                                                                  AS staking_epoch_total_currency,
       ep1.start_checkpoint                                                                                AS staking_epoch_start_checkpoint,
       ep1.lock_checkpoint                                                                                 AS staking_epoch_lock_checkpoint,
       ep2.id                                                                                              AS next_epoch_id,
       ep2.epoch_length                                                                                    AS next_epoch_length,
       ep2.seed                                                                                            AS next_epoch_seed,
       ep2.total_currency                                                                                  AS next_epoch_total_currency,
       ep2.start_checkpoint                                                                                AS next_epoch_start_checkpoint,
       ep2.lock_checkpoint                                                                                 AS next_epoch_lock_checkpoint,
       b.parent_hash,
       ((SELECT max(blocks.height) AS max
         FROM blocks)) - b.height                                                                          AS distance
FROM blocks b
         LEFT JOIN public_keys pk ON pk.id = b.creator_id
         LEFT JOIN whois p ON p.public_key_id = b.creator_id
         LEFT JOIN public_keys pk2 ON pk2.id = b.block_winner_id
         LEFT JOIN whois p2 ON p2.public_key_id = b.block_winner_id
         LEFT JOIN coinbase_receiver cb ON cb.block_id = b.id
         LEFT JOIN public_keys pk3 ON pk3.id = cb.receiver_id
         LEFT JOIN whois p3 ON p3.public_key_id = cb.receiver_id
         LEFT JOIN protocol_versions pv ON pv.id = b.protocol_version_id
         LEFT JOIN snarked_ledger_hashes sn ON sn.id = b.snarked_ledger_hash_id
         LEFT JOIN epoch_data ep1 ON ep1.id = b.staking_epoch_data_id
         LEFT JOIN epoch_data ep2 ON ep2.id = b.next_epoch_data_id;

alter table public.v_block_info
    owner to postgres;

create view public.v_blocks
            (id, timestamp, height, chain_status, hash, global_slot_since_genesis, global_slot_since_hard_fork,
             epoch_since_genesis, epoch_since_hard_fork, slot, coinbase, snark_fee, trans_fee, user_trans_count,
             internal_trans_count, zkapp_trans_count, creator_id, creator_name, creator_key, block_slots,
             block_participants)
as
SELECT b.id,
       b."timestamp",
       b.height,
       b.chain_status,
       b.state_hash                                                                                        AS hash,
       b.global_slot_since_genesis,
       b.global_slot_since_hard_fork,
       floor((b.global_slot_since_genesis / 7140)::double precision)                                       AS epoch_since_genesis,
       floor((b.global_slot_since_hard_fork / 7140)::double precision)                                     AS epoch_since_hard_fork,
       b.global_slot_since_genesis::double precision -
       floor((b.global_slot_since_genesis / 7140)::double precision) * 7140::double precision              AS slot,
       COALESCE((SELECT sum(ic.fee::double precision) AS sum
                 FROM internal_commands ic
                          LEFT JOIN blocks_internal_commands bic ON bic.internal_command_id = ic.id
                 WHERE bic.block_id = b.id
                   AND ic.command_type = 'coinbase'::internal_command_type), 0::numeric::double precision) AS coinbase,
       COALESCE((SELECT sum(ic.fee::double precision) AS sum
                 FROM internal_commands ic
                          LEFT JOIN blocks_internal_commands bic ON bic.internal_command_id = ic.id
                 WHERE bic.block_id = b.id
                   AND ic.command_type = 'fee_transfer_via_coinbase'::internal_command_type),
                0::numeric::double precision)                                                              AS snark_fee,
       COALESCE((SELECT sum(ic.fee::double precision) AS sum
                 FROM user_commands ic
                          LEFT JOIN blocks_user_commands bic ON bic.user_command_id = ic.id
                 WHERE bic.block_id = b.id), 0::numeric::double precision)                                 AS trans_fee,
       COALESCE((SELECT count(uc.id::double precision) AS sum
                 FROM user_commands uc
                          LEFT JOIN blocks_user_commands buc ON buc.user_command_id = uc.id
                 WHERE buc.block_id = b.id),
                0::numeric::bigint)                                                                        AS user_trans_count,
       COALESCE((SELECT count(ic.id::double precision) AS sum
                 FROM internal_commands ic
                          LEFT JOIN blocks_internal_commands bic ON bic.internal_command_id = ic.id
                 WHERE bic.block_id = b.id),
                0::numeric::bigint)                                                                        AS internal_trans_count,
       COALESCE((SELECT count(zc.id::double precision) AS sum
                 FROM zkapp_commands zc
                          LEFT JOIN blocks_zkapp_commands bzc ON bzc.zkapp_command_id = zc.id
                 WHERE bzc.block_id = b.id),
                0::numeric::bigint)                                                                        AS zkapp_trans_count,
       b.creator_id,
       p.name                                                                                              AS creator_name,
       pk.value                                                                                            AS creator_key,
       COALESCE(b.global_slot_since_genesis - ((SELECT b2.global_slot_since_genesis
                                                FROM blocks b2
                                                WHERE b2.height = (b.height - 1)
                                                  AND b2.chain_status = 'canonical'::chain_status_type
                                                LIMIT 1)),
                0::bigint)                                                                                 AS block_slots,
       (SELECT count(*) AS count
        FROM blocks b1
        WHERE b1.height = b.height)                                                                        AS block_participants
FROM blocks b
         LEFT JOIN whois p ON p.public_key_id = b.creator_id
         LEFT JOIN public_keys pk ON pk.id = b.creator_id;

alter table public.v_blocks
    owner to postgres;

create view public.v_epoch
            (height, global_slot_since_genesis, global_slot_since_hard_fork, epoch_since_genesis, epoch_since_hard_fork,
             current_slot, epoch_start_block, epoch_blocks, block_time, active_producers, total_currency)
as
WITH block AS (SELECT b.height,
                      b."timestamp",
                      b.total_currency
               FROM blocks b
               WHERE b.chain_status = 'canonical'::chain_status_type
               ORDER BY b.height DESC
               LIMIT 1),
     slot AS (SELECT b.global_slot_since_genesis,
                     b.global_slot_since_hard_fork
              FROM blocks b
              WHERE b.chain_status = 'pending'::chain_status_type
              ORDER BY b.height DESC
              LIMIT 1),
     epoch AS (SELECT floor((slot_1.global_slot_since_genesis / 7140)::double precision)                          AS epoch_since_genesis,
                      floor((slot_1.global_slot_since_hard_fork / 7140)::double precision)                        AS epoch_since_hard_fork,
                      slot_1.global_slot_since_genesis::double precision -
                      floor((slot_1.global_slot_since_genesis / 7140)::double precision) *
                      7140::double precision                                                                      AS current_slot
               FROM slot slot_1),
     start_block AS (SELECT min(b.height) AS epoch_start_block
                     FROM blocks b,
                          epoch e,
                          slot s
                     WHERE b.chain_status = 'canonical'::chain_status_type
                       AND b.global_slot_since_genesis::double precision >=
                           (s.global_slot_since_genesis::double precision - e.current_slot))
SELECT block.height,
       slot.global_slot_since_genesis,
       slot.global_slot_since_hard_fork,
       epoch.epoch_since_genesis,
       epoch.epoch_since_hard_fork,
       epoch.current_slot,
       start_block.epoch_start_block,
       block.height - start_block.epoch_start_block + 1           AS epoch_blocks,
       block."timestamp"                                          AS block_time,
       (SELECT count(DISTINCT vb.creator_id) AS count
        FROM v_blocks vb
        WHERE vb.epoch_since_genesis = epoch.epoch_since_genesis) AS active_producers,
       block.total_currency
FROM block,
     slot,
     epoch,
     start_block;

alter table public.v_epoch
    owner to postgres;

create view public.v_internal_commands
            (block_id, hash, command_type, fee, sequence_no, secondary_sequence_no, status, failure_reason, confirm,
             receiver_id, receiver_key, receiver_name, height, timestamp, chain_status, block_hash)
as
SELECT b.id                                           AS block_id,
       ic.hash,
       ic.command_type,
       ic.fee,
       bic.sequence_no,
       bic.secondary_sequence_no,
       bic.status,
       bic.failure_reason,
       ((SELECT max(blocks.height) AS max
         FROM blocks)) - b.height                     AS confirm,
       ic.receiver_id,
       pk.value                                       AS receiver_key,
       COALESCE(pr.name, 'noname'::character varying) AS receiver_name,
       b.height,
       b."timestamp",
       b.chain_status,
       b.state_hash                                   AS block_hash
FROM internal_commands ic
         LEFT JOIN blocks_internal_commands bic ON bic.internal_command_id = ic.id
         LEFT JOIN blocks b ON b.id = bic.block_id
         LEFT JOIN public_keys pk ON pk.id = ic.receiver_id
         LEFT JOIN whois pr ON pr.public_key_id = ic.receiver_id;

alter table public.v_internal_commands
    owner to postgres;

create view public.v_last_canonical_block
            (id, timestamp, height, chain_status, hash, global_slot_since_genesis, global_slot_since_hard_fork,
             epoch_since_genesis, epoch_since_hard_fork, slot, coinbase, snark_fee, trans_fee, user_trans_count,
             internal_trans_count, zkapp_trans_count, creator_id, creator_name, creator_key)
as
SELECT b.id,
       b."timestamp",
       b.height,
       b.chain_status,
       b.hash,
       b.global_slot_since_genesis,
       b.global_slot_since_hard_fork,
       b.epoch_since_genesis,
       b.epoch_since_hard_fork,
       b.slot,
       b.coinbase,
       b.snark_fee,
       b.trans_fee,
       b.user_trans_count,
       b.internal_trans_count,
       b.zkapp_trans_count,
       b.creator_id,
       b.creator_name,
       b.creator_key
FROM v_blocks b
WHERE b.chain_status = 'canonical'::chain_status_type
ORDER BY b.height DESC
LIMIT 1;

alter table public.v_last_canonical_block
    owner to postgres;

create view public.v_user_transactions
            (block_id, height, timestamp, hash, command_type, nonce, amount, fee, memo, sequence_no, status,
             failure_reason, confirm, sender_id, sender_key, sender_name, receiver_id, receiver_key, receiver_name,
             fee_payer_id, fee_payer_key, fee_payer_name, chain_status, block_hash)
as
SELECT b.id                                            AS block_id,
       b.height,
       b."timestamp",
       uc.hash,
       uc.command_type,
       uc.nonce,
       uc.amount,
       uc.fee,
       uc.memo,
       buc.sequence_no,
       buc.status,
       buc.failure_reason,
       ((SELECT max(blocks.height) AS max
         FROM blocks)) - b.height                      AS confirm,
       uc.source_id                                    AS sender_id,
       pk1.value                                       AS sender_key,
       COALESCE(pr1.name, 'noname'::character varying) AS sender_name,
       uc.receiver_id,
       pk2.value                                       AS receiver_key,
       COALESCE(pr2.name, 'noname'::character varying) AS receiver_name,
       uc.fee_payer_id,
       pk3.value                                       AS fee_payer_key,
       COALESCE(pr3.name, 'noname'::character varying) AS fee_payer_name,
       b.chain_status,
       b.state_hash                                    AS block_hash
FROM user_commands uc
         LEFT JOIN blocks_user_commands buc ON buc.user_command_id = uc.id
         LEFT JOIN blocks b ON buc.block_id = b.id
         LEFT JOIN public_keys pk1 ON pk1.id = uc.source_id
         LEFT JOIN whois pr1 ON pr1.public_key_id = uc.source_id
         LEFT JOIN public_keys pk2 ON pk2.id = uc.receiver_id
         LEFT JOIN whois pr2 ON pr2.public_key_id = uc.receiver_id
         LEFT JOIN public_keys pk3 ON pk3.id = uc.fee_payer_id
         LEFT JOIN whois pr3 ON pr3.public_key_id = uc.fee_payer_id;

alter table public.v_user_transactions
    owner to postgres;

create view public.v_zkapp_commands
            (block_id, hash, memo, sequence_no, status, fee, nonce, confirm, payer_id, payer_key, payer_name, height,
             timestamp, chain_status, block_hash)
as
SELECT b.id                                           AS block_id,
       zc.hash,
       zc.memo,
       bzc.sequence_no,
       bzc.status,
       pb.fee,
       pb.nonce,
       ((SELECT max(blocks.height) AS max
         FROM blocks)) - b.height                     AS confirm,
       zc.zkapp_fee_payer_body_id                     AS payer_id,
       pk.value                                       AS payer_key,
       COALESCE(pr.name, 'noname'::character varying) AS payer_name,
       b.height,
       b."timestamp",
       b.chain_status,
       b.state_hash                                   AS block_hash
FROM zkapp_commands zc
         LEFT JOIN blocks_zkapp_commands bzc ON bzc.zkapp_command_id = zc.id
         LEFT JOIN blocks b ON b.id = bzc.block_id
         LEFT JOIN zkapp_fee_payer_body pb ON pb.id = zc.zkapp_fee_payer_body_id
         LEFT JOIN public_keys pk ON pk.id = pb.public_key_id
         LEFT JOIN whois pr ON pr.public_key_id = pb.public_key_id;

alter table public.v_zkapp_commands
    owner to postgres;

create view public.v_ledger_staking
            (public_key_id, account_key, balance, delegate_key_id, delegate_key, nonce, receipt_chain_hash, voting_for,
             token_id, token, initial_balance, initial_minimum_balance, cliff_time, cliff_amount, vesting_period,
             vesting_increment, epoch_since_genesis, epoch_since_hard_fork)
as
SELECT l.public_key_id,
       pk1.value AS account_key,
       l.balance,
       l.delegate_key_id,
       pk2.value AS delegate_key,
       l.nonce,
       l.receipt_chain_hash,
       l.voting_for,
       l.token_id,
       t.value   AS token,
       l.initial_balance,
       l.initial_minimum_balance,
       l.cliff_time,
       l.cliff_amount,
       l.vesting_period,
       l.vesting_increment,
       l.epoch_since_genesis,
       l.epoch_since_hard_fork
FROM ledger l
         LEFT JOIN public_keys pk1 ON pk1.id = l.public_key_id
         LEFT JOIN public_keys pk2 ON pk2.id = l.delegate_key_id
         LEFT JOIN tokens t ON t.id = l.token_id
WHERE l.epoch_since_genesis::double precision = ((SELECT e.epoch_since_genesis
                                                  FROM v_epoch e));

alter table public.v_ledger_staking
    owner to postgres;

create view public.v_ledger_next
            (public_key_id, account_key, balance, delegate_key_id, delegate_key, nonce, receipt_chain_hash, voting_for,
             token_id, token, initial_balance, initial_minimum_balance, cliff_time, cliff_amount, vesting_period,
             vesting_increment, epoch_since_genesis, epoch_since_hard_fork)
as
SELECT l.public_key_id,
       pk1.value AS account_key,
       l.balance,
       l.delegate_key_id,
       pk2.value AS delegate_key,
       l.nonce,
       l.receipt_chain_hash,
       l.voting_for,
       l.token_id,
       t.value   AS token,
       l.initial_balance,
       l.initial_minimum_balance,
       l.cliff_time,
       l.cliff_amount,
       l.vesting_period,
       l.vesting_increment,
       l.epoch_since_genesis,
       l.epoch_since_hard_fork
FROM ledger l
         LEFT JOIN public_keys pk1 ON pk1.id = l.public_key_id
         LEFT JOIN public_keys pk2 ON pk2.id = l.delegate_key_id
         LEFT JOIN tokens t ON t.id = l.token_id
WHERE l.epoch_since_genesis::double precision = (((SELECT e.epoch_since_genesis
                                                   FROM v_epoch e)) + 1::double precision);

alter table public.v_ledger_next
    owner to postgres;

create view public.v_account_info
            (id, key, name, logo, site, telegram, twitter, github, discord, description, blocks_produced,
             blocks_produced_in_epoch, balance, receipt_chain_hash, voting_for, token_id, token,
             initial_minimum_balance, initial_balance, cliff_time, cliff_amount, vesting_period, vesting_increment)
as
WITH blocks_producing AS (SELECT b.creator_id,
                                 count(b.id) AS blocks_produced
                          FROM blocks b
                          WHERE b.chain_status = 'canonical'::chain_status_type
                          GROUP BY b.creator_id),
     blocks_producing_in_epoch AS (SELECT b.creator_id,
                                          count(b.id) AS blocks_produced
                                   FROM v_blocks b
                                   WHERE b.chain_status = 'canonical'::chain_status_type
                                     AND b.epoch_since_genesis = ((SELECT e.epoch_since_genesis
                                                                   FROM v_epoch e))
                                   GROUP BY b.creator_id)
SELECT pk.id,
       pk.value                                            AS key,
       COALESCE(wh.name, ''::character varying)            AS name,
       COALESCE(wh.logo, ''::character varying)            AS logo,
       COALESCE(wh.site, ''::character varying)            AS site,
       COALESCE(wh.telegram, ''::character varying)        AS telegram,
       COALESCE(wh.twitter, ''::character varying)         AS twitter,
       COALESCE(wh.github, ''::character varying)          AS github,
       COALESCE(wh.discord, ''::character varying)         AS discord,
       COALESCE(wh."desc", ''::text)                       AS description,
       COALESCE(bp.blocks_produced, 0::bigint)             AS blocks_produced,
       COALESCE(bpe.blocks_produced, 0::bigint)            AS blocks_produced_in_epoch,
       COALESCE(((SELECT aa.balance
                  FROM accounts_accessed aa
                  WHERE aa.account_identifier_id = ai.id
                    AND aa.token_symbol_id = ai.token_id
                  ORDER BY aa.block_id DESC
                  LIMIT 1))::bigint, l.balance, 0::bigint) AS balance,
       l.receipt_chain_hash,
       l.voting_for,
       l.token_id,
       l.token,
       l.initial_minimum_balance,
       l.initial_balance,
       l.cliff_time,
       l.cliff_amount,
       l.vesting_period,
       l.vesting_increment
FROM public_keys pk
         LEFT JOIN whois wh ON wh.public_key_id = pk.id
         LEFT JOIN account_identifiers ai ON ai.public_key_id = pk.id AND ai.token_id = 1
         LEFT JOIN blocks_producing bp ON bp.creator_id = pk.id
         LEFT JOIN blocks_producing_in_epoch bpe ON bpe.creator_id = pk.id
         LEFT JOIN v_ledger_staking l ON l.public_key_id = pk.id;

alter table public.v_account_info
    owner to postgres;

create view public.v_account_stats
            (account_id, account_key, blocks_win, blocks_total, blocks_canonical, blocks_canonical_epoch, tx_try,
             tx_sent, tx_received, tx_failed)
as
WITH blocks_win AS (SELECT b.block_winner_id,
                           count(b.id) AS blocks_win
                    FROM blocks b
                    GROUP BY b.block_winner_id),
     blocks_total AS (SELECT b.creator_id,
                             count(b.id) AS blocks_produced
                      FROM blocks b
                      GROUP BY b.creator_id),
     blocks_canonical AS (SELECT b.creator_id,
                                 count(b.id) AS blocks_produced
                          FROM blocks b
                          WHERE b.chain_status = 'canonical'::chain_status_type
                          GROUP BY b.creator_id),
     blocks_canonical_epoch AS (SELECT b.creator_id,
                                       count(b.id) AS blocks_produced
                                FROM v_blocks b
                                WHERE b.chain_status = 'canonical'::chain_status_type
                                  AND b.epoch_since_genesis = ((SELECT e.epoch_since_genesis
                                                                FROM v_epoch e))
                                GROUP BY b.creator_id),
     transactions_try AS (SELECT u.source_id,
                                 count(u.id) AS tx_count
                          FROM user_commands u
                                   LEFT JOIN blocks_user_commands b ON b.user_command_id = u.id
                          GROUP BY u.source_id),
     transactions_sent AS (SELECT u.source_id,
                                  count(u.id) AS tx_count
                           FROM user_commands u
                                    LEFT JOIN blocks_user_commands b ON b.user_command_id = u.id
                           WHERE b.status = 'applied'::transaction_status
                           GROUP BY u.source_id),
     transactions_failed AS (SELECT u.source_id,
                                    count(u.id) AS tx_count
                             FROM user_commands u
                                      LEFT JOIN blocks_user_commands b ON b.user_command_id = u.id
                             WHERE b.status = 'failed'::transaction_status
                             GROUP BY u.source_id),
     transactions_received AS (SELECT u.receiver_id,
                                      count(u.id) AS tx_count
                               FROM user_commands u
                                        LEFT JOIN blocks_user_commands b ON b.user_command_id = u.id
                               WHERE b.status = 'applied'::transaction_status
                               GROUP BY u.receiver_id)
SELECT pk.id                                   AS account_id,
       pk.value                                AS account_key,
       COALESCE(bw.blocks_win, 0::bigint)      AS blocks_win,
       COALESCE(bt.blocks_produced, 0::bigint) AS blocks_total,
       COALESCE(bc.blocks_produced, 0::bigint) AS blocks_canonical,
       COALESCE(be.blocks_produced, 0::bigint) AS blocks_canonical_epoch,
       COALESCE(ty.tx_count, 0::bigint)        AS tx_try,
       COALESCE(ts.tx_count, 0::bigint)        AS tx_sent,
       COALESCE(tr.tx_count, 0::bigint)        AS tx_received,
       COALESCE(tf.tx_count, 0::bigint)        AS tx_failed
FROM public_keys pk
         LEFT JOIN blocks_win bw ON bw.block_winner_id = pk.id
         LEFT JOIN blocks_total bt ON bt.creator_id = pk.id
         LEFT JOIN blocks_canonical bc ON bc.creator_id = pk.id
         LEFT JOIN blocks_canonical_epoch be ON be.creator_id = pk.id
         LEFT JOIN transactions_try ty ON ty.source_id = pk.id
         LEFT JOIN transactions_sent ts ON ts.source_id = pk.id
         LEFT JOIN transactions_received tr ON tr.receiver_id = pk.id
         LEFT JOIN transactions_failed tf ON tf.source_id = pk.id;

alter table public.v_account_stats
    owner to postgres;

create view public.v_coinbase
            (block_id, height, block_hash, chain_status, timestamp, command_type, tx_hash, coinbase, sequence_no,
             secondary_sequence_no, tx_status, failure_reason, confirm, receiver_id, receiver_key, receiver_name,
             creator_id, creator_key, creator_name)
as
SELECT b.id                                            AS block_id,
       b.height,
       b.state_hash                                    AS block_hash,
       b.chain_status,
       b."timestamp",
       ic.command_type,
       ic.hash                                         AS tx_hash,
       COALESCE(ic.fee, 0::text)                       AS coinbase,
       bic.sequence_no,
       bic.secondary_sequence_no,
       bic.status                                      AS tx_status,
       bic.failure_reason,
       ((SELECT max(blocks.height) AS max
         FROM blocks)) - b.height                      AS confirm,
       ic.receiver_id,
       pk.value                                        AS receiver_key,
       COALESCE(wh.name, 'noname'::character varying)  AS receiver_name,
       b.creator_id,
       pk2.value                                       AS creator_key,
       COALESCE(wh2.name, 'noname'::character varying) AS creator_name
FROM blocks b
         LEFT JOIN blocks_internal_commands bic ON bic.block_id = b.id
         LEFT JOIN internal_commands ic ON ic.id = bic.internal_command_id
         LEFT JOIN public_keys pk ON pk.id = ic.receiver_id
         LEFT JOIN whois wh ON wh.public_key_id = ic.receiver_id
         LEFT JOIN public_keys pk2 ON pk2.id = b.creator_id
         LEFT JOIN whois wh2 ON wh2.public_key_id = b.creator_id
WHERE b.chain_status = 'canonical'::chain_status_type
  AND (ic.command_type = 'coinbase'::internal_command_type OR ic.command_type IS NULL)
ORDER BY b.height DESC;

alter table public.v_coinbase
    owner to postgres;

create view public.v_accounts
            (id, key, name, logo, site, telegram, twitter, github, discord, description, balance, locked,
             balance_block_id, balance_block_height, balance_block_hash, delegate_key, delegate_name,
             receipt_chain_hash)
as
SELECT pk.id,
       pk.value                                     AS key,
       COALESCE(wh.name, ''::character varying)     AS name,
       COALESCE(wh.logo, ''::character varying)     AS logo,
       COALESCE(wh.site, ''::character varying)     AS site,
       COALESCE(wh.telegram, ''::character varying) AS telegram,
       COALESCE(wh.twitter, ''::character varying)  AS twitter,
       COALESCE(wh.github, ''::character varying)   AS github,
       COALESCE(wh.discord, ''::character varying)  AS discord,
       COALESCE(wh."desc", ''::text)                AS description,
       COALESCE(((SELECT b.total
                  FROM balances b
                  WHERE b.public_key_id = pk.id
                  ORDER BY b.block_id DESC
                  LIMIT 1))::bigint, 0::bigint)     AS balance,
       COALESCE(((SELECT b.locked
                  FROM balances b
                  WHERE b.public_key_id = pk.id
                  ORDER BY b.block_id DESC
                  LIMIT 1))::bigint, 0::bigint)     AS locked,
       (SELECT b.block_id
        FROM balances b
        WHERE b.public_key_id = pk.id
        ORDER BY b.block_id DESC
        LIMIT 1)                                    AS balance_block_id,
       (SELECT bl.height
        FROM balances b
                 LEFT JOIN blocks bl ON bl.id = b.block_id
        WHERE b.public_key_id = pk.id
        ORDER BY b.block_id DESC
        LIMIT 1)                                    AS balance_block_height,
       (SELECT bl.state_hash
        FROM balances b
                 LEFT JOIN blocks bl ON bl.id = b.block_id
        WHERE b.public_key_id = pk.id
        ORDER BY b.block_id DESC
        LIMIT 1)                                    AS balance_block_hash,
       l.delegate_key,
       COALESCE(wh2.name, ''::character varying)    AS delegate_name,
       l.receipt_chain_hash
FROM public_keys pk
         LEFT JOIN whois wh ON wh.public_key_id = pk.id
         LEFT JOIN account_identifiers ai ON ai.public_key_id = pk.id AND ai.token_id = 1
         LEFT JOIN v_ledger_staking l ON l.public_key_id = pk.id
         LEFT JOIN whois wh2 ON wh2.public_key_id = l.delegate_key_id;

alter table public.v_accounts
    owner to postgres;

create view public.v_hard_fork_block(height, state_hash, timestamp) as
SELECT height,
       state_hash,
       "timestamp"
FROM blocks b
WHERE chain_status = 'canonical'::chain_status_type
  AND global_slot_since_hard_fork = 0
ORDER BY height DESC
LIMIT 1;

alter table public.v_hard_fork_block
    owner to postgres;

