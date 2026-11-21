CREATE DATABASE viahub_db

USE viahub_db

CREATE TABLE tblorganizador(
id_organizador INT PRIMARY KEY IDENTITY(1,1),
nome VARCHAR (100) NOT NULL,
email VARCHAR (100) NOT NULL UNIQUE,
senha VARCHAR (255) NOT NULL
)

CREATE TABLE tblviagem(
id_viagem INT PRIMARY KEY IDENTITY(1,1),
destino VARCHAR (100) NOT NULL,
data_viagem DATETIME2 NOT NULL,
qtde_poltrona INT NOT NULL CHECK (qtde_poltrona > 0),
id_organizador INT NOT NULL,
FOREIGN KEY (id_organizador) REFERENCES tblorganizador(id_organizador)
)

CREATE TABLE tblpViagem(
id_pViagem INT PRIMARY KEY IDENTITY(1,1),
local VARCHAR(100) NOT NULL,
tipo VARCHAR(10) NOT NULL CHECK (tipo IN ('embarque', 'parada')),
data_hora_prevista DATETIME2 NOT NULL,
id_viagem INT NOT NULL,
FOREIGN KEY (id_viagem) REFERENCES tblviagem(id_viagem)
)

CREATE TABLE tblpassageiro(
id_passageiro INT PRIMARY KEY IDENTITY(1,1),
nome_passageiro VARCHAR (100) NOT NULL,
email_passageiro VARCHAR (100) NULL,
contato_passageiro VARCHAR (20) NOT NULL
)

CREATE TABLE tblreserva(
id_reserva INT PRIMARY KEY IDENTITY(1,1),
id_passageiro INT NOT NULL,
id_viagem INT NOT NULL,
numero_poltrona INT NOT NULL CHECK (numero_poltrona > 0),
data_reserva DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
status_reserva VARCHAR(10) NOT NULL DEFAULT 'ativa'
	CHECK (status_reserva IN ('ativa', 'cancelada')),

FOREIGN KEY (id_passageiro) REFERENCES tblpassageiro(id_passageiro),
FOREIGN KEY (id_viagem) REFERENCES tblviagem(id_viagem)
)

CREATE UNIQUE INDEX uq_reserva_poltrona_ativa
ON tblreserva(id_viagem, numero_poltrona)
WHERE status_reserva = 'ativa';

