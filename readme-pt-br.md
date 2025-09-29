<div align="center">
<h1 align="center">BankUp</h1>
<h3><a href="README-pt-br.md">Português Brasileiro</a> | <a href="README-en.md">English | <a href="README-es.md">Español</a></h3>
<a href="https://www.imagensanimadas.com/cat-linhas-562.htm"><img src="https://www.imagensanimadas.com/data/media/562/linha-imagem-animada-0168.gif" border="0" alt="linha-imagem-animada-0168" /></a>
  
<br>
<strong><p>Automatize sua cobrança. Receba sem pedir, lembre sem insistir.</p></strong>
<br>
  
<p align="justify">BankUp é uma ferramenta que possibilita a qualquer indivíduo administrar e cobrar seus clientes com apenas alguns cliques, eliminando a necessidade de contatos constantes ou de alertas para lembrar de cobranças em atraso.
Projetado para se transformar em uma fintech e, no futuro, em um banco digital, o BankUp se concentra na automatização de pagamentos de contas. A plataforma disponibiliza integração com WhatsApp e e-mail, oferecendo conveniência ao usuário e envio automático de notificações para quem cobra e para quem deve pagar.
O BankUp surge como uma novidade no mercado, com o objetivo de revolucionar a forma como as pessoas gerenciam suas finanças cotidianas.</p>
</div>

<div align="left">
<h2>Súmario</h2>

<ul>
  <li><a href="#sobre-nós">Sobre nós</a></li>
  <li><a href="#características">Características</a></li>
  <li><a href="#metas-para-o-futuro">Metas para o futuro</a></li>
  <li><a href="#documentação">Documentação</a></li>
  <li><a href="#acesso--como-usar">Acesso & Como usar</a></li>
</ul>

<h2>Sobre nós</h2>

<p align="justify">O BankUp foi desenvolvido através de uma colaboração entre a Fatec Taubaté e uma Fintech. Nessa colaboração, os estudantes do curso de Análise e Desenvolvimento de Sistemas (ADS) foram encarregados da concepção, planejamento e execução do projeto. No total, 14 estudantes estão ativamente envolvidos no progresso deste projeto. Todos assumindo suas obrigações devidas.</p>

> Interessado no nosso trabalho? <a href="https://bankup.online/sobre">Conheça a função de cada um no projeto</a>.

<h2>Caracteristicas</h2>

- [x] Cadastro de cobradores de diversos setores *(ex.aluguel, pequenas empresas, comercio)*;
- [x] Cadastro de clientes dos cobradores de diversos setores *(ex.aluguel, pequenas empresas, comercio)*;
- [x] Oferece um plano gratuito de 6 meses para novos usuarios;
- [x] Oferece opções por meios de cobrar atraves do Whatsapp e do e-mail;
- [x] Filtro de clientes dos cobradores *(quem está devendo, quem está em dia e quem ainda não pagou)*;
- [x] Gráficos;
- [X] Acesso a comprovantes, histórico de envio de pagamento das cobranças dos clientes e etc;

<h2>Metas para o futuro</h2>
<p>O BankUp tem como metas passar pelas seguiente etapas, apesar de o MVP inicial do BANKUP já demonstra funcionalidades centrais: cadastro de usuários, gestão de contas e envio de notificações automatizadas. A arquitetura foi concebida em microsserviços, utilizando React.js no frontend, Node.js no backend, e PostgreSQL como banco relacional, assegurando desempenho em tempo real e escalabilidade. Essa escolha tecnológica é validada por grandes players do setor financeiro global, como PayPal e Stripe, reforçando a robustez do projeto. O plano de evolução prevê três estágios:
</p>

<ul>
  <li>Validação (0–6 meses): Testar aderência do produto, aceitação das notificações e retenção de usuários. Meta de 1.000 MAU e retenção D30 de 15%.</li>
  <li>Tração (7–12 meses): Otimizar marketing, lançar programa de indicação e ativar monetização com taxa de 0,1%. Meta de 10.000 MAU e R$ 10 milhões em volume de pagamentos.</li>
  <li>Escala (após 12 meses): Consolidar integração com PIX Automático, ampliar parcerias estratégicas e garantir crescimento sustentável.</li>
</ul>

<h2>Documentação</h2>


| 📄 Documento              | 📝 Descrição                     | 📅 Data       |
|---------------------------|----------------------------------|---------------|
| [Planejamento](./time-documents/Reuni%C3%A3o%20geraL%201.pdf) | Esse documento contém de forma organizada a data de todas as spritns planejadas para o projeto  | Abril 2025 |
| [Divisão das equipes](./time-documents/Reuni%C3%A3o%20geraL%201.pdf) | Esse documento descreve o funcionamento e divisão das equipes do projeto  | Abril 2025 |
| [Reunião geral](./time-documents/Reuni%C3%A3o%20geraL%201.pdf) | ATA | Setembro 2025 |

<h2>Acesso&Como usar</h2>

Para rodar o código, verificar se o banco postgre está instalado (ao instalar, defina a senha como `"postgres"` e o usuario como `"postgres"`, caso apareçam. Tudo como `"postgres"`). E se as variáveis de ambiente estão corretas no arquivo `.env` (atenção especial para o nome de usuário e senha do banco).
Dentro da pasta "BankUp" dê um:
`"npm install"`

Para baixar as dependências. Após isso rode `"npm run start"` para iniciar o servidor na url `"localhost:3003".` 
Pressione `Ctrl + C` dentro do terminal se quiser parar a execução.
Ou acesse o nosso projeto online: https://bankup.online/
