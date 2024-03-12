async function RaycastAIData(req) {
	const obj = await req.json();
	const data = {
		provider: obj.messages[0]?.content?.provider ?? obj.provider,
		model: obj.messages[0]?.content?.model ?? obj.model,
		temperature: obj.messages[0]?.content?.temperature ?? obj.temperature ?? 0.8,
		source: obj.source,
		messages: [],
	};

	switch (data.source) {
		// custom_command
		case 'custom_command':
			data.messages.push({
				role: 'user',
				content: obj.messages[0]?.content?.command_instructions,
			});
			break;

		// ai_chat, ai_chat_title
		case 'ai_chat':
		case 'ai_chat_title':
			if ('additional_system_instructions' in obj) {
				data.messages.push({
					role: 'system',
					content: obj.additional_system_instructions,
				});
			}
			for (const msg of obj.messages.slice(-4)) {
				data.messages.push({
					role: msg.author,
					content: msg.content.text,
				});
			}
			break;

		// quick_ai, built_in_command, ai_commands, etc.
		default:
			if ('command_id' in obj.messages[0]?.content) {
				data.messages.push({
					role: 'user',
					content: obj.messages[0].content.command_id.replaceAll('-', ' ') + ': ' + obj.messages[0].content.text,
				});
			} else {
				data.messages.push({
					role: 'user',
					content: obj.messages[0].content.text,
				});
			}
			break;
	}

	return data;
}

async function TranslationData(req, model) {
	const obj = await req.json();
	const data = {
		provider: model.provider,
		model: model.model,
		temperature: model?.temperature ?? 0.3,
		source: 'translate',
		messages: [
			{
				role: 'user',
				content: `Translate the following ${obj.source} text to ${obj.target}, return the translations only: ${obj.q}`,
			},
		],
	};

	return data;
}

export { RaycastAIData, TranslationData };
