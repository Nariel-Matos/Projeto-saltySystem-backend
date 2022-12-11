create database bdSalt;

create table usuarios(
    id serial primary key,
    nome text not null,
    email text not null,
    senha text not null
)

create table contatos(
    id serial primary key,
    nome text not null,
    email text not null,
    contato_id integer not null references usuarios(id),
    usuario_id integer  not null references usuarios(id)
)

create table mensagens(
    id serial primary key,
    mensagens text not null,
    data  timestamp default now(),
    usuario_id integer  not null references usuarios(id)
)

create table backup(
    id serial primary key,
    mensagens text not null,
    data  timestamp default now(),
     usuario_id integer  not null references usuarios(id)    
)
