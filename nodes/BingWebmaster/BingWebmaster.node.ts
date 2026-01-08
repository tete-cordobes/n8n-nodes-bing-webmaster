import {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

import axios, { AxiosError } from 'axios';

export class BingWebmaster implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Bing Webmaster Tools',
		name: 'bingWebmaster',
		icon: 'file:bing.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Bing Webmaster Tools API for SEO monitoring, backlinks, keywords, and rankings',
		defaults: {
			name: 'Bing Webmaster',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'bingWebmasterApi',
				required: true,
			},
		],
		properties: [
			// Resource
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Site',
						value: 'site',
						description: 'Site management operations',
					},
					{
						name: 'Traffic',
						value: 'traffic',
						description: 'Traffic and ranking statistics',
					},
					{
						name: 'Crawl',
						value: 'crawl',
						description: 'Crawl statistics and issues',
					},
					{
						name: 'Backlink',
						value: 'backlink',
						description: 'Backlink analysis',
					},
					{
						name: 'Keyword',
						value: 'keyword',
						description: 'Keyword statistics',
					},
					{
						name: 'Page',
						value: 'page',
						description: 'Page statistics and info',
					},
					{
						name: 'URL Submission',
						value: 'urlSubmission',
						description: 'Submit URLs for indexing',
					},
				],
				default: 'traffic',
			},

			// ==================== SITE OPERATIONS ====================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['site'],
					},
				},
				options: [
					{
						name: 'Get All Sites',
						value: 'getUserSites',
						description: 'Get all verified sites for the user',
						action: 'Get all sites',
					},
					{
						name: 'Verify Connection',
						value: 'verifySite',
						description: 'Verify the site is correctly configured',
						action: 'Verify connection',
					},
				],
				default: 'getUserSites',
			},

			// ==================== TRAFFIC OPERATIONS ====================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['traffic'],
					},
				},
				options: [
					{
						name: 'Get Rank and Traffic Stats',
						value: 'getRankAndTrafficStats',
						description: 'Get daily ranking and traffic statistics',
						action: 'Get rank and traffic stats',
					},
					{
						name: 'Get Query Stats',
						value: 'getQueryStats',
						description: 'Get statistics by search queries',
						action: 'Get query stats',
					},
				],
				default: 'getRankAndTrafficStats',
			},

			// ==================== CRAWL OPERATIONS ====================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['crawl'],
					},
				},
				options: [
					{
						name: 'Get Crawl Stats',
						value: 'getCrawlStats',
						description: 'Get Bingbot crawl statistics (API exclusive data)',
						action: 'Get crawl stats',
					},
					{
						name: 'Get Crawl Issues',
						value: 'getCrawlIssues',
						description: 'Get crawl issues and errors',
						action: 'Get crawl issues',
					},
				],
				default: 'getCrawlStats',
			},

			// ==================== BACKLINK OPERATIONS ====================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['backlink'],
					},
				},
				options: [
					{
						name: 'Get URL Links',
						value: 'getUrlLinks',
						description: 'Get backlinks for a URL or entire site',
						action: 'Get URL links',
					},
					{
						name: 'Get Link Counts',
						value: 'getLinkCounts',
						description: 'Get total backlink counts',
						action: 'Get link counts',
					},
				],
				default: 'getUrlLinks',
			},

			// ==================== KEYWORD OPERATIONS ====================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['keyword'],
					},
				},
				options: [
					{
						name: 'Get Keyword Stats',
						value: 'getKeywordStats',
						description: 'Get historical keyword statistics',
						action: 'Get keyword stats',
					},
				],
				default: 'getKeywordStats',
			},

			// ==================== PAGE OPERATIONS ====================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['page'],
					},
				},
				options: [
					{
						name: 'Get Page Stats',
						value: 'getPageStats',
						description: 'Get statistics by page',
						action: 'Get page stats',
					},
					{
						name: 'Get URL Info',
						value: 'getUrlInfo',
						description: 'Get indexation info for a specific URL',
						action: 'Get URL info',
					},
				],
				default: 'getPageStats',
			},

			// Page URL parameter for getUrlInfo
			{
				displayName: 'Page URL',
				name: 'pageUrl',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['page'],
						operation: ['getUrlInfo'],
					},
				},
				placeholder: 'https://example.com/page',
				description: 'The URL to get indexation info for',
			},

			// Optional Page URL for backlinks
			{
				displayName: 'Page URL (Optional)',
				name: 'pageUrlOptional',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['backlink'],
						operation: ['getUrlLinks'],
					},
				},
				placeholder: 'https://example.com/page',
				description: 'Optional: Get backlinks for a specific page instead of the entire site',
			},

			// ==================== URL SUBMISSION OPERATIONS ====================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['urlSubmission'],
					},
				},
				options: [
					{
						name: 'Submit URL',
						value: 'submitUrl',
						description: 'Submit a single URL for indexing',
						action: 'Submit URL',
					},
					{
						name: 'Submit URL Batch',
						value: 'submitUrlBatch',
						description: 'Submit multiple URLs for indexing (up to 10,000 per day)',
						action: 'Submit URL batch',
					},
				],
				default: 'submitUrl',
			},

			// Single URL for submission
			{
				displayName: 'URL to Submit',
				name: 'urlToSubmit',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['urlSubmission'],
						operation: ['submitUrl'],
					},
				},
				placeholder: 'https://example.com/new-page',
				description: 'The URL to submit for indexing',
			},

			// Batch URLs for submission
			{
				displayName: 'URLs to Submit',
				name: 'urlsToSubmit',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['urlSubmission'],
						operation: ['submitUrlBatch'],
					},
				},
				placeholder: 'https://example.com/page1\nhttps://example.com/page2',
				description: 'URLs to submit for indexing (one per line, max 500 per request)',
				typeOptions: {
					rows: 10,
				},
			},

			// ==================== ADDITIONAL OPTIONS ====================
			{
				displayName: 'Additional Options',
				name: 'additionalOptions',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				options: [
					{
						displayName: 'Return Raw Data',
						name: 'returnRawData',
						type: 'boolean',
						default: false,
						description: 'Whether to return the raw API response without processing',
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const credentials = await this.getCredentials('bingWebmasterApi');
		const apiKey = credentials.apiKey as string;
		const siteUrl = credentials.siteUrl as string;

		const baseUrl = 'https://ssl.bing.com/webmaster/api.svc/json';

		for (let i = 0; i < items.length; i++) {
			try {
				const resource = this.getNodeParameter('resource', i) as string;
				const operation = this.getNodeParameter('operation', i) as string;
				const additionalOptions = this.getNodeParameter('additionalOptions', i, {}) as {
					returnRawData?: boolean;
				};

				let endpoint = '';
				let method = 'GET';
				let body: object | undefined;
				const params: Record<string, string> = {
					apikey: apiKey,
					siteUrl: siteUrl,
				};

				// Determine endpoint based on resource and operation
				switch (resource) {
					case 'site':
						if (operation === 'getUserSites') {
							endpoint = '/GetUserSites';
						} else if (operation === 'verifySite') {
							endpoint = '/GetUserSites';
						}
						break;

					case 'traffic':
						if (operation === 'getRankAndTrafficStats') {
							endpoint = '/GetRankAndTrafficStats';
						} else if (operation === 'getQueryStats') {
							endpoint = '/GetQueryStats';
						}
						break;

					case 'crawl':
						if (operation === 'getCrawlStats') {
							endpoint = '/GetCrawlStats';
						} else if (operation === 'getCrawlIssues') {
							endpoint = '/GetCrawlIssues';
						}
						break;

					case 'backlink':
						if (operation === 'getUrlLinks') {
							endpoint = '/GetUrlLinks';
							const pageUrlOptional = this.getNodeParameter('pageUrlOptional', i, '') as string;
							if (pageUrlOptional) {
								params.pageUrl = pageUrlOptional;
							}
						} else if (operation === 'getLinkCounts') {
							endpoint = '/GetLinkCounts';
						}
						break;

					case 'keyword':
						if (operation === 'getKeywordStats') {
							endpoint = '/GetKeywordStats';
						}
						break;

					case 'page':
						if (operation === 'getPageStats') {
							endpoint = '/GetPageStats';
						} else if (operation === 'getUrlInfo') {
							endpoint = '/GetUrlInfo';
							const pageUrl = this.getNodeParameter('pageUrl', i) as string;
							params.pageUrl = pageUrl;
						}
						break;

					case 'urlSubmission':
						if (operation === 'submitUrl') {
							endpoint = '/SubmitUrl';
							const urlToSubmit = this.getNodeParameter('urlToSubmit', i) as string;
							params.pageUrl = urlToSubmit;
						} else if (operation === 'submitUrlBatch') {
							endpoint = '/SubmitUrlBatch';
							method = 'POST';
							const urlsToSubmit = this.getNodeParameter('urlsToSubmit', i) as string;
							const urlList = urlsToSubmit
								.split('\n')
								.map((url) => url.trim())
								.filter((url) => url.length > 0);
							body = { urlList };
						}
						break;
				}

				// Make the API request
				let responseData: unknown;

				if (method === 'GET') {
					const queryString = new URLSearchParams(params).toString();
					const response = await axios.get(`${baseUrl}${endpoint}?${queryString}`, {
						timeout: 30000,
					});
					responseData = response.data;
				} else {
					const queryString = new URLSearchParams(params).toString();
					const response = await axios.post(`${baseUrl}${endpoint}?${queryString}`, body, {
						headers: { 'Content-Type': 'application/json' },
						timeout: 60000,
					});
					responseData = response.data;
				}

				// Process response
				let processedData: unknown;

				if (additionalOptions.returnRawData) {
					processedData = responseData;
				} else {
					// Extract data from Bing API response format
					if (typeof responseData === 'object' && responseData !== null && 'd' in responseData) {
						processedData = (responseData as { d: unknown }).d;
					} else {
						processedData = responseData;
					}

					// Special handling for verifySite
					if (resource === 'site' && operation === 'verifySite') {
						const sites = processedData as Array<{ Url?: string }>;
						const isVerified = Array.isArray(sites) && sites.some(
							(site) => site.Url?.replace(/\/$/, '') === siteUrl.replace(/\/$/, '')
						);
						processedData = {
							verified: isVerified,
							siteUrl: siteUrl,
							sitesCount: Array.isArray(sites) ? sites.length : 0,
						};
					}
				}

				// Handle array vs object response
				if (Array.isArray(processedData)) {
					for (const item of processedData) {
						returnData.push({ json: item as IDataObject });
					}
				} else {
					returnData.push({ json: processedData as IDataObject });
				}
			} catch (error) {
				if (error instanceof AxiosError) {
					throw new NodeOperationError(
						this.getNode(),
						`Bing API Error: ${error.response?.data?.Message || error.message}`,
						{ itemIndex: i }
					);
				}
				throw new NodeOperationError(
					this.getNode(),
					`Error: ${(error as Error).message}`,
					{ itemIndex: i }
				);
			}
		}

		return [returnData];
	}
}
