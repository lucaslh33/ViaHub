# Requisitos do ExcursãoPro

**Versão 0.1** · 13 de novembro de 2026 · Em validação

## Objetivo

O ExcursãoPro ajuda organizadores de excursões a controlar reservas, montar a lista de passageiros, distribuir poltronas e acompanhar pagamentos por viagem. Essas necessidades surgiram na primeira conversa com um organizador, que já usa um site e relatou precisar de apoio para essas tarefas.

Nesta versão proposta, o organizador cadastra a viagem, registra as reservas e confirma os pagamentos que recebeu.

## Requisitos funcionais por tela

### 1. Cadastro e acesso do organizador

| ID | Requisito | Comportamento esperado |
| --- | --- | --- |
| RF01 | Criar conta | O organizador informa nome, e-mail, senha e confirmação de senha. O sistema confirma quando a conta é criada. |
| RF02 | Validar cadastro | O sistema indica campos obrigatórios e impede o cadastro com e-mail inválido ou já cadastrado, ou com senhas diferentes. |
| RF03 | Entrar no sistema | O organizador acessa sua área de viagens com e-mail e senha. |

### 2. Lista de viagens e formulário da viagem

| ID | Requisito | Comportamento esperado |
| --- | --- | --- |
| RF04 | Listar viagens | A tela mostra todas as viagens do organizador, com destino, data e horário de saída e quantidade de poltronas disponíveis. |
| RF05 | Cadastrar e editar viagem | O organizador informa origem, destino, data e horário de saída, as poltronas do veículo e os pontos do itinerário. Cada ponto tem tipo (embarque ou parada), local e horário previsto. |
| RF06 | Abrir viagem | Ao selecionar uma viagem, o organizador acessa seu itinerário, as poltronas, a lista de passageiros e os pagamentos. |

### 3. Detalhes da viagem e reservas

| ID | Requisito | Comportamento esperado |
| --- | --- | --- |
| RF07 | Consultar itinerário | A tela mostra pontos de embarque e paradas na ordem do trajeto, com o local e o horário previsto de cada ponto. |
| RF08 | Consultar poltronas | A tela mostra as poltronas numeradas e identifica cada uma como **Disponível** ou **Reservada**. |
| RF09 | Reservar poltrona | O organizador seleciona uma poltrona disponível, informa o nome do passageiro, escolhe um ponto de embarque cadastrado na viagem, informa o valor da reserva e confirma. |
| RF10 | Consultar passageiros | A lista da viagem mostra o nome de cada passageiro com reserva ativa, a poltrona, o ponto de embarque e a situação do pagamento. |
| RF11 | Trocar poltrona ou cancelar reserva | O organizador pode trocar a poltrona por outra disponível ou cancelar a reserva. A poltrona anterior volta a ficar disponível após a confirmação da operação. |

### 4. Pagamentos da viagem

| ID | Requisito | Comportamento esperado |
| --- | --- | --- |
| RF12 | Consultar pagamentos | A área da viagem mostra o passageiro, a poltrona, o valor da reserva e a situação do pagamento. O organizador pode filtrar por **Pendente** ou **Concluído**. |
| RF13 | Registrar recebimento | Após confirmar que recebeu o valor total da reserva, o organizador marca o pagamento como **Concluído**. O sistema registra a data da confirmação. |

## Regras de negócio

| ID | Regra |
| --- | --- |
| RN01 | Cada poltrona admite uma única reserva ativa por viagem, inclusive quando duas tentativas de reserva ocorrem ao mesmo tempo. Se a poltrona já tiver sido reservada, o sistema informa a indisponibilidade. |
| RN02 | A reserva confirmada ocupa a poltrona mesmo com pagamento **Pendente**. O cancelamento libera a poltrona. |
| RN03 | Toda nova reserva começa com pagamento **Pendente**. A confirmação de recebimento é manual. |

## Requisitos não funcionais

| ID | Requisito | Como verificar |
| --- | --- | --- |
| RNF01 | Uso em celular e computador | Em ambos, é possível navegar pelas telas, consultar a disponibilidade e selecionar uma poltrona. |
| RNF02 | Controle de acesso | Uma conta só consegue consultar ou alterar as próprias viagens, reservas e pagamentos, inclusive ao tentar abrir diretamente um endereço de outra conta. |
| RNF03 | Proteção de credenciais | As senhas são armazenadas com hash. As áreas que exibem dados de passageiros exigem login. |
| RNF04 | Identificação dos estados | Os estados das poltronas e dos pagamentos são compreensíveis por texto ou legenda com identificação além da cor. |
| RNF05 | Consistência da disponibilidade | Após a confirmação de uma reserva, troca ou cancelamento, a disponibilidade exibida nos detalhes e na lista de viagens corresponde à ocupação registrada. |

## Pontos para validar com outros organizadores

1. Quem escolhe a poltrona no dia a dia, o organizador ou o passageiro? Se o passageiro escolhe, como ele recebe acesso à viagem?
2. Quanto tempo uma reserva sem pagamento deve segurar a poltrona? A liberação é manual ou segue um prazo?
3. É comum receber sinal ou aceitar pagamentos em partes? Nesse caso, quais valores o organizador precisa acompanhar?

## Cenário de aceitação

O organizador cadastra uma viagem com um ponto de embarque e uma parada, abre a viagem pela lista e reserva a poltrona 12 para um passageiro. A poltrona aparece como **Reservada**, a quantidade de vagas diminui e o passageiro aparece na lista com seu ponto de embarque. O pagamento aparece como **Pendente**. Ao registrar o recebimento, o pagamento passa a **Concluído** e a data da confirmação fica registrada.
