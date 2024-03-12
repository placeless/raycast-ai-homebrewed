import CONFIG from './data/models.json' assert { type: 'json' };
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
		let data;
		let agent;
		let response;

		switch (path) {
			case '/api/v1/me':
				// TODO: alter and download me.json
				break;

			case '/api/v1/ai/models':
				// TODO: easy way to setup models.json?
				break;

			case '/api/v1/ai/chat_completions':
				data = await RaycastAIData(req);
				agent = dispatch(env, data);
				response = await agent.onCompletion(data);
				return new Response(response, { StreamResponseHeaders });

			case '/api/v1/translations':
				const model = CONFIG.models.find((item) => item.id === CONFIG.default_models.translate);
				data = await TranslationData(req, model);
				agent = dispatch(env, data);
				response = await agent.onTranslation(data);
				return new Response(JSON.stringify(response), { JSONResponseHeaders });

			default:
				break;
		}
	},
};
