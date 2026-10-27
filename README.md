# Sócios AutoZap

Portal estático de consulta por link individual. Domínio previsto: https://socio.autozap.log.br/

Não contém dados reais de investidores, não confirma pagamentos e não cria registros pelo navegador.

A configuração `config.js` tem `api` vazio enquanto o serviço privado de participações não estiver implantado. Quando ativado, consulta GET `/v1/membership` com o token individual em Authorization e recebe nome, quantidade, data, identificador e referência de formalização. Dados não confirmados não devem ser retornados pela API.

Para ativar: implantar o serviço privado `autozap-investimentos-servico`, configurar HTTPS e backup, incluir `https://socio.autozap.log.br` em ALLOWED_ORIGINS e configurar a mesma URL de API nos sites de investimentos e de sócios. Testar a autorização e a transição pagamento confirmado → registro. Não colocar credenciais administrativas ou documentos no GitHub.

O link é uma credencial privada, transmitida em fragmento da URL e no cabeçalho da API. Não há busca pública por nome, lista pública de titulares, e-mail automático ou recuperação de acesso implementada.

Publicação: GitHub Pages, branch main, diretório raiz. CNAME no Cloudflare para rafaelpacheco45.github.io.
