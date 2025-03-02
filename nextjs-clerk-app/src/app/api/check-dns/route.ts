import { NextRequest, NextResponse } from 'next/server';
import dns from 'dns';
import { promisify } from 'util';

// Promisify DNS lookup functions
const lookup = promisify(dns.lookup);
const resolveCname = promisify(dns.resolveCname);

export async function GET(request: NextRequest) {
  const results: any = {
    timestamp: new Date().toISOString(),
    checks: [],
  };

  try {
    // Try DNS lookup for clerk.verdan.io
    try {
      const lookupResult = await lookup('clerk.verdan.io');
      results.checks.push({
        name: 'DNS Lookup for clerk.verdan.io',
        result: `Resolved to IP: ${lookupResult.address}`,
        status: 'success'
      });
    } catch (error) {
      results.checks.push({
        name: 'DNS Lookup for clerk.verdan.io',
        result: `Failed: ${error instanceof Error ? error.message : String(error)}`,
        status: 'error'
      });
      results.dnsLookup = 'DNS lookup for clerk.verdan.io failed';
    }

    // Try CNAME resolution for clerk.verdan.io
    try {
      const cnameResults = await resolveCname('clerk.verdan.io');
      if (cnameResults && cnameResults.length > 0) {
        const expectedCname = 'clerk.accounts.dev';
        const isCorrect = cnameResults.some(cname => 
          cname.includes('clerk.accounts.dev'));
          
        results.checks.push({
          name: 'CNAME for clerk.verdan.io',
          result: `Resolved to: ${cnameResults.join(', ')}`,
          status: isCorrect ? 'success' : 'warning'
        });
        
        if (!isCorrect) {
          results.dnsLookup = `CNAME points to ${cnameResults.join(', ')} instead of ${expectedCname}`;
        }
      } else {
        results.checks.push({
          name: 'CNAME for clerk.verdan.io',
          result: 'No CNAME records found',
          status: 'error'
        });
        results.dnsLookup = 'No CNAME records found for clerk.verdan.io';
      }
    } catch (error) {
      results.checks.push({
        name: 'CNAME for clerk.verdan.io',
        result: `Failed: ${error instanceof Error ? error.message : String(error)}`,
        status: 'error'
      });
      if (!results.dnsLookup) {
        results.dnsLookup = 'CNAME resolution for clerk.verdan.io failed';
      }
    }

    // Try to make a HTTP request to clerk.verdan.io
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch('https://clerk.verdan.io/npm/@clerk/clerk-js@4/dist/clerk.browser.js', {
        method: 'HEAD',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      results.checks.push({
        name: 'HTTP Request to clerk.verdan.io',
        result: `Status: ${response.status} ${response.statusText}`,
        status: response.ok ? 'success' : 'error'
      });
    } catch (error) {
      results.checks.push({
        name: 'HTTP Request to clerk.verdan.io',
        result: `Failed: ${error instanceof Error ? error.message : String(error)}`,
        status: 'error'
      });
      
      // If we haven't already set dnsLookup and this is a fetch error
      if (!results.dnsLookup && error instanceof Error && error.name === 'AbortError') {
        results.dnsLookup = 'Request to clerk.verdan.io timed out after 5 seconds';
      }
    }

  } catch (error) {
    results.error = `General error: ${error instanceof Error ? error.message : String(error)}`;
  }

  return NextResponse.json(results);
}