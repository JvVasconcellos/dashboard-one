import axios from 'axios';
import sydleMessenger from './sydle-messenger';


const axiosApi = axios.create({
    baseURL: `${process.env.REACT_APP_SYDLE_ONE_ENDPOINT}${process.env.REACT_APP_SYDLE_ONE_API}`,
    headers: {
      'Authorization': `Bearer ${process.env.REACT_APP_SYDLE_ONE_TOKEN}`,
      'Content-Type': 'application/json',
    },
})

// Interceptor para utilizar token do usuário logado
axiosApi.interceptors.request.use(async function (config) {
    // Utiliza token da aplicação para métodos, exceto CRUD
    let isCRUDMethod = [
        "/sydleDocs/documentation/_get",
        "/sydleDocs/documentation/_delete",
        "/sydleDocs/documentation/_createDraft"
    ].some(method => method === config.url);
    
    if (isCRUDMethod) {
        const token = await sydleApi.getToken();
        config.headers.Authorization =  'Bearer ' + token;
    } 
    return config;
});

const sydleApi = {
    getDashboardObj: (params) => {
        console.log('getDocObj...');
        const result = axiosApi.post('/sydleDashboard/dashboard/_get', params)
        .then(response => {
            if (response.status === 200) {
                console.log('Request getDashboardObj');
                return response.data;
            }
        })
        .catch(error => {
            console.log('Erro ao realizar requisição para obter objeto de dashboard:', error);
            return 'Item não encontrado.';
        });

        return result;
    },
    createDraft: (objectId) => {
        const result = axiosApi.post('/sydleDashboard/dashboard/_createDraft', {_id: objectId})
        .then(response => {
            if (response.status === 200) {
                console.log('Request createDraft');
                return response.data;
            }
        })
        .catch(error => {
            console.log('Erro ao realizar requisição para obter rascunho:', error);
        });

        return result;
    },
    getAcl: (params) => {
        const result = axiosApi.post('/sydleDashboard/dashboard/hasAccess', params)
        .then(response => {
            if (response.status === 200) {
                console.log('Request getAcl');
                return response.data;
            }
        })
        .catch(error => {
            console.log('Erro ao realizar requisição para obter acl do objeto:', error);
        });

        return result;
    },
    getToken: () => {
        const queryParams = new URLSearchParams(window.location.search);
        const viewId = queryParams.get('vid');
        const usedByIframe = queryParams.get('iframe');

        if (usedByIframe) {
            const result = new Promise((resolve, reject) => {
                try {
                    // todo: implementar token do usuário logado no SD
                    resolve(process.env.REACT_APP_SYDLE_ONE_TOKEN);
                } catch (e) {
                    reject('Erro ao obter token do usuário logado no SD', e);
                }
            })
            .then(res => {
                console.log('Request getToken localstorage');
                return res;
            })
            .catch(err => {
                console.log('Request getToken default');
                return process.env.REACT_APP_SYDLE_ONE_TOKEN;
            });

            return result;
        } else {
            const result = new Promise((resolve, reject) => {
                window.addEventListener('message', (ev) => {
                    if (ev && ev.data) {
                        const data = JSON.parse(ev.data);
                        console.log('response message', data)
                        if (data.body.accessToken) {
                            resolve(data.body.accessToken);
                        } else {
                            reject(ev);
                        }
                    }
                })

                // Envia mensagem para ONE solicitando token
                sydleMessenger.sendMessage('getViewToken', { viewId: viewId}, null, { slot: null, target: '_workspace' });
            })
            .then(res => {
                console.log('Request getToken');
                return res;
            })
            .catch(err => {
                console.log('Request getToken default');
                return process.env.REACT_APP_SYDLE_ONE_TOKEN;
            });

            return result;
        }
    },
    _delete: (_object) => {
        const result = axiosApi.post('/sydleDashboard/dashboard/_delete', _object)
        .then(response => {
            console.log('response delete',response)
            if (response.status === 200 || response.status === 204) {
                console.log('Request _delete');
                return 'success';
            }
        })
        .catch(error => {
            console.log('Erro ao realizar requisição para deletar objeto:', error);
        });

        return result;
    },
    openServiceInSD: (_object) => {
        const result = axiosApi.post('sydleDashboard/dashboard/openServiceInSD', _object)
        .then(response => {
            console.log('response openServiceInSD', response)
            if (response.status === 200 || response.status === 204) {
                console.log('Request openServiceInSD');
                return response.data.serviceUrl;
            }
        })
        .catch(error => {
            console.log('Erro ao realizar requisição para obter url do serviço:', error);
        });

        return result;
    }
}

export default sydleApi;