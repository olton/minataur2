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

create table public.uptime_sidecar
(
    public_key_id bigint    not null,
    timestamp     timestamp not null,
    position      integer,
    score         integer,
    score_percent numeric(10, 2)
);

alter table public.uptime_sidecar
    owner to mina;

create index uptime_sidecar_time_score
    on public.uptime_sidecar (timestamp, score);

create index uptime_sidecar_pk
    on public.uptime_sidecar (public_key_id);

create table public.uptime_snark
(
    public_key_id bigint    not null,
    timestamp     timestamp not null,
    position      integer,
    score         integer,
    score_percent numeric(10, 2)
);

alter table public.uptime_snark
    owner to mina;

create index uptime_snark_time_score
    on public.uptime_snark (timestamp, score);

create index uptime_snark_pk
    on public.uptime_snark (public_key_id);

create table public.whois
(
    public_key_id bigint            not null
        constraint address_pk
            primary key
        constraint fk_address_public_key
            references public.public_keys,
    name          varchar(100),
    site          varchar(100),
    telegram      varchar(50),
    discord_group varchar(50),
    discord_user  varchar(50),
    email         varchar(100),
    twitter       varchar(100),
    github        varchar(100),
    logo          varchar(255),
    found         integer default 0 not null,
    payout        varchar(50),
    fee           numeric,
    description   text
);

alter table public.providers
    owner to mina;

create unique index ui_address_public_key
    on public.providers (public_key_id);

create index idx_address_scammer
    on public.providers (scammer);

create index idx_address_found
    on public.providers (found);

