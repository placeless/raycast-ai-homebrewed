import { GoogleGenerativeAI } from '@google/generative-ai';

class GoogleAIAgent {
	constructor(env, data) {
		this.opts = this.processData(data);
		this.client = new GoogleGenerativeAI(env.GOOGLE_GAI_API_KEY);
		this.model = this.client.getGenerativeModel({ model: data.model, generationConfig: this.opts });
		// this.chat = this.model.startChat()
	}

	processData(data) {
		return {
			temperature: data.temperature / 2,
			maxOutputTokens: data?.maxTokens ?? 4096,
			topK: 1,
			topP: 1,
		};
	}

	async onCompletion(data) {
		let { readable, writable } = new TransformStream();
		let writer = writable.getWriter();
		const textEncoder = new TextEncoder();

		(async () => {
			const result = await this.model.generateContentStream(data.messages.slice(-1)[0].content);
			for await (const part of result.stream) {
				const text = part.text();
				if (text) {
					const rawText = `data: ${JSON.stringify({ text })}\n\n`;
					const textCode = textEncoder.encode(rawText);
					writer.write(textCode);
				} else {
					writer.close();
					break;
				}
			}
		})().catch((error) => {
			console.error('Error processing stream:', error);
			writer.abort();
		});

		return readable;
	}

	async onTranslation(data) {
		const result = await this.model.generateContent(data.messages.slice(-1)[0].content);
		const text = result.response.text();
		return { data: { translations: [{ translatedText: text }] } };
	}
}

export default GoogleAIAgent;
