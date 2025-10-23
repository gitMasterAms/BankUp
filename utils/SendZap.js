const fetch = require("node-fetch");

// Configurações
const WABA_ID = "1921799088668149";       // ID da sua conta WhatsApp Business
const ACCESS_TOKEN = "EAAPobAo22l8BPJfqzEyBCjiFzmelqctjWv3B9ZB8vvchDZAJEVKGaT3e1MSKP1lOQW5wgy411Xk7hMzPxF3GlZAzmDqZAKLNOpM1p4LHN1hGGyZBZCy6T0pW8Sjs8Hfb7hTw6IRD2Xy0pqZAy0PhMw5hJdBKiDwrD3ZAem5i80EZBfiHlZCZAoluBsxYrFZBYfcYLvp1FTR0NCYM68HK40HRZAIIP2fzi2qxF5uoazbUitmxrOp8IRgZDZD";    // token que você já gerou
const API_URL = `https://graph.facebook.com/v17.0/${WABA_ID}/messages`;

// Função para enviar mensagem template
async function enviarTemplateQRCode(devedor, cobranca) {
  /*
    devedor = { nome: "João", telefone: "+5511999999999" }
    cobranca = { descricao: "Mensalidade Agosto", valor: "R$ 150,00", linkPagamento: "https://meusistema.com/qrcode/123" }
  */

  const body = {
    messaging_product: "whatsapp",
    to: devedor.telefone,
    type: "template",
    template: {
      name: "cobranca_qrcode", // nome do template aprovado na Meta
      language: { code: "pt_BR" },
      components: [
        {
          type: "body",
          parameters: [
            { type: "text", text: devedor.nome },
            { type: "text", text: cobranca.descricao },
            { type: "text", text: cobranca.valor },
            { type: "text", text: cobranca.linkPagamento }
          ]
        }
      ]
    }
  };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${ACCESS_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    console.log("Mensagem enviada:", data);
    return data;
  } catch (err) {
    console.error("Erro ao enviar mensagem:", err);
  }
}

// Exemplo de uso
const devedor = { nome: "João", telefone: "+5511999999999" };
const cobranca = { descricao: "Mensalidade Agosto", valor: "R$ 150,00", linkPagamento: "https://meusistema.com/qrcode/123" };

enviarTemplateQRCode(devedor, cobranca);
