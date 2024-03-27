import OpenAI from 'openai';

class OpenAIAgent {
	constructor(env, data) {
		this.opts = this.processData(data);
		this.client = this.createClient(env, data);
		this.chatBot = this.client.beta.chat.completions.stream(this.opts);
	}

	createClient(env, data) {
		switch (data.provider) {
			case 'openai':
				return new OpenAI({ apiKey: env.OPENAI_API_KEY });
			case 'azure':
				return new OpenAI({
					apiKey: env.AZURE_OAI_API_KEY,
					baseURL: `https://${env.AZURE_OAI_RESOURCE}.openai.azure.com/openai/deployments/${data.model}`,
					defaultQuery: { 'api-version': env.AZURE_OAI_API_VERSION },
					defaultHeaders: { 'api-key': env.AZURE_OAI_API_KEY },
				});
			case 'groq':
				return new OpenAI({
					apiKey: env.GROQ_API_KEY,
					baseURL: 'https://api.groq.com/openai/v1',
				});
			case 'moonshot':
				return new OpenAI({
					apiKey: env.KIMI_API_KEY,
					baseURL: 'https://api.moonshot.cn/v1',
				});
			default:
				throw new Error('Unsupported provider specified');
		}
	}
	processData(data) {
		const hasSystem = data.messages[0]?.role === 'system';
		const system = { role: 'system', content: 'You are chatGPT, a helpfull assistant.' };
		return {
			model: data.model,
			temperature: data.temperature,
			messages: hasSystem ? data.messages : [system, ...data.messages],
			max_tokens: data?.maxTokens ?? 4096,
			stream: true,
		};
	}

	async onCompletion() {
		let { readable, writable } = new TransformStream();
		let writer = writable.getWriter();
		const textEncoder = new TextEncoder();

		this.chatBot
			.on('content', (content) => {
				const text = `data: ${JSON.stringify({ text: content })}\n\n`;
				const textCode = textEncoder.encode(text);
				writer.write(textCode);
			})
			.on('end', () => writer.close())
			.on('error', (error) => console.log(error));

		return readable;
	}

	async onTranslation() {
		const text = await this.chatBot.finalContent();
		return { data: { translations: [{ translatedText: text }] } };
	}
}

export default OpenAIAgent;
