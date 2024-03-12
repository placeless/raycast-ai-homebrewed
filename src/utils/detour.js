import OpenAIAgent from '../providers/openai';
import GeminiAIAgent from '../providers/google';
import ClaudeAIAgent from '../providers/anthropic';

function dispatch(env, data) {
	switch (data.provider) {
		case 'openai':
		case 'azure':
		case 'groq':
			return new OpenAIAgent(env, data);
		case 'google':
			return new GeminiAIAgent(env, data);
		case 'anthropic':
			return new ClaudeAIAgent(env, data);
		default:
			return;
	}
}

export default dispatch;
