# 🚀 Netsuite Customization Project

![GitHub repo size](https://img.shields.io/github/repo-size/gustavo-mmh/Netsuite)
![GitHub last commit](https://img.shields.io/github/last-commit/gustavo-mmh/Netsuite)
![GitHub stars](https://img.shields.io/github/stars/gustavo-mmh/Netsuite?style=social)

Este repositório contém a customização de um processo no NetSuite utilizando JavaScript. O projeto envolve a integração com uma API externa para obter dados da Receita Federal e preencher automaticamente campos de cadastro.

## 🔥 Funcionalidades
- **Integração com a API da ReceitaWS**: Busca e preenche automaticamente os dados empresariais a partir do CNPJ informado.
- **Manipulação de campos no NetSuite**: Atualiza campos de nome fantasia, razão social, telefone e endereço.
- **Gerenciamento de endereços**: Insere e atualiza informações do endereço empresarial.
- **Cadastro de atividades empresariais**: Preenche automaticamente as atividades principais e secundárias da empresa.

## 🛠 Tecnologias Utilizadas
- **NetSuite SuiteScript 2.x**
- **JavaScript**
- **API ReceitaWS**

## 📌 Como Utilizar
1. **Configurar o NetSuite**
   - Criar um script do tipo `ClientScript` no NetSuite.
   - Subir o arquivo `apicnpk.js` no sistema.
   - Associar o script ao formulário desejado.

2. **Funcionamento**
   - Ao preencher o campo de CNPJ no cadastro, o script faz uma requisição à API ReceitaWS.
   - Os dados são retornados e automaticamente inseridos nos campos do NetSuite.

## 📖 Exemplo de Uso
1. Inserir um CNPJ no campo correspondente.
2. O script consulta a API e retorna os dados da empresa.
3. Os campos como Nome Fantasia, Razão Social, Telefone e Endereço são preenchidos automaticamente.

## 📂 Estrutura do Código
- `fieldChanged(scriptContext)`: Identifica alterações nos campos e dispara a busca na API.
- `getReceitaws(cnpj)`: Realiza a requisição HTTP para obter os dados.
- `setBodyFields(scriptContext)`: Preenche os campos da empresa com os dados recebidos.
- `insertAddress(currentRecord, responseBody)`: Insere e atualiza informações de endereço.
- `setAtividadesComplementares(currentRecord, responseBody)`: Preenche a lista de atividades empresariais.

## 📩 Contato
Caso tenha dúvidas ou sugestões, fique à vontade para abrir uma issue ou entrar em contato.

---

Este projeto foi desenvolvido para aprimorar processos de cadastro e automação no NetSuite, otimizando o tempo e a precisão das informações cadastradas.

