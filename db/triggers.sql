create trigger tr_ai_notify_new_block
    after insert
    on public.blocks
    for each row
execute procedure public.notify_new_block();

create trigger tr_ai_set_block_state
    after insert
    on public.blocks
    for each row
execute procedure public.set_block_state();

create trigger tr_ai_notify_canonical_block
    after update
    on public.blocks
    for each row
execute procedure public.notify_canonical_block();

