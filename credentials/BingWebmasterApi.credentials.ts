import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class BingWebmasterApi implements ICredentialType {
	name = 'bingWebmasterApi';
	displayName = 'Bing Webmaster Tools API';
	documentationUrl = 'https://learn.microsoft.com/en-us/bingwebmaster/';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'Your Bing Webmaster Tools API Key. Get it from Settings > API Access in Bing Webmaster Tools.',
		},
		{
			displayName: 'Site URL',
			name: 'siteUrl',
			type: 'string',
			default: '',
			required: true,
			placeholder: 'https://example.com',
			description: 'The URL of your verified site in Bing Webmaster Tools (include https://)',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			qs: {
				apikey: '={{$credentials.apiKey}}',
				siteUrl: '={{$credentials.siteUrl}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://ssl.bing.com/webmaster/api.svc/json',
			url: '/GetUserSites',
			method: 'GET',
		},
	};
}
