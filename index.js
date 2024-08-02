/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npx wrangler dev src/index.js` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npx wrangler publish src/index.js --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const path = url.pathname;
  //  const email = request.headers.get("Cf-Access-Authenticated-User-Email");
  //  const timestamp = new Date().toISOString();
  //  const country = request.headers.get("cf-ipcountry");

    if (path.startsWith('/secure/')) {
      const segments = path.split('/');
      if (segments[2].endsWith('#')){
        count = segments[2]; 
        segments[2]=count.substring(0,str.length - 1);
      }
      const country = segments[2];
      return await handleCountryRequest(country);
      //return new Response(country , {status : 200});
    } else if (path === '/secure') {
      return await handleSecureRequest(request);
    } else {
      return new Response('Not Found', { status: 404 });
    }
  }
};

async function handleSecureRequest(request) {
  // For demonstration purposes, using static data
  const email = request.headers.get("Cf-Access-Authenticated-User-Email");
  const timestamp = new Date().toISOString();
  const country = request.headers.get("cf-ipcountry");

  const responseHtml = `
     <!DOCTYPE html>
     <html>
     <head><title>Secure Page</title></head>
     <body>
     <p>${email} authenticated at ${timestamp} from <a href="/secure/${country}">${country}</a></p>
     </body>
     </html>
   `;
  
   return new Response(responseHtml, {
     headers: { 'Content-Type': 'text/html' }
   });

  //return new Response( email );
}

async function handleCountryRequest(country) {
  try {
    const r2BucketUrl = `https://pub-e194ef5a7a8f43129a34c35314103c6d.r2.dev/${country}.png`;
    const response = await fetch(r2BucketUrl);

    if (response.ok) {
      const blob = await response.blob();
      return new Response(blob, {
        headers: { 'Content-Type': 'image/png' }
      });
    } else {
      //test = "Flag not found for " + country
      return new Response("Flag not found " , { status: 404 }, );

    }
  } catch (err) {
    //test = "Error Flag not found for " + country
    return new Response("Error fetching country flag", { status: 500 });
  }
}

