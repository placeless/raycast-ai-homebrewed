import MODELS from './config/models.json' assert { type: 'json' };
import ME from './config/me.json' assert { type: 'json' };
import { RaycastAIData, TranslationData } from './utils/helpers';
import dispatch from './utils/detour';

const JSONResponseHeaders = {
	'Content-Type': 'application/json',
	'Cache-Control': 'no-cache',
	Connection: 'keep-alive',
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Headers': 'Origin, X-Request-With, Content-Type, Accept',
};

const StreamResponseHeaders = {
	'Content-Type': 'text/event-stream',
	'Cache-Control': 'no-cache',
	Connection: 'keep-alive',
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Headers': 'Origin, X-Request-With, Content-Type, Accept',
};

export default {
	async fetch(req, env) {
		const url = new URL(req.url);
		const path = url.pathname;
		const [defaultSearch, uid] = url.search.split('?uid=');

		if (uid !== env.UID) {
			return new Response('Forbidden.', { status: 403 });
		}

		let data;
		let agent;
		let response;

		switch (path) {
			case '/api/v1/me':
				return new Response(JSON.stringify(ME), { JSONResponseHeaders });

			case '/api/v1/ai/models':
				return new Response(JSON.stringify(MODELS), { JSONResponseHeaders });

			case '/api/v1/ai/chat_completions':
				data = await RaycastAIData(req);
				agent = dispatch(env, data);
				response = await agent.onCompletion(data);
				return new Response(response, { StreamResponseHeaders });

			case '/api/v1/translations':
				const models = MODELS.models.find((item) => item.id === MODELS.default_models.translate);
				data = await TranslationData(req, models);
				agent = dispatch(env, data);
				response = await agent.onTranslation(data);
				return new Response(JSON.stringify(response), { JSONResponseHeaders });

			default:
				const baseUrl = 'https://backend.raycast.com';
				const newHeaders = new Headers(req.headers);
				newHeaders.set('host', new URL(baseUrl).host);

				let newUrl = `${baseUrl}${path}${defaultSearch}`;
				let reqInit = {
					method: req.method,
					body: req.body,
					headers: newHeaders,
					cf: {},
				};

				const newReq = new Request(newUrl, reqInit);
				return fetch(newUrl.toString(), newReq);
		}
	},
};
