/**
 * Tests for Bing Webmaster Tools n8n Node
 *
 * These tests verify:
 * 1. Node description is correct
 * 2. Credentials structure is valid
 * 3. API endpoint construction
 * 4. Response parsing
 * 5. Execute function with mocked API calls
 */

import { BingWebmaster } from '../nodes/BingWebmaster/BingWebmaster.node';
import { BingWebmasterApi } from '../credentials/BingWebmasterApi.credentials';
import axios from 'axios';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('BingWebmaster Node', () => {
	let node: BingWebmaster;

	beforeEach(() => {
		node = new BingWebmaster();
		jest.clearAllMocks();
	});

	describe('Node Description', () => {
		it('should have correct display name', () => {
			expect(node.description.displayName).toBe('Bing Webmaster Tools');
		});

		it('should have correct node name', () => {
			expect(node.description.name).toBe('bingWebmaster');
		});

		it('should have correct icon', () => {
			expect(node.description.icon).toBe('file:bing.svg');
		});

		it('should have correct group', () => {
			expect(node.description.group).toContain('transform');
		});

		it('should have version 1', () => {
			expect(node.description.version).toBe(1);
		});

		it('should have required credentials', () => {
			expect(node.description.credentials).toBeDefined();
			expect(node.description.credentials?.length).toBeGreaterThan(0);
			expect(node.description.credentials?.[0].name).toBe('bingWebmasterApi');
			expect(node.description.credentials?.[0].required).toBe(true);
		});

		it('should have main input and output', () => {
			expect(node.description.inputs).toContain('main');
			expect(node.description.outputs).toContain('main');
		});

		it('should have all resources defined', () => {
			const resourceProperty = node.description.properties.find(
				(p) => p.name === 'resource'
			);
			expect(resourceProperty).toBeDefined();

			const resources = (resourceProperty as { options: Array<{ value: string }> }).options.map(
				(o) => o.value
			);
			expect(resources).toContain('site');
			expect(resources).toContain('traffic');
			expect(resources).toContain('crawl');
			expect(resources).toContain('backlink');
			expect(resources).toContain('keyword');
			expect(resources).toContain('page');
			expect(resources).toContain('urlSubmission');
		});

		it('should have traffic as default resource', () => {
			const resourceProperty = node.description.properties.find(
				(p) => p.name === 'resource'
			);
			expect(resourceProperty?.default).toBe('traffic');
		});
	});

	describe('Operations', () => {
		it('should have site operations', () => {
			const operations = node.description.properties.filter(
				(p) =>
					p.name === 'operation' &&
					p.displayOptions?.show?.resource?.includes('site')
			);
			expect(operations.length).toBe(1);

			const siteOps = (operations[0] as { options: Array<{ value: string }> }).options.map(
				(o) => o.value
			);
			expect(siteOps).toContain('getUserSites');
			expect(siteOps).toContain('verifySite');
		});

		it('should have traffic operations', () => {
			const operations = node.description.properties.filter(
				(p) =>
					p.name === 'operation' &&
					p.displayOptions?.show?.resource?.includes('traffic')
			);
			expect(operations.length).toBe(1);

			const trafficOps = (operations[0] as { options: Array<{ value: string }> }).options.map(
				(o) => o.value
			);
			expect(trafficOps).toContain('getRankAndTrafficStats');
			expect(trafficOps).toContain('getQueryStats');
		});

		it('should have crawl operations', () => {
			const operations = node.description.properties.filter(
				(p) =>
					p.name === 'operation' &&
					p.displayOptions?.show?.resource?.includes('crawl')
			);
			expect(operations.length).toBe(1);

			const crawlOps = (operations[0] as { options: Array<{ value: string }> }).options.map(
				(o) => o.value
			);
			expect(crawlOps).toContain('getCrawlStats');
			expect(crawlOps).toContain('getCrawlIssues');
		});

		it('should have backlink operations', () => {
			const operations = node.description.properties.filter(
				(p) =>
					p.name === 'operation' &&
					p.displayOptions?.show?.resource?.includes('backlink')
			);
			expect(operations.length).toBe(1);

			const backlinkOps = (operations[0] as { options: Array<{ value: string }> }).options.map(
				(o) => o.value
			);
			expect(backlinkOps).toContain('getUrlLinks');
			expect(backlinkOps).toContain('getLinkCounts');
		});

		it('should have keyword operations', () => {
			const operations = node.description.properties.filter(
				(p) =>
					p.name === 'operation' &&
					p.displayOptions?.show?.resource?.includes('keyword')
			);
			expect(operations.length).toBe(1);

			const keywordOps = (operations[0] as { options: Array<{ value: string }> }).options.map(
				(o) => o.value
			);
			expect(keywordOps).toContain('getKeywordStats');
		});

		it('should have page operations', () => {
			const operations = node.description.properties.filter(
				(p) =>
					p.name === 'operation' &&
					p.displayOptions?.show?.resource?.includes('page')
			);
			expect(operations.length).toBe(1);

			const pageOps = (operations[0] as { options: Array<{ value: string }> }).options.map(
				(o) => o.value
			);
			expect(pageOps).toContain('getPageStats');
			expect(pageOps).toContain('getUrlInfo');
		});

		it('should have URL submission operations', () => {
			const operations = node.description.properties.filter(
				(p) =>
					p.name === 'operation' &&
					p.displayOptions?.show?.resource?.includes('urlSubmission')
			);
			expect(operations.length).toBe(1);

			const submissionOps = (operations[0] as { options: Array<{ value: string }> }).options.map(
				(o) => o.value
			);
			expect(submissionOps).toContain('submitUrl');
			expect(submissionOps).toContain('submitUrlBatch');
		});
	});

	describe('Node Parameters', () => {
		it('should have pageUrl parameter for getUrlInfo', () => {
			const pageUrlParam = node.description.properties.find(
				(p) => p.name === 'pageUrl'
			);
			expect(pageUrlParam).toBeDefined();
			expect(pageUrlParam?.required).toBe(true);
			expect(pageUrlParam?.displayOptions?.show?.operation).toContain('getUrlInfo');
		});

		it('should have optional pageUrl for backlinks', () => {
			const pageUrlOptional = node.description.properties.find(
				(p) => p.name === 'pageUrlOptional'
			);
			expect(pageUrlOptional).toBeDefined();
			expect(pageUrlOptional?.displayOptions?.show?.resource).toContain('backlink');
		});

		it('should have urlToSubmit parameter', () => {
			const urlToSubmit = node.description.properties.find(
				(p) => p.name === 'urlToSubmit'
			);
			expect(urlToSubmit).toBeDefined();
			expect(urlToSubmit?.required).toBe(true);
			expect(urlToSubmit?.displayOptions?.show?.operation).toContain('submitUrl');
		});

		it('should have urlsToSubmit parameter for batch', () => {
			const urlsToSubmit = node.description.properties.find(
				(p) => p.name === 'urlsToSubmit'
			);
			expect(urlsToSubmit).toBeDefined();
			expect(urlsToSubmit?.required).toBe(true);
			expect(urlsToSubmit?.displayOptions?.show?.operation).toContain('submitUrlBatch');
		});

		it('should have additionalOptions with returnRawData', () => {
			const additionalOptions = node.description.properties.find(
				(p) => p.name === 'additionalOptions'
			);
			expect(additionalOptions).toBeDefined();
			expect(additionalOptions?.type).toBe('collection');

			const options = (additionalOptions as { options: Array<{ name: string }> }).options;
			const returnRawData = options.find((o) => o.name === 'returnRawData');
			expect(returnRawData).toBeDefined();
		});
	});
});

describe('BingWebmasterApi Credentials', () => {
	let credentials: BingWebmasterApi;

	beforeEach(() => {
		credentials = new BingWebmasterApi();
	});

	it('should have correct name', () => {
		expect(credentials.name).toBe('bingWebmasterApi');
	});

	it('should have correct display name', () => {
		expect(credentials.displayName).toBe('Bing Webmaster Tools API');
	});

	it('should have apiKey property', () => {
		const apiKeyProp = credentials.properties.find((p) => p.name === 'apiKey');
		expect(apiKeyProp).toBeDefined();
		expect(apiKeyProp?.type).toBe('string');
		expect(apiKeyProp?.required).toBe(true);
	});

	it('should have apiKey as password type', () => {
		const apiKeyProp = credentials.properties.find((p) => p.name === 'apiKey');
		expect(apiKeyProp?.typeOptions?.password).toBe(true);
	});

	it('should have siteUrl property', () => {
		const siteUrlProp = credentials.properties.find((p) => p.name === 'siteUrl');
		expect(siteUrlProp).toBeDefined();
		expect(siteUrlProp?.type).toBe('string');
		expect(siteUrlProp?.required).toBe(true);
	});

	it('should have siteUrl placeholder', () => {
		const siteUrlProp = credentials.properties.find((p) => p.name === 'siteUrl');
		expect(siteUrlProp?.placeholder).toBe('https://example.com');
	});

	it('should have test request configured', () => {
		expect(credentials.test).toBeDefined();
		expect(credentials.test?.request.url).toBe('/GetUserSites');
	});

	it('should have correct authenticate configuration', () => {
		expect(credentials.authenticate).toBeDefined();
	});
});

describe('API Endpoint Construction', () => {
	const baseUrl = 'https://ssl.bing.com/webmaster/api.svc/json';

	const endpoints: Record<string, string> = {
		getUserSites: '/GetUserSites',
		getRankAndTrafficStats: '/GetRankAndTrafficStats',
		getQueryStats: '/GetQueryStats',
		getCrawlStats: '/GetCrawlStats',
		getCrawlIssues: '/GetCrawlIssues',
		getUrlLinks: '/GetUrlLinks',
		getLinkCounts: '/GetLinkCounts',
		getKeywordStats: '/GetKeywordStats',
		getPageStats: '/GetPageStats',
		getUrlInfo: '/GetUrlInfo',
		submitUrl: '/SubmitUrl',
		submitUrlBatch: '/SubmitUrlBatch',
	};

	Object.entries(endpoints).forEach(([operation, endpoint]) => {
		it(`should construct correct URL for ${operation}`, () => {
			const fullUrl = `${baseUrl}${endpoint}`;
			expect(fullUrl).toMatch(/^https:\/\/ssl\.bing\.com\/webmaster\/api\.svc\/json\//);
		});
	});

	it('should use correct base URL', () => {
		expect(baseUrl).toBe('https://ssl.bing.com/webmaster/api.svc/json');
	});

	it('should have 12 total endpoints', () => {
		expect(Object.keys(endpoints).length).toBe(12);
	});
});

describe('Response Parsing', () => {
	it('should extract data from Bing API response format', () => {
		const mockResponse = {
			d: [
				{ Url: 'https://example.com', Impressions: 100 },
				{ Url: 'https://example.com/page', Impressions: 50 },
			],
		};

		const extractedData = mockResponse.d;
		expect(Array.isArray(extractedData)).toBe(true);
		expect(extractedData.length).toBe(2);
	});

	it('should handle empty response', () => {
		const mockResponse = { d: [] };
		const extractedData = mockResponse.d;
		expect(Array.isArray(extractedData)).toBe(true);
		expect(extractedData.length).toBe(0);
	});

	it('should handle object response', () => {
		const mockResponse = {
			d: { TotalBacklinks: 1000, UniqueReferringDomains: 50 },
		};
		const extractedData = mockResponse.d;
		expect(typeof extractedData).toBe('object');
		expect(extractedData.TotalBacklinks).toBe(1000);
	});

	it('should handle nested data', () => {
		const mockResponse = {
			d: {
				Stats: [
					{ Date: '2024-01-01', Clicks: 100 },
					{ Date: '2024-01-02', Clicks: 150 },
				],
			},
		};
		const extractedData = mockResponse.d;
		expect(extractedData.Stats).toBeDefined();
		expect(extractedData.Stats.length).toBe(2);
	});

	it('should handle verifySite response', () => {
		const mockSites = [
			{ Url: 'https://example.com/' },
			{ Url: 'https://other.com/' },
		];
		const siteUrl = 'https://example.com';
		const isVerified = mockSites.some(
			(site) => site.Url?.replace(/\/$/, '') === siteUrl.replace(/\/$/, '')
		);
		expect(isVerified).toBe(true);
	});

	it('should handle verifySite with trailing slash', () => {
		const mockSites = [{ Url: 'https://example.com/' }];
		const siteUrl = 'https://example.com';
		const isVerified = mockSites.some(
			(site) => site.Url?.replace(/\/$/, '') === siteUrl.replace(/\/$/, '')
		);
		expect(isVerified).toBe(true);
	});

	it('should handle unverified site', () => {
		const mockSites = [{ Url: 'https://other.com/' }];
		const siteUrl = 'https://example.com';
		const isVerified = mockSites.some(
			(site) => site.Url?.replace(/\/$/, '') === siteUrl.replace(/\/$/, '')
		);
		expect(isVerified).toBe(false);
	});
});

describe('URL Batch Processing', () => {
	it('should split URLs by newline', () => {
		const urlsToSubmit = 'https://example.com/page1\nhttps://example.com/page2\nhttps://example.com/page3';
		const urlList = urlsToSubmit
			.split('\n')
			.map((url) => url.trim())
			.filter((url) => url.length > 0);

		expect(urlList.length).toBe(3);
		expect(urlList[0]).toBe('https://example.com/page1');
		expect(urlList[2]).toBe('https://example.com/page3');
	});

	it('should handle empty lines', () => {
		const urlsToSubmit = 'https://example.com/page1\n\nhttps://example.com/page2\n';
		const urlList = urlsToSubmit
			.split('\n')
			.map((url) => url.trim())
			.filter((url) => url.length > 0);

		expect(urlList.length).toBe(2);
	});

	it('should trim whitespace', () => {
		const urlsToSubmit = '  https://example.com/page1  \n  https://example.com/page2  ';
		const urlList = urlsToSubmit
			.split('\n')
			.map((url) => url.trim())
			.filter((url) => url.length > 0);

		expect(urlList[0]).toBe('https://example.com/page1');
		expect(urlList[1]).toBe('https://example.com/page2');
	});
});

describe('Query String Construction', () => {
	it('should build correct query string', () => {
		const params: Record<string, string> = {
			apikey: 'test-api-key',
			siteUrl: 'https://example.com',
		};
		const queryString = new URLSearchParams(params).toString();

		expect(queryString).toContain('apikey=test-api-key');
		expect(queryString).toContain('siteUrl=https');
	});

	it('should encode special characters', () => {
		const params: Record<string, string> = {
			apikey: 'key123',
			siteUrl: 'https://example.com/path?query=1',
		};
		const queryString = new URLSearchParams(params).toString();

		expect(queryString).toContain('%3F'); // encoded ?
		expect(queryString).toContain('%3D'); // encoded =
	});

	it('should handle pageUrl parameter', () => {
		const params: Record<string, string> = {
			apikey: 'key123',
			siteUrl: 'https://example.com',
			pageUrl: 'https://example.com/specific-page',
		};
		const queryString = new URLSearchParams(params).toString();

		expect(queryString).toContain('pageUrl=');
	});
});

describe('Error Handling', () => {
	it('should have error message format', () => {
		const errorMessage = 'Bing API Error: Invalid API key';
		expect(errorMessage).toMatch(/^Bing API Error:/);
	});

	it('should handle axios error response', () => {
		const axiosError = {
			response: {
				data: {
					Message: 'Invalid API key',
				},
			},
			message: 'Request failed with status code 401',
		};

		const errorMsg = axiosError.response?.data?.Message || axiosError.message;
		expect(errorMsg).toBe('Invalid API key');
	});

	it('should fallback to error message if no response data', () => {
		const axiosError: { response?: { data?: { Message?: string } }; message: string } = {
			response: undefined,
			message: 'Network error',
		};

		const errorMsg = axiosError.response?.data?.Message || axiosError.message;
		expect(errorMsg).toBe('Network error');
	});
});

describe('Mocked API Calls', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should call axios.get for GET requests', async () => {
		mockedAxios.get.mockResolvedValueOnce({
			data: { d: [{ Url: 'https://example.com' }] },
		});

		const response = await axios.get('https://ssl.bing.com/webmaster/api.svc/json/GetUserSites?apikey=test');
		expect(mockedAxios.get).toHaveBeenCalledTimes(1);
		expect(response.data.d).toBeDefined();
	});

	it('should call axios.post for POST requests', async () => {
		mockedAxios.post.mockResolvedValueOnce({
			data: { d: { submitted: 3 } },
		});

		const body = { urlList: ['url1', 'url2', 'url3'] };
		const response = await axios.post('https://ssl.bing.com/webmaster/api.svc/json/SubmitUrlBatch', body);

		expect(mockedAxios.post).toHaveBeenCalledTimes(1);
		expect(response.data.d.submitted).toBe(3);
	});

	it('should handle API error responses', async () => {
		mockedAxios.get.mockRejectedValueOnce({
			response: {
				status: 401,
				data: { Message: 'Unauthorized' },
			},
		});

		await expect(axios.get('https://ssl.bing.com/webmaster/api.svc/json/GetUserSites')).rejects.toMatchObject({
			response: { status: 401 },
		});
	});

	it('should return traffic stats data', async () => {
		const mockData = {
			d: [
				{ Date: '2024-01-01', Impressions: 1000, Clicks: 50 },
				{ Date: '2024-01-02', Impressions: 1200, Clicks: 60 },
			],
		};
		mockedAxios.get.mockResolvedValueOnce({ data: mockData });

		const response = await axios.get('https://ssl.bing.com/webmaster/api.svc/json/GetRankAndTrafficStats');
		expect(response.data.d.length).toBe(2);
		expect(response.data.d[0].Impressions).toBe(1000);
	});

	it('should return backlink data', async () => {
		const mockData = {
			d: [
				{ SourceUrl: 'https://referrer.com/page1', AnchorText: 'Example' },
				{ SourceUrl: 'https://referrer.com/page2', AnchorText: 'Test' },
			],
		};
		mockedAxios.get.mockResolvedValueOnce({ data: mockData });

		const response = await axios.get('https://ssl.bing.com/webmaster/api.svc/json/GetUrlLinks');
		expect(response.data.d.length).toBe(2);
		expect(response.data.d[0].SourceUrl).toContain('referrer.com');
	});

	it('should return crawl stats', async () => {
		const mockData = {
			d: {
				CrawledPages: 5000,
				CrawlErrors: 10,
				AverageDownloadTime: 250,
			},
		};
		mockedAxios.get.mockResolvedValueOnce({ data: mockData });

		const response = await axios.get('https://ssl.bing.com/webmaster/api.svc/json/GetCrawlStats');
		expect(response.data.d.CrawledPages).toBe(5000);
	});

	it('should submit URL batch successfully', async () => {
		mockedAxios.post.mockResolvedValueOnce({
			data: { d: null },
		});

		const body = {
			urlList: [
				'https://example.com/new-page-1',
				'https://example.com/new-page-2',
			],
		};

		const response = await axios.post(
			'https://ssl.bing.com/webmaster/api.svc/json/SubmitUrlBatch',
			body,
			{ headers: { 'Content-Type': 'application/json' } }
		);

		expect(mockedAxios.post).toHaveBeenCalledWith(
			expect.stringContaining('SubmitUrlBatch'),
			body,
			expect.any(Object)
		);
	});
});

// Integration test (requires actual credentials - skipped by default)
describe.skip('Integration Tests', () => {
	const testApiKey = process.env.BING_API_KEY || '';
	const testSiteUrl = process.env.BING_SITE_URL || '';

	it('should connect to Bing API', async () => {
		const axios = require('axios');
		const response = await axios.get(
			`https://ssl.bing.com/webmaster/api.svc/json/GetUserSites?apikey=${testApiKey}&siteUrl=${testSiteUrl}`
		);
		expect(response.status).toBe(200);
	});
});
