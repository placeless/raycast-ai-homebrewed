const MODELS = {
	default_models: {
		chat: 'gpt-35-turbo',
		quick_ai: 'gpt-35-turbo',
		commands: 'gpt-35-turbo',
		api: 'gpt-35-turbo',
		emoji_search: 'gpt-35-turbo',
		translate: 'claude-3-sonnet-20240229',
	},
	models: [
		{
			id: 'gpt-35-turbo',
			model: 'gpt-35-turbo-0125',
			name: 'GPT-3.5 Turbo',
			provider: 'azure',
			provider_name: 'Azure',
			requires_better_ai: true,
			features: ['chat', 'quick_ai', 'commands', 'api'],
			status: null,
		},
		{
			id: 'gpt-3.5-turbo',
			model: 'gpt-3.5-turbo',
			name: 'GPT-3.5 Turbo',
			provider: 'openai',
			provider_name: 'OpenAI',
			requires_better_ai: true,
			features: ['chat', 'quick_ai', 'commands', 'api'],
			status: null,
		},
		{
			id: 'gpt-4',
			model: 'gpt-4-0125',
			name: 'GPT-4 Turbo',
			provider: 'azure',
			provider_name: 'Azure',
			requires_better_ai: false,
			features: ['chat', 'quick_ai', 'commands', 'api'],
			status: 'beta',
		},
		{
			id: 'mixtral-8x7b-32768',
			model: 'mixtral-8x7b-32768',
			name: 'Mixtral-8x7b',
			provider: 'groq',
			provider_name: 'Groq',
			requires_better_ai: false,
			features: ['chat', 'quick_ai', 'commands', 'api”, “translate'],
			status: 'beta',
		},
		{
			id: 'llama2-70b-4096',
			model: 'llama2-70b-4096',
			name: 'LLaMA2-70b',
			provider: 'groq',
			provider_name: 'Groq',
			requires_better_ai: false,
			features: ['chat', 'quick_ai', 'commands', 'api'],
			status: 'beta',
		},
		{
			id: 'gemma-7b-it',
			model: 'gemma-7b-it',
			name: 'Gemma-7b-it',
			provider: 'groq',
			provider_name: 'Groq',
			requires_better_ai: false,
			features: ['chat', 'quick_ai', 'commands', 'api'],
			status: 'beta',
		},
		{
			id: 'claude-3-opus-20240229',
			model: 'claude-3-opus-20240229',
			name: 'Claude-3 Opus',
			provider: 'anthropic',
			provider_name: 'Anthropic',
			requires_better_ai: false,
			features: ['chat', 'quick_ai', 'commands', 'api'],
			status: 'beta',
		},
		{
			id: 'claude-3-sonnet-20240229',
			model: 'claude-3-sonnet-20240229',
			name: 'Claude-3 Sonnet',
			provider: 'anthropic',
			provider_name: 'Anthropic',
			requires_better_ai: false,
			features: ['chat', 'quick_ai', 'commands', 'api'],
			status: 'beta',
		},
		{
			id: 'claude-3-haiku-20240307',
			model: 'claude-3-haiku-20240307',
			name: 'Claude-3 Haiku',
			provider: 'anthropic',
			provider_name: 'Anthropic',
			requires_better_ai: false,
			features: ['chat', 'quick_ai', 'commands', 'api'],
			status: 'beta',
		},
		{
			id: 'gemini-1.0-pro',
			model: 'gemini-1.0-pro-latest',
			name: 'Gemini 1.0 Pro',
			provider: 'google',
			provider_name: 'Google',
			requires_better_ai: false,
			features: ['chat', 'quick_ai', 'commands', 'api'],
		},
		{
			id: 'gemini-1.5-pro',
			model: 'gemini-1.5-pro-latest',
			name: 'Gemini 1.5 Pro',
			provider: 'google',
			provider_name: 'Google',
			requires_better_ai: false,
			features: ['chat', 'quick_ai', 'commands', 'api'],
		},
		{
			id: 'moonshot-v1-8k',
			model: 'moonshot-v1-8k',
			name: 'Kimi 8K',
			provider: 'moonshot',
			provider_name: 'Moonshot',
			requires_better_ai: false,
			features: ['chat', 'quick_ai', 'commands', 'api'],
		},
	],
};

$done({ response: { body: JSON.stringify(MODELS) } });
