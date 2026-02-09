// 🔐 Core Phishing Detection Engine
// All the cybersecurity magic happens here 🧠

import { isIP } from 'node:net';

// Known URL shorteners
const URL_SHORTENERS = [
  'bit.ly', 'tinyurl.com', 'goo.gl', 't.co', 'ow.ly', 
  'is.gd', 'buff.ly', 'adf.ly', 'bit.do', 'short.io',
  'rb.gy', 'cutt.ly', 'shorturl.at', 'tiny.cc'
];

// Suspicious keywords commonly used in phishing
const SUSPICIOUS_KEYWORDS = [
  'login', 'verify', 'account', 'update', 'secure', 'banking',
  'password', 'confirm', 'suspended', 'locked', 'urgent',
  'click', 'free', 'winner', 'prize', 'claim', 'gift',
  'paypal', 'amazon', 'microsoft', 'apple', 'google',
  'wallet', 'crypto', 'bitcoin', 'blockchain', 'nft'
];

// Common legitimate domains (for typosquatting detection)
const LEGITIMATE_DOMAINS = [
  'google.com', 'facebook.com', 'amazon.com', 'paypal.com',
  'microsoft.com', 'apple.com', 'netflix.com', 'instagram.com',
  'twitter.com', 'linkedin.com', 'github.com', 'stackoverflow.com',
  'reddit.com', 'wikipedia.org', 'youtube.com', 'gmail.com'
];

const COMMON_SLD = [
  'co.uk', 'org.uk', 'ac.uk', 'gov.uk',
  'com.au', 'net.au', 'org.au',
  'co.in', 'com.br', 'com.mx',
  'co.jp', 'co.kr', 'com.sg'
];

/**
 * Main scanning function - analyzes URL for phishing indicators
 * @param {string} url - The URL to scan
 * @returns {object} - Detailed analysis results
 */
export async function scanURL(url) {
  const results = {
    url,
    isPhishing: false,
    riskScore: 0,
    riskLevel: 'safe',
    flags: [],
    riskBreakdown: [],
    details: {},
    timestamp: new Date().toISOString()
  };

  try {
    // Normalize URL
    let normalizedURL = url.trim().toLowerCase();
    if (!normalizedURL.startsWith('http://') && !normalizedURL.startsWith('https://')) {
      normalizedURL = 'http://' + normalizedURL;
    }

    const urlObj = new URL(normalizedURL);
    results.normalizedUrl = urlObj.href;
    
    // Run all detection checks
    checkHTTPS(urlObj, results);
    checkIPAddress(urlObj, results);
    checkHomograph(urlObj, results);
    checkBrandSpoofing(urlObj, results);
    checkURLShortener(urlObj, results);
    checkSuspiciousKeywords(urlObj, results);
    checkSpecialCharacters(urlObj, results);
    checkTyposquatting(urlObj, results);
    checkURLLength(urlObj, results);
    checkSubdomains(urlObj, results);
    checkPortNumber(urlObj, results);

    console.log(`\n🔍 Scanning URL: ${url}`);
    console.log(`📊 Sync checks completed. Current score: ${results.riskScore}`);
    console.log(`📋 Flags so far: ${results.flags.length} issues`);

    const asyncChecks = [
      checkRedirects(urlObj, results),
      checkTLS(urlObj, results),
      checkDNSRecords(urlObj, results),
      checkDomainAge(urlObj, results)
    ];

    const asyncResults = await Promise.allSettled(asyncChecks);
    asyncResults.forEach((result, i) => {
      const checkName = ['Redirects', 'TLS', 'DNS', 'Domain Age'][i];
      if (result.status === 'fulfilled') {
        console.log(`✅ ${checkName}: OK`);
      } else {
        console.log(`⚠️  ${checkName}: ${result.reason?.message || 'Failed'}`);
      }
    });

    console.log(`\n✏️  Final Risk Score: ${results.riskScore} | Level: ${results.riskLevel}`);
    console.log(`⚠️  Total Flags: ${results.flags.length}\n`);
    
    // Calculate final risk level
    calculateRiskLevel(results);
    
    return results;
    
  } catch (error) {
    return {
      ...results,
      error: 'Invalid URL format',
      flags: ['Invalid or malformed URL']
    };
  }
}

function addRisk(results, points, reason) {
  results.riskScore += points;
  results.flags.push(reason);
  results.riskBreakdown.push({ points, reason });
}

/**
 * Check if URL uses HTTPS
 */
function checkHTTPS(urlObj, results) {
  if (urlObj.protocol === 'http:') {
    console.log(`  🚨 No HTTPS - using plain HTTP`);
    addRisk(results, 20, 'No HTTPS encryption - data can be intercepted');
    results.details.https = false;
  } else {
    results.details.https = true;
  }
}

/**
 * Check if URL uses IP address instead of domain name
 */
function checkIPAddress(urlObj, results) {
  const hostname = urlObj.hostname;
  
  if (isIP(hostname)) {
    console.log(`  🚨 IP address detected: ${hostname}`);
    addRisk(results, 25, 'Uses IP address instead of domain name - highly suspicious');
    results.details.usesIP = true;
  } else {
    results.details.usesIP = false;
  }
}

/**
 * Check for homograph (IDN) attacks using punycode
 */
function checkHomograph(urlObj, results) {
  const hostname = urlObj.hostname;
  
  if (hostname.includes('xn--')) {
    addRisk(results, 15, 'Punycode detected (potential homograph attack)');
    results.details.punycode = true;
  } else {
    results.details.punycode = false;
  }
}

/**
 * Check for brand spoofing in subdomains (e.g., paypal.com.evil.com)
 */
function checkBrandSpoofing(urlObj, results) {
  const hostname = urlObj.hostname.replace('www.', '');
  
  for (const legitDomain of LEGITIMATE_DOMAINS) {
    if (
      hostname.includes(legitDomain) &&
      hostname !== legitDomain &&
      !hostname.endsWith(`.${legitDomain}`)
    ) {
      console.log(`  🚨 Brand spoofing detected: "${hostname}" contains "${legitDomain}"`);
      addRisk(results, 20, `Brand spoofing detected: ${legitDomain} appears inside another domain`);
      results.details.brandSpoofing = {
        detected: true,
        brand: legitDomain
      };
      return;
    }
  }
  
  results.details.brandSpoofing = { detected: false };
}

/**
 * Check if URL is a known shortener
 */
function checkURLShortener(urlObj, results) {
  const hostname = urlObj.hostname.replace('www.', '');
  
  if (URL_SHORTENERS.includes(hostname)) {
    addRisk(results, 15, 'URL shortener detected - destination is hidden');
    results.details.isShortener = true;
  } else {
    results.details.isShortener = false;
  }
}

/**
 * Check for suspicious keywords in URL
 */
function checkSuspiciousKeywords(urlObj, results) {
  const fullURL = urlObj.href.toLowerCase();
  const foundKeywords = [];
  
  SUSPICIOUS_KEYWORDS.forEach(keyword => {
    if (fullURL.includes(keyword)) {
      foundKeywords.push(keyword);
    }
  });
  
  if (foundKeywords.length > 0) {
    console.log(`  🚨 Suspicious keywords: ${foundKeywords.join(', ')}`);
    const points = Math.min(foundKeywords.length * 8, 25);
    addRisk(results, points, `Suspicious keywords found: ${foundKeywords.join(', ')}`);
    results.details.suspiciousKeywords = foundKeywords;
  } else {
    results.details.suspiciousKeywords = [];
  }
}

/**
 * Check for excessive special characters
 */
function checkSpecialCharacters(urlObj, results) {
  const hostname = urlObj.hostname;
  const specialChars = (hostname.match(/[-_.@]/g) || []).length;
  
  if (specialChars >= 4) {
    addRisk(results, 15, 'Excessive special characters in domain - possible obfuscation');
    results.details.excessiveSpecialChars = true;
  } else {
    results.details.excessiveSpecialChars = false;
  }
}

/**
 * Check for typosquatting (domain name similar to legitimate sites)
 */
function checkTyposquatting(urlObj, results) {
  const hostname = urlObj.hostname.replace('www.', '');
  
  for (const legitDomain of LEGITIMATE_DOMAINS) {
    const similarity = calculateSimilarity(hostname, legitDomain);
    
    // If very similar but not exact match
    if (similarity > 0.7 && hostname !== legitDomain) {
      console.log(`  🚨 Typosquatting detected: "${hostname}" is ${(similarity * 100).toFixed(0)}% similar to "${legitDomain}"`);
      addRisk(results, 30, `Possible typosquatting: looks similar to ${legitDomain}`);
      results.details.typosquatting = {
        detected: true,
        similarTo: legitDomain,
        similarity: similarity.toFixed(2)
      };
      break;
    }
  }
  
  if (!results.details.typosquatting) {
    results.details.typosquatting = { detected: false };
  }
}

/**
 * Check URL length
 */
function checkURLLength(urlObj, results) {
  const urlLength = urlObj.href.length;
  
  if (urlLength > 150) {
    addRisk(results, 15, 'Unusually long URL - often used to hide malicious content');
    results.details.excessiveLength = true;
  } else {
    results.details.excessiveLength = false;
  }
  
  results.details.urlLength = urlLength;
}

/**
 * Check for suspicious subdomains
 */
function checkSubdomains(urlObj, results) {
  const hostname = urlObj.hostname;
  const parts = hostname.split('.');
  const subdomainCount = parts.length - 2; // Exclude domain and TLD
  
  if (subdomainCount >= 3) {
    addRisk(results, 12, 'Multiple subdomains detected - potential phishing technique');
    results.details.excessiveSubdomains = true;
  } else {
    results.details.excessiveSubdomains = false;
  }
  
  results.details.subdomainCount = Math.max(0, subdomainCount);
}

/**
 * Check for non-standard ports
 */
function checkPortNumber(urlObj, results) {
  const port = urlObj.port;
  const standardPorts = ['', '80', '443'];
  
  if (port && !standardPorts.includes(port)) {
    addRisk(results, 10, `Non-standard port detected: ${port}`);
    results.details.nonStandardPort = true;
  } else {
    results.details.nonStandardPort = false;
  }
}

async function checkRedirects(urlObj, results) {
  const maxRedirects = 5;
  const chain = [];
  let currentUrl = urlObj.href;
  let downgradeDetected = false;

  for (let i = 0; i < maxRedirects; i++) {
    const response = await fetchWithTimeout(currentUrl, { method: 'HEAD', redirect: 'manual' }, 4000);
    const location = response.headers.get('location');
    if (!location || response.status < 300 || response.status >= 400) {
      break;
    }

    const nextUrl = new URL(location, currentUrl).href;
    chain.push(nextUrl);
    if (currentUrl.startsWith('https://') && nextUrl.startsWith('http://')) {
      downgradeDetected = true;
    }
    currentUrl = nextUrl;
  }

  results.details.redirects = chain;
  results.details.redirectCount = chain.length;
  results.details.finalUrl = chain.length > 0 ? chain[chain.length - 1] : urlObj.href;

  if (downgradeDetected) {
    addRisk(results, 15, 'Redirect chain downgrades HTTPS to HTTP');
  }

  if (chain.length >= 3) {
    addRisk(results, 10, 'Multiple redirects detected - potential cloaking');
  }

  const finalHost = new URL(results.details.finalUrl).hostname;
  const originalDomain = getRegistrableDomain(urlObj.hostname);
  const finalDomain = getRegistrableDomain(finalHost);
  if (originalDomain && finalDomain && originalDomain !== finalDomain) {
    addRisk(results, 8, 'Final destination domain differs from original URL');
  }
}

async function checkTLS(urlObj, results) {
  if (urlObj.protocol !== 'https:') {
    results.details.tls = { checked: false };
    return;
  }

  try {
    await fetchWithTimeout(urlObj.href, { method: 'HEAD' }, 4000);
    results.details.tls = { checked: true, valid: true };
  } catch (error) {
    results.details.tls = { checked: true, valid: false, error: error.message };
    addRisk(results, 8, 'TLS handshake failed or blocked');
  }
}

async function checkDNSRecords(urlObj, results) {
  const hostname = urlObj.hostname;
  const [aRecord, mxRecord] = await Promise.allSettled([
    resolveDns(hostname, 'A'),
    resolveDns(hostname, 'MX')
  ]);

  const aAnswers = aRecord.status === 'fulfilled' ? aRecord.value : [];
  const mxAnswers = mxRecord.status === 'fulfilled' ? mxRecord.value : [];

  results.details.dns = {
    aRecords: aAnswers,
    mxRecords: mxAnswers
  };

  if (aAnswers.length === 0) {
    addRisk(results, 15, 'Domain does not resolve to an A record (possible sinkhole)');
  }

  if (mxAnswers.length === 0) {
    addRisk(results, 5, 'Domain has no MX record');
  }

  if (aAnswers.some(isPrivateIP)) {
    addRisk(results, 12, 'Domain resolves to a private IP range');
  }
}

async function checkDomainAge(urlObj, results) {
  const registrableDomain = getRegistrableDomain(urlObj.hostname);
  if (!registrableDomain) {
    return;
  }

  try {
    const rdapData = await fetchRdap(registrableDomain);
    const createdEvent = rdapData.events?.find(
      (event) => event.eventAction === 'registration' || event.eventAction === 'created'
    );

    if (!createdEvent?.eventDate) {
      return;
    }

    const createdDate = new Date(createdEvent.eventDate);
    const ageDays = Math.floor((Date.now() - createdDate.getTime()) / 86400000);
    results.details.domainAgeDays = ageDays;
    results.details.domainCreated = createdDate.toISOString();

    if (ageDays < 30) {
      addRisk(results, 20, 'Domain registered within the last 30 days');
    } else if (ageDays < 180) {
      addRisk(results, 10, 'Domain registered within the last 6 months');
    }
  } catch (error) {
    addEnrichmentError(results, `RDAP lookup failed: ${error.message}`);
  }
}

async function resolveDns(hostname, recordType) {
  const url = `https://dns.google/resolve?name=${encodeURIComponent(hostname)}&type=${recordType}`;
  const response = await fetchWithTimeout(url, {}, 4000);
  const data = await response.json();

  if (data.Status !== 0 || !Array.isArray(data.Answer)) {
    return [];
  }

  return data.Answer.map((answer) => answer.data).filter(Boolean);
}

async function fetchRdap(domain) {
  const response = await fetchWithTimeout(`https://rdap.org/domain/${domain}`, {}, 4000);
  if (!response.ok) {
    throw new Error(`RDAP response ${response.status}`);
  }
  return response.json();
}

function getRegistrableDomain(hostname) {
  const host = hostname.replace('www.', '').toLowerCase();
  for (const sld of COMMON_SLD) {
    if (host.endsWith(`.${sld}`)) {
      const parts = host.split('.');
      if (parts.length >= 3) {
        return parts.slice(-3).join('.');
      }
    }
  }
  const parts = host.split('.');
  return parts.length >= 2 ? parts.slice(-2).join('.') : host;
}

function isPrivateIP(ip) {
  if (ip.includes(':')) {
    const lower = ip.toLowerCase();
    return lower.startsWith('fc') || lower.startsWith('fd') || lower.startsWith('fe80');
  }

  const octets = ip.split('.').map((value) => Number(value));
  if (octets.length !== 4 || octets.some((value) => Number.isNaN(value))) {
    return false;
  }

  const [a, b] = octets;
  return (
    a === 10 ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168)
  );
}

function addEnrichmentError(results, message) {
  if (!results.details.enrichmentErrors) {
    results.details.enrichmentErrors = [];
  }
  results.details.enrichmentErrors.push(message);
}

async function fetchWithTimeout(resource, options, timeoutMs) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(resource, {
      ...options,
      signal: controller.signal
    });
    return response;
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Calculate final risk level based on score
 */
function calculateRiskLevel(results) {
  const score = results.riskScore;
  
  if (score >= 51) {
    results.riskLevel = 'dangerous';
    results.isPhishing = true;
  } else if (score >= 21) {
    results.riskLevel = 'suspicious';
    results.isPhishing = false;
  } else {
    results.riskLevel = 'safe';
    results.isPhishing = false;
  }
}

/**
 * Calculate similarity between two strings (Levenshtein distance)
 */
function calculateSimilarity(str1, str2) {
  const len1 = str1.length;
  const len2 = str2.length;
  const matrix = [];

  for (let i = 0; i <= len1; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  const distance = matrix[len1][len2];
  const maxLen = Math.max(len1, len2);
  return 1 - distance / maxLen;
}
