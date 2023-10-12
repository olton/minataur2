create table public.balances
(
    public_key_id bigint not null,
    block_id      bigint not null,
    total         text,
    liquid        text,
    locked        text,
    unknown       text,
    constraint balances_pk
        primary key (public_key_id, block_id)
);

alter table public.balances
    owner to mina;

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

create table public.ledger
(
    public_key_id           bigint           not null
        constraint ledger_current___fk_public_key
            references public.public_keys,
    balance                 bigint default 0 not null,
    delegate_key_id         bigint
        constraint ledger_current___fk_delegate_key
            references public.public_keys,
    nonce                   bigint default 0 not null,
    receipt_chain_hash      varchar(52),
    voting_for              varchar(52),
    token_id                bigint           not null,
    initial_balance         bigint,
    initial_minimum_balance bigint,
    cliff_time              bigint,
    cliff_amount            bigint,
    vesting_period          bigint,
    vesting_increment       bigint,
    epoch_since_genesis     bigint default 0 not null,
    epoch_since_hard_fork   bigint default 0 not null
);

alter table public.ledger
    owner to mina;

create index idx_ledger_epoch_number_since_genesis
    on public.ledger (epoch_since_genesis);

create index idx_ledger_epoch_number_since_har_fork
    on public.ledger (epoch_since_hard_fork);

create index idx_ledger_receipt
    on public.ledger (receipt_chain_hash);

create index idx_ledger_voting
    on public.ledger (voting_for);

create index idx_ledger_public_key
    on public.ledger (public_key_id);

create index idx_ledger_delegate_key_id
    on public.ledger (delegate_key_id);

create table public.peers
(
    id        varchar(100)         not null
        constraint pk_peers
            primary key,
    host      varchar(50)          not null,
    port      integer default 8302 not null,
    location  varchar(100),
    org       varchar(100),
    latitude  numeric,
    longitude numeric
);

alter table public.peers
    owner to mina;

create index idx_peers_coordinates
    on public.peers (latitude, longitude);

create index idx_peers_location
    on public.peers (location);

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
    public_key_id bigint not null
        constraint address_pk
            primary key
        constraint fk_address_public_key
            references public.public_keys,
    name          varchar(100),
    site          varchar(100),
    telegram      varchar(50),
    discord       varchar(50),
    email         varchar(100),
    twitter       varchar(100),
    github        varchar(100),
    logo          varchar(255),
    "desc"        text
);

alter table public.whois
    owner to mina;

create unique index ui_address_public_key
    on public.whois (public_key_id);

