// testMulta.js

const { Sequelize, DataTypes } = require('sequelize');
const PaymentsRepository = require('../modules/financial/repositories/PaymentsRepository'); // <-- AJUSTE O CAMINHO
const PaymentsService = require('../modules/financial/services/PaymentsService');       // <-- AJUSTE O CAMINHO

// --- PASSO 1: Configuração do ambiente de teste ---
console.log('Configurando ambiente de teste com banco de dados em memória...');

// Usando SQLite em memória para um teste rápido e limpo
const sequelize = new Sequelize('sqlite::memory:');

// Mock do recurringService, já que não precisamos dele para este teste
const mockRecurringService = {};

// Definindo o Model 'Payment' exatamente como no seu projeto
const Payment = sequelize.define('Payment', {
    payment_id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    account_id: { type: DataTypes.UUID, allowNull: false },
    amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    description: { type: DataTypes.STRING(255) },
    due_date: { type: DataTypes.DATEONLY, allowNull: false },
    status: { type: DataTypes.ENUM('pendente', 'concluido', 'vencido'), defaultValue: 'pendente' },
    fine_amount: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.00 },
    interest_rate: { type: DataTypes.DECIMAL(5, 2), defaultValue: 0.00 },
    final_amount: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    pix_key: { type: DataTypes.STRING(32), allowNull: false }
}, { timestamps: false }); // Desativando timestamps para simplificar o teste

// --- PASSO 2: A função principal do teste ---
async function runTest() {
    try {
        await sequelize.sync({ force: true }); // Cria a tabela no banco em memória
        console.log('Tabela "Payments" criada no banco de dados em memória.');

        // Instanciando as classes com os componentes de teste
        const paymentsRepository = new PaymentsRepository(Payment);
        const paymentsService = new PaymentsService(paymentsRepository, mockRecurringService);

        // --- PASSO 3: Criando o cenário de teste ---
        const diasDeAtraso = 5;
        const hoje = new Date();
        const dataVencimento = new Date(hoje.setDate(hoje.getDate() - diasDeAtraso));

        const dadosPagamento = {
            account_id: 'a1b2c3d4-e5f6-a7b8-c9d0-e1f2a3b4c5d6',
            amount: 100.00,
            description: 'Teste de Cobrança Vencida',
            due_date: dataVencimento.toISOString().split('T')[0], // Formato YYYY-MM-DD
            status: 'pendente',
            fine_amount: 2.00,      // Multa de R$2,00
            interest_rate: 1.00,    // Juros de 1% ao mês
            pix_key: 'test@test.com'
        };

        const pagamentoCriado = await paymentsRepository.create(dadosPagamento);
        console.log('\n--- ESTADO ANTES DA EXECUÇÃO ---');
        console.log('Pagamento criado com status "pendente" e vencimento no passado:');
        console.log(JSON.stringify(pagamentoCriado.toJSON(), null, 2));

        // Cálculo esperado (para verificação)
        const jurosCalculados = (100 * (0.01 / 30)) * diasDeAtraso;
        const valorFinalEsperado = 100 + 2 + jurosCalculados;

        console.log(`\nCálculo esperado: R$100 (principal) + R$2.00 (multa) + R$${jurosCalculados.toFixed(2)} (juros) = R$${valorFinalEsperado.toFixed(2)}`);

        // --- PASSO 4: Executando a lógica a ser testada ---
        console.log('\n--- EXECUTANDO A LÓGICA DE MULTA E JUROS ---');
        await paymentsService.processOverduePayments();

        // --- PASSO 5: Verificando o resultado ---
        const pagamentoAtualizado = await paymentsRepository.findById(pagamentoCriado.payment_id);
        console.log('\n--- ESTADO APÓS A EXECUÇÃO ---');
        console.log('Pagamento consultado novamente no banco de dados:');
        console.log(JSON.stringify(pagamentoAtualizado.toJSON(), null, 2));

        console.log('\n--- VERIFICAÇÃO FINAL ---');
        let success = true;

        if (pagamentoAtualizado.status !== 'vencido') {
            console.error(`❌ FALHA: Status deveria ser 'vencido', mas é '${pagamentoAtualizado.status}'`);
            success = false;
        }
        if (Math.abs(pagamentoAtualizado.final_amount - valorFinalEsperado) > 0.01) {
            console.error(`❌ FALHA: Valor final esperado era ~${valorFinalEsperado.toFixed(2)}, mas foi calculado como ${pagamentoAtualizado.final_amount}`);
            success = false;
        }

        if (success) {
            console.log('✅ SUCESSO! A lógica de multa e juros está funcionando como esperado.');
        } else {
            console.log('❗️ O teste encontrou problemas. Verifique as mensagens de FALHA acima.');
        }

    } catch (error) {
        console.error('O teste falhou com um erro inesperado:', error);
    } finally {
        await sequelize.close(); // Fecha a conexão com o banco em memória
        console.log('\nConexão com o banco de dados de teste fechada.');
    }
}

// Roda o teste
runTest();