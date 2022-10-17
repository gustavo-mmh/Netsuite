/** [BEGIN] AMD Compatibility Prefix (Inserted By NetSuite) **/
var nlapi = nlapi || {};
nlapi.defineExists = !!define;
try {
    if (!nlapi.defineExists) define = _N_define;
    /** [END] AMD Compatibility Prefix (Inserted By NetSuite) **/

    /**
     *@NApiVersion 2.x
    *@NScriptType ClientScript
    */
    define([
        'N/https', 'N/log', 'N/record', 'N/runtime', 'N/search', 'N/url', 'N/ui/dialog', 'N/currentRecord', 'N/format'
    ],
        function (
            https, log, record, runtime, search, url, dialog, currentRecord, format
        ) {
            // function pageInit() {
            //     var fieldmap = {
            //         "vendor": "vendorname",
            //         "customer": "customername"
            //     }
            //     return
            // }
            // rec.setValue({ fieldId: fieldmap[rec.type], value: fieldmap[rec.value] })
            /**
         * Function to be executed when field is changed.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         * @param {string} scriptContext.fieldId - Field name
         * @param {Record} scriptContext.sublistId.subrecord - Subrecord of sblist name
         */
            function fieldChanged(scriptContext) {
                try {
                    var eventRouter = {
                        "custentity_enl_cnpjcpf": setBodyFields
                    }
                    if (typeof eventRouter[scriptContext.fieldId] !== "function") return;
                    eventRouter[scriptContext.fieldId](scriptContext);
                } catch (e) {
                    console.log("Deu erro");
                    console.log("fieldChanged", e);
                    log.error("fieldChanged", e);
                }
            }
            // function getValueCnpj() {
            //      return cnpj;

            // }
            function getReceitaws(cnpj) {

                var headerObj = {
                    name: 'Accept-Language',
                    value: 'pt-BR'
                };
                //
                var response = https.get({
                    url: 'https://www.receitaws.com.br/v1/cnpj/' + cnpj,
                    headers: headerObj
                });
                return response;
            }
            function setBodyFields(scriptContext) {
                //CRIAR O GETCNPJ, COMO?
                var currentRecord = scriptContext.currentRecord;
                var cnpj = currentRecord.getValue({
                    fieldId: 'custentity_enl_cnpjcpf'
                });
                cnpj = cnpj.replace(/[^\d]+/g, '');
                //
                var receitaws = getReceitaws(cnpj);

                var responseBody = JSON.parse(receitaws.body);
                currentRecord.setValue({ fieldId: 'companyname', value: responseBody.fantasia });
                currentRecord.setValue({ fieldId: 'custentity_enl_legalname', value: responseBody.nome });
                currentRecord.setValue({ fieldId: 'phone', value: responseBody.telefone });
                currentRecord.setValue({ fieldId: 'email', value: responseBody.email });
                currentRecord.setValue({ fieldId: 'custentity_rsc_bday', value: format.parse({ value: responseBody.abertura, type: format.Type.DATE }) });
                insertAddress(currentRecord, responseBody);
                setAtividadesComplementares(currentRecord, responseBody);
            }
            function insertAddress(currentRecord, responseBody) {
                var subrecord = currentRecord.getCurrentSublistSubrecord({
                    sublistId: 'addressbook',
                    fieldId: 'addressbookaddress'
                });
                // var getCountAddress = currentRecord.getLineCount('addressbook')
                // if (getCountAddress > 0) {
                //     var totalAddress = getCountAddress
                //     console.log("chegou no começo do for" + totalAddress)
                //     for (var ad = 1; ad <= totalAddress; ad++) {
                //         console.log("chegou dentro do for")
                //         currentRecord.removeLine("addressbook", 0);
                //     }
                //     console.log("chegou no fim do for" + totalAddress)
                // }

                // console.log(bairro)
                // fieldSubC = subrecord.getField({
                //     fieldId: 'custrecord_enl_city',
                // })
                // fieldSubC.insertSelectOption({
                //     fieldId: 'custrecord_enl_city',
                //     text: responseBody.municipio
                // })
                subrecord.setValue({ fieldId: 'addr1', value: responseBody.logradouro });
                var cep = responseBody.cep;
                cep = cep.replace(/[.-]/g, '');
                // subrecord.setValue({ fieldId: 'zip', value: cep });
                subrecord.setValue({ fieldId: 'custrecord_enl_numero', value: responseBody.numero });
                subrecord.setValue({ fieldId: 'addr2', value: responseBody.complemento });
                subrecord.setValue({ fieldId: 'addr3', value: responseBody.bairro });
                subrecord.setValue({ fieldId: 'addrphone', value: responseBody.telefone });
                subrecord.setValue({ fieldId: 'custrecord_bldk_numero', value: responseBody.numero });
                // var bairro = subrecord.getValue({ fieldId: 'addr3', });
                // var fieldSub = currentRecord.getField({
                //     fieldId: 'custrecord_enl_uf',
                // })
                // fieldSub.insertSelectOption({
                //     value: 'custrecord_enl_uf',
                //     text: responseBody.uf
                // });
                subrecord.setText({
                    fieldId: "custrecord_enl_city",
                    text: responseBody.municipio,
                });
                currentRecord.commitLine('addressbook', 'addressbookaddress');
            }
            function setAtividadesComplementares(currentRecord, responseBody) {
                var atividadePrincipal = responseBody.atividade_principal
                var atividadesSecundarias = responseBody.atividades_secundarias
                var atividadesComplementares = atividadePrincipal.concat(atividadesSecundarias)
                var getCount = currentRecord.getLineCount('recmachcustrecord_ac_customer_ls')

                if (getCount > 0) {
                    var totalAC = getCount
                    console.log('entrou aqui: ' + getCount)
                    for (var j = 1; j <= totalAC; j++) {
                        currentRecord.removeLine("recmachcustrecord_ac_customer_ls", 0);
                    }
                }
                currentRecord.selectNewLine('recmachcustrecord_ac_customer_ls')
                for (var i = 0; i < atividadesComplementares.length; i++) {
                    currentRecord.setCurrentSublistValue({
                        sublistId: "recmachcustrecord_ac_customer_ls",
                        fieldId: "name",
                        value: atividadesComplementares[i].text,
                    });
                    currentRecord.setCurrentSublistValue({
                        sublistId: "recmachcustrecord_ac_customer_ls",
                        fieldId: "custrecord_cod_ac",
                        value: atividadesComplementares[i].code,
                    });
                    currentRecord.commitLine('recmachcustrecord_ac_customer_ls')
                }

            }
            return {
                fieldChanged: fieldChanged,
            }
        });

    /** [BEGIN] AMD Compatibility Suffix (Inserted By NetSuite) **/
} finally {
    if (!nlapi.defineExists) define = undefined;
}
    /** [END] AMD Compatibility Suffix (Inserted By NetSuite) **/