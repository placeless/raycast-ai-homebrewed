import Anthropic from '@anthropic-ai/sdk';

class ClaudeAIAgent {
	constructor(env, data) {
		this.opts = this.processData(data);
		this.client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });
		this.chatBot = this.client.messages.stream(this.opts);
	}

	processData(data) {
		const hasSystem = data.messages[0]?.role === 'system';
		const system_prompts = hasSystem ? data.messages[0].content : 'You are Claude, a helpfull assistant.';
		const messages = hasSystem ? data.messages.slice(1) : data.messages;
		let formattedMsg = [];

		for (const msg of messages) {
			formattedMsg.push({
				role: msg.role,
				content: [
					{
						type: 'text',
						text: msg.content,
					},
				],
			});
		}

		return {
			model: data.model,
			temperature: data.temperature / 2,
			system: system_prompts,
			messages: formattedMsg,
			max_tokens: data?.maxTokens ?? 1024,
		};
	}

	async onCompletion() {
		let { readable, writable } = new TransformStream();
		let writer = writable.getWriter();
		const textEncoder = new TextEncoder();

		this.chatBot
			.on('text', (text) => {
				const textCode = textEncoder.encode(`data: ${JSON.stringify({ text })}\n\n`);
				writer.write(textCode);
			})
			.on('end', () => writer.close())
			.on('error', (error) => console.log(error));

		return readable;
	}

	async onTranslation() {
		const text = await this.chatBot.finalText();
		return { data: { translations: [{ translatedText: text }] } };
	}
}

export default ClaudeAIAgent;
