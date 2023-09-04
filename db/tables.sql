create table public.ip
(
    ip   varchar(50)                      not null,
    date date   default CURRENT_TIMESTAMP not null,
    hits bigint default 1                 not null,
    constraint ip_pk
        primary key (ip, date)
);

alter table public.ip
    owner to mina;

create index idx_ip_address
    on public.ip (ip);

