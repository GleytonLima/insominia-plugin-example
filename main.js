const bufferToJsonObj = buf => JSON.parse(buf.toString('utf-8'));

module.exports.requestHooks = [
    context => {
        //seu código incrível aqui
    }
];

module.exports.responseHooks = [
    context => {
        const resp = bufferToJsonObj(context.response.getBody());
        const postId = resp[0].id
        context.store.setItem("post_id", postId)
    }
];

module.exports.templateTags = [{
    name: 'extract_key_from_store',
    displayName: 'extract from plugin store',
    description: 'Extrai do store um valor dada chave e seta como parametro da requisicao',
    args: [
        {
            displayName: 'Chave',
            description: 'Chave que está no store',
            type: 'string',
            defaultValue: "post_id"
        }
    ],
    async run(context, chave) {
        return context.store.getItem(chave)
    }
}];

module.exports.requestActions = [
    {
        label: 'Visualizar dados request',
        action: async (context, data) => {
            //você pode extrair o store e exibir na janela tbm
            const { request } = data;
            const html = `<code>${JSON.stringify(request)}</code>`;
            context.app.showGenericModalDialog('Results', { html });
        },
    },
];

module.exports.requestGroupActions = [
    {
        label: 'Enviar todas as requests da pasta',
        action: async (context, data) => {
            const { requests } = data;

            let results = [];
            for (const request of requests) {
                const response = await context.network.sendRequest(request);
                results.push(`<li>${request.name}: ${response.statusCode}</li>`);
            }

            const html = `<ul>${results.join('\n')}</ul>`;

            context.app.showGenericModalDialog('Results', { html });
        },
    },
];

module.exports.workspaceActions = [{
    label: 'My Plugin Action',
    icon: 'fa-car',
    action: async (context, models) => {
        console.log("Action from Workspace Actions")
    },
}];

module.exports.documentActions = [{
    label: 'Super Document Actions',
    action: async (context, models) => {
        console.log("Action from Document Actions")
    },
}];