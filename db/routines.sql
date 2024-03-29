create function public.notify_new_block() returns trigger
    language plpgsql
as
$$
begin
    perform pg_notify('new_block', row_to_json(new)::text);
    return null;
end;
$$;

alter function public.notify_new_block() owner to postgres;

create function public.set_block_state() returns trigger
    language plpgsql
as
$$
declare
    chain_row record;
    canonicalHeight bigint;
    expectedBlocksInChain bigint;
    realBlocksInChain bigint;
    k constant bigint := 15;
begin
    select (max(height) - k) into canonicalHeight from blocks where chain_status = 'canonical';

    if (canonicalHeight <= 0) then
        canonicalHeight = 1;
    end if;

    expectedBlocksInChain = new.height - canonicalHeight;

    select into realBlocksInChain count(*) from (
                                                    with recursive chain as (
                                                        select id, state_hash, parent_id, height
                                                        from blocks
                                                        where state_hash = new.state_hash

                                                        union all

                                                        select b.id, b.state_hash, b.parent_id, b.height
                                                        from blocks b
                                                                 inner join chain
                                                                            on b.id = chain.parent_id and chain.height <> canonicalHeight
                                                    )

                                                    select state_hash, height
                                                    from chain
                                                    where height < (select max(height) from blocks)
                                                    order by height
                                                ) as foo;

    if (expectedBlocksInChain = realBlocksInChain) then
        for chain_row in (
            with recursive chain as (
                select id, state_hash, parent_id, height
                from blocks
                where state_hash = new.state_hash

                union all

                select b.id, b.state_hash, b.parent_id, b.height
                from blocks b
                         inner join chain
                                    on b.id = chain.parent_id and chain.height <> canonicalHeight
            )

            select state_hash, height
            from chain
            where height < (select max(height) from blocks)
            order by height
        )
            loop
                update blocks set chain_status = 'canonical' where state_hash = chain_row.state_hash;
                update blocks set chain_status = 'orphaned' where height = chain_row.height and state_hash != chain_row.state_hash;
            end loop;
    end if;

    return new;
end;
$$;

alter function public.set_block_state() owner to postgres;

create function public.notify_new_user_tx_memo() returns trigger
    language plpgsql
as
$$
declare
    receiver_key varchar;
begin
    select value into receiver_key from public_keys where id = new.receiver_id;
    perform pg_notify('new_user_tx_memo', row_to_json((new.source_id, receiver_key, new.memo, new.amount))::text);
    return null;
end;
$$;

alter function public.notify_new_user_tx_memo() owner to postgres;

create function public.notify_canonical_block() returns trigger
    language plpgsql
as
$$
begin
    if (new.chain_status = 'canonical') then
        perform pg_notify('canonical_block', row_to_json(new)::text);
    end if;
    return null;
end;
$$;

alter function public.notify_canonical_block() owner to postgres;

