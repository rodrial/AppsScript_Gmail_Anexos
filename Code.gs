// --- CONFIGURAÇÕES GERAIS ---

// Nome do marcador/etiqueta que será adicionado aos e-mails processados
const MARCADOR_PROCESSADO = "Anexo_Salvo";

// --- CONFIGURAÇÕES DE NOTIFICAÇÃO ---
// E-mail de destino para receber o relatório de execução
const EMAIL_NOTIFICACAO = "seu.email.aqui@exemplo.com"; 
// ------------------------------------

/**
 * Objeto de configuração que mapeia o Assunto do e-mail
 * para o ID da Pasta correspondente no Google Drive.
 * (Mantenha este objeto como você o configurou)
 */
const CONFIGURACOES = {
  "Relatório Diário de Vendas": "ID_DA_PASTA_1_RELATORIOS_VENDAS", 
  "Fatura Mensal - Fornecedor X": "ID_DA_PASTA_2_FATURAS",
  "Documento Contratual - Projeto Z": "ID_DA_PASTA_3_CONTRATOS",
  "Notificação de Sistema - Log": "ID_DA_PASTA_4_LOGS_SISTEMA",
  "Backup Semanal Concluído": "ID_DA_PASTA_5_BACKUPS"
};

// ----------------------

/**
 * Itera sobre as configurações e salva anexos de cada assunto na pasta correta.
 */
function salvarAnexosComAssunto() {
  
  const startTime = new Date(); // Registra o início da execução
  let anexosProcessados = 0;
  
  // 1. Cria o marcador de e-mail se ele não existir
  let marcador = GmailApp.getUserLabelByName(MARCADOR_PROCESSADO);
  if (!marcador) {
    marcador = GmailApp.createLabel(MARCADOR_PROCESSADO);
  }
  
  // 2. Itera sobre cada par Assunto: ID_Pasta nas configurações
  for (const assunto in CONFIGURACOES) {
    if (CONFIGURACOES.hasOwnProperty(assunto)) {
      const idPasta = CONFIGURACOES[assunto];
      
      Logger.log(`Processando assunto: "${assunto}"`);
      
      // A. Cria a query de pesquisa para o Gmail
      const query = `is:unread subject:"${assunto}" -label:${MARCADOR_PROCESSADO}`;
      
      // B. Obtém os tópicos de e-mail (threads) que correspondem à query
      const threads = GmailApp.search(query);
      
      // C. Verifica a pasta de destino no Drive
      let pastaAlvo;
      try {
        pastaAlvo = DriveApp.getFolderById(idPasta);
      } catch (e) {
        Logger.log(`ERRO: A pasta com ID ${idPasta} para o assunto "${assunto}" não foi encontrada. Pulando.`);
        continue; // Pula para o próximo assunto
      }
      
      // D. Itera sobre os tópicos encontrados
      for (let i = 0; i < threads.length; i++) {
        const messages = threads[i].getMessages();
        
        for (let j = 0; j < messages.length; j++) {
          const message = messages[j];
          
          // Obtém os anexos da mensagem
          const attachments = message.getAttachments();
          
          for (let k = 0; k < attachments.length; k++) {
            const attachment = attachments[k];
            
            // Salva o anexo na pasta de destino correta
            pastaAlvo.createFile(attachment);
            anexosProcessados++; // Incrementa o contador de anexos salvos
            Logger.log(`Anexo salvo: ${attachment.getName()} do e-mail: ${message.getSubject()}`);
          }
          
          // Marca o e-mail como lido e adiciona o marcador de processado
          message.markRead();
          threads[i].addLabel(marcador);
        }
      }
    }
  }
  
  // 3. Chamada da função de notificação após a conclusão do processamento
  const endTime = new Date(); // Registra o final da execução
  enviarNotificacao(startTime, endTime, anexosProcessados);
  
  Logger.log("Processamento de todos os assuntos concluído.");
}


/**
 * Envia um e-mail de notificação com o status e o tempo de execução.
 * @param {Date} startTime - O horário de início da execução.
 * @param {Date} endTime - O horário de término da execução.
 * @param {number} anexosProcessados - O número total de anexos salvos.
 */
function enviarNotificacao(startTime, endTime, anexosProcessados) {
  
  // Formata os horários
  const fusoHorario = Session.getScriptTimeZone();
  const dataHoraExecucao = Utilities.formatDate(startTime, fusoHorario, 'dd/MM/yyyy HH:mm:ss');
  const duracao = (endTime.getTime() - startTime.getTime()) / 1000; // Duração em segundos

  const subject = `✅ Sucesso - Execução de Automação de Anexos do Gmail`;
  
  const body = `
  A execução semanal do script de salvamento de anexos do Gmail foi concluída com sucesso.

  Detalhes da Execução:
  ------------------------------------------------
  * **Data e Hora de Início:** ${dataHoraExecucao}
  * **Duração Total:** ${duracao.toFixed(2)} segundos
  * **Total de Anexos Processados:** ${anexosProcessados}
  * **Configurações Verificadas:** ${Object.keys(CONFIGURACOES).length} assuntos/pastas.
  ------------------------------------------------
  
  Verifique a pasta do Google Drive para os arquivos salvos.
  
  Atenciosamente,
  Seu Script de Automação.
  `;
  
  try {
    MailApp.sendEmail({
      to: EMAIL_NOTIFICACAO,
      subject: subject,
      htmlBody: body // Usa HTML para formatação em negrito e listas
    });
    Logger.log(`E-mail de notificação enviado para: ${EMAIL_NOTIFICACAO}`);
  } catch (e) {
    Logger.log(`ERRO ao enviar e-mail de notificação: ${e}`);
  }
}
//Adiciona script principal para salvar anexos
