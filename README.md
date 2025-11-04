💾 Automação de Anexos do Gmail para Google Drive (Apps Script)
Este projeto contém um script desenvolvido em Google Apps Script (JavaScript) que automatiza o processo de busca e salvamento de anexos do Gmail diretamente no Google Drive. Ele é configurado para monitorar múltiplos assuntos de e-mail e direcionar os anexos para pastas específicas, além de enviar uma notificação por e-mail após a conclusão da execução.

⚙️ Funcionalidades
Busca por Assunto: Procura e-mails não lidos que contenham assuntos específicos definidos na configuração.

Múltiplas Pastas: Mapeia cada assunto de e-mail para um ID de pasta de destino exclusivo no Google Drive.

Prevenção de Duplicidade: Marca os e-mails processados com a etiqueta Anexo_Salvo para garantir que sejam processados apenas uma vez.

Notificação de Sucesso: Envia um e-mail de notificação para um endereço específico informando a duração e o status da execução.

Execução Agendada: Projetado para ser executado automaticamente através de um Gatilho (Trigger) baseado em tempo (ex: semanalmente).

🛠️ Configuração Inicial
Siga estas etapas para colocar o script em funcionamento na sua conta Google.

1. Preparação do Google Drive
Crie as pastas de destino no seu Google Drive (ex: "Relatórios de Vendas", "Faturas", "Contratos").

Obtenha os IDs das Pastas: Abra cada pasta no navegador. O ID é a sequência de caracteres na URL após /folders/.

2. Criação do Projeto Apps Script
Acesse Google Apps Script (script.google.com).

Crie um Novo projeto e dê um nome (Ex: Automatizador de Anexos).

No arquivo Code.gs, apague o código padrão.

Copie e cole todo o conteúdo do arquivo Code.gs deste repositório para o seu projeto.

3. Personalização das Configurações
Edite as seguintes constantes no topo do arquivo Code.gs:

EMAIL_NOTIFICACAO: Substitua "seu.email.aqui@exemplo.com" pelo endereço de e-mail que deve receber a notificação de sucesso.

CONFIGURACOES: Atualize este objeto JSON (chave:valor) com seus assuntos exatos e os IDs de pasta obtidos na Etapa 1.

const CONFIGURACOES = {
  "Assunto Exato 1": "ID_DA_PASTA_1_AQUI", 
  "Assunto Exato 2": "ID_DA_PASTA_2_AQUI"
  // ... adicione mais conforme necessário
};
4. Autorização do Script (Permissões)
No editor do Apps Script, selecione a função salvarAnexosComAssunto no menu suspenso.

Clique no botão Executar (o ícone de play).

Na primeira execução, o Google solicitará permissão. Siga as instruções para Revisar permissões. Você precisará conceder acesso ao Gmail (GmailApp), Google Drive (DriveApp) e ao serviço de E-mail (MailApp).

5. Configuração do Gatilho de Execução
Para automatizar a execução (ex: toda segunda-feira), configure um gatilho:

Na barra lateral esquerda do editor, clique no ícone Gatilhos (o relógio).

Clique em Adicionar Gatilho.

Configure:

Escolha qual função executar: salvarAnexosComAssunto

Selecione a fonte do evento: Baseado no tempo

Selecione o tipo de gatilho com base no tempo: Temporizador semanal

Selecione o dia da semana: Segunda-feira

Selecione a hora do dia: Entre 12h e 13h (ou o intervalo desejado).

Clique em Salvar.

Pronto! Seu script será executado automaticamente no agendamento definido.

📝 Observações
Se o script não encontrar um ID de pasta configurado em CONFIGURACOES, ele registrará um erro no log (Logger) e pulará apenas aquele assunto, continuando a processar os demais.

A busca por assunto (subject:"Assunto Aqui") é sensível a espaços e caracteres especiais. Certifique-se de que o texto configurado seja idêntico ao que você espera no Gmail.
