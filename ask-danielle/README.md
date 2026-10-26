# Ask Danielle — GitHub Pages + Cloudflare Workers AI

This is a public-facing AI assistant for Danielle Beram's existing GitHub Pages portfolio. It uses a Cloudflare Worker and its AI binding. The changes are prepared in a separate feature branch. The Worker is NOT deployed yet.

## Files

- worker/src/index.js — /chat API, curated public knowledge, Turnstile server verification, AI inference, request limits, and CORS
- worker/wrangler.toml — model binding and approximate rate limiter
- ../js/ask-danielle.js — website chat widget
- ../css/ask-danielle.css — matching brand styling
- ../js/site.js — automatic widget loading on all portfolio pages

The button remains hidden until both configuration placeholders in js/ask-danielle.js have been replaced. Merging without setup won't display a broken chat window.

## Step 1. Cloudflare and Turnstile

Open https://dash.cloudflare.com/ and create or sign into your free account.

In Turnstile choose Add widget:
- Name: Ask Danielle
- Hostname: prismo1020.github.io (no https and no path)
- Mode: Managed

Save the SITEKEY (public) and SECRET KEY (private). Never put the secret key in the GitHub repository, browser JavaScript, or a chat message.

## Step 2. Deploy the Worker

You need Node.js/npm installed. In Terminal:

    git clone https://github.com/prismo1020/danielle-beram-portfolio.git
    cd danielle-beram-portfolio
    git switch feature/ask-danielle-cloudflare
    cd ask-danielle/worker
    npx wrangler login
    npx wrangler deploy

Cloudflare returns a URL similar to https://ask-danielle.YOUR-SUBDOMAIN.workers.dev. Use the real generated URL.

Now store your private Turnstile secret as a Cloudflare Worker secret:

    npx wrangler secret put TURNSTILE_SECRET

Paste your Turnstile secret at the prompt. It is stored in Cloudflare, not committed to GitHub.

## Step 3. Connect the website

In js/ask-danielle.js replace:
- API_URL with your deployed Worker URL followed by /chat
- TURNSTILE_SITE_KEY with the Turnstile site's public SITEKEY

Commit the edited public configuration to the feature branch and merge the pull request once ready. The same widget will load across the portfolio without changing each HTML page.

## Step 4. Verify

1. Open your Worker address followed by /health. It should return a JSON status of ok. This tests routing, not model inference.
2. Open your GitHub Pages portfolio after publishing.
3. Click Ask Danielle and complete Turnstile if required.
4. Ask how Danielle redesigned onboarding. The answer should mention 412 hires and certification time changing from 24 to 15 days.
5. Try a second message and confirm verification works again.
6. Test mobile view, the Contact link, and unknown/private questions.

## Free-tier and privacy notes

- Cloudflare Workers AI currently allows 10,000 neurons per day at no cost on the Free plan; it refuses excess usage rather than billing. Usage depends on model and response length. Pricing: https://developers.cloudflare.com/workers-ai/platform/pricing/
- Selected model: @cf/meta/llama-3.1-8b-instruct-fp8-fast.
- Rate limiting: approximately 10 messages per minute per client IP as seen by Cloudflare; shared IPs may collide, and this is NOT a strict global quota. Documentation: https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/
- Turnstile tokens must be checked by the Worker using server-side Siteverify. Merely displaying the challenge in the browser is insufficient. Details: https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
- This application does not persist chat messages in a database or use analytics. The last few messages are submitted for context to Cloudflare's inference service. Do not invite visitors to submit private information. Review their data policy: https://developers.cloudflare.com/workers-ai/platform/data-usage/
- The bot uses a manually curated snapshot of public facts in worker/src/index.js. It does not fetch the site live or access internal Apollo knowledge. Update SYSTEM_PROMPT and redeploy after major portfolio changes.
- It identifies itself as an AI assistant. Like other language models, it can still be mistaken or manipulated.
- The allowed browser origin and Turnstile hostname are fixed to prismo1020.github.io in the Worker. Update both and the Turnstile widget if you move to a custom domain.
- There is no Workers AI API key in this solution because the Worker uses the AI binding.

## Troubleshooting

- No button: one or both placeholder strings still exist, or the new JS has not been published.
- Verification failed: confirm exact hostname and matching sitekey/secret pair; upload the secret to the Worker.
- 403 / CORS: confirm visitor origin is https://prismo1020.github.io.
- 503: confirm the Worker is deployed with the AI binding, secret, and remaining daily AI capacity.
