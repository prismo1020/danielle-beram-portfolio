(() => {
  "use strict";

  // Change these TWO public values after deploying the Worker and creating Turnstile.
  // Never put a Cloudflare API token or Turnstile SECRET in this file.
  const API_URL = "https://ask-danielle.danielle-beram.workers.dev/chat";
  const TURNSTILE_SITE_KEY = "REPLACE_WITH_TURNSTILE_SITE_KEY";

  // Do not show a nonfunctional widget while setup is incomplete.
  if (API_URL.includes("REPLACE_WITH") || TURNSTILE_SITE_KEY.includes("REPLACE_WITH")) return;

  const root = document.createElement("div");
  root.className = "askd";
  root.innerHTML = [
    '<button class="askd-launcher" type="button" aria-controls="askd-dialog" aria-expanded="false">',
    '<span class="askd-launcher-mark" aria-hidden="true">DB</span><span>Ask Danielle</span>',
    '</button>',
    '<section id="askd-dialog" class="askd-panel" role="dialog" aria-label="Ask Danielle AI assistant" hidden>',
    '  <header class="askd-header">',
    '    <span class="askd-header-mark" aria-hidden="true">DB</span>',
    '    <div class="askd-header-copy"><strong>Ask Danielle</strong><small>AI assistant · Based on published work</small></div>',
    '    <button class="askd-close" type="button" aria-label="Close chat">×</button>',
    '  </header>',
    '  <div class="askd-messages" role="log" aria-live="polite" aria-relevant="additions text"></div>',
    '  <div class="askd-suggestions" aria-label="Suggested questions">',
    '    <button type="button">How does Danielle approach training?</button>',
    '    <button type="button">What impact did her onboarding redesign have?</button>',
    '    <button type="button">What is Apollo?</button>',
    '  </div>',
    '  <p class="askd-status" role="status">Complete verification to start chatting.</p>',
    '  <div class="askd-verification" aria-label="Anti-spam verification"></div>',
    '  <form class="askd-form">',
    '    <label class="askd-sr" for="askd-input">Your question</label>',
    '    <textarea id="askd-input" rows="1" maxlength="600" placeholder="Ask about Danielle’s work…" required></textarea>',
    '    <button type="submit" disabled aria-label="Send question">Send</button>',
    '  </form>',
    '  <p class="askd-disclosure">AI-generated answers can be mistaken. Do not share personal information. <a href="contact.html">Contact Danielle</a>.</p>',
    '</section>'
  ].join("");
  document.body.appendChild(root);

  const launcher = root.querySelector(".askd-launcher");
  const panel = root.querySelector(".askd-panel");
  const close = root.querySelector(".askd-close");
  const messages = root.querySelector(".askd-messages");
  const suggestions = root.querySelector(".askd-suggestions");
  const status = root.querySelector(".askd-status");
  const verification = root.querySelector(".askd-verification");
  const form = root.querySelector(".askd-form");
  const input = root.querySelector(".askd-form textarea");
  const send = root.querySelector(".askd-form button");
  const conversation = [];
  let turnstileWidget = null;
  let turnstileToken = "";
  let loadingTurnstile = false;
  let busy = false;

  function message(role, text) {
    const bubble = document.createElement("div");
    bubble.className = "askd-message askd-message-" + role;
    bubble.textContent = text; // Never render visitor or model text as HTML.
    messages.appendChild(bubble);
    messages.scrollTop = messages.scrollHeight;
    return bubble;
  }

  message("assistant", "Hi. I’m an AI assistant trained on Danielle’s published projects and experience. Ask me about her approach, results, or background.");

  function updateSend() {
    send.disabled = busy || !turnstileToken || !input.value.trim();
  }

  function resetVerification() {
    turnstileToken = "";
    updateSend();
    if (turnstileWidget !== null && window.turnstile) {
      window.turnstile.reset(turnstileWidget);
    }
  }

  function renderVerification() {
    if (!window.turnstile || turnstileWidget !== null) return;
    turnstileWidget = window.turnstile.render(verification, {
      sitekey: TURNSTILE_SITE_KEY,
      theme: "light",
      size: "flexible",
      callback: (token) => {
        turnstileToken = token;
        status.textContent = "Ready for your question.";
        updateSend();
      },
      "expired-callback": () => {
        turnstileToken = "";
        status.textContent = "Verification expired. Please verify again.";
        updateSend();
      },
      "error-callback": () => {
        turnstileToken = "";
        status.textContent = "Verification could not load. Refresh the page to retry.";
        updateSend();
      }
    });
  }

  function loadVerification() {
    if (window.turnstile) return renderVerification();
    if (loadingTurnstile) return;
    loadingTurnstile = true;
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    script.onload = renderVerification;
    script.onerror = () => { status.textContent = "Verification is unavailable. Please refresh."; };
    document.head.appendChild(script);
  }

  function open() {
    panel.hidden = false;
    launcher.setAttribute("aria-expanded", "true");
    loadVerification();
    input.focus();
  }

  function hide() {
    panel.hidden = true;
    launcher.setAttribute("aria-expanded", "false");
    launcher.focus();
  }

  launcher.addEventListener("click", () => panel.hidden ? open() : hide());
  close.addEventListener("click", hide);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !panel.hidden) hide();
  });
  input.addEventListener("input", updateSend);
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (!send.disabled) form.requestSubmit();
    }
  });

  suggestions.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      input.value = button.textContent;
      updateSend();
      input.focus();
    });
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const question = input.value.trim();
    if (!question || busy || !turnstileToken) return;

    const token = turnstileToken;
    const history = conversation.slice(-6);
    conversation.push({ role: "user", content: question });
    message("user", question);
    suggestions.hidden = true;
    input.value = "";
    busy = true;
    updateSend();
    status.textContent = "Thinking…";
    const placeholder = message("assistant", "…");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: question, token, history }),
      });
      const result = await response.json();
      if (!response.ok || !result.reply) {
        throw new Error(result.error || "Unable to answer right now.");
      }
      placeholder.textContent = result.reply;
      conversation.push({ role: "assistant", content: result.reply.slice(0, 650) });
      status.textContent = "Ready for another question.";
    } catch (error) {
      placeholder.textContent = error.message || "Chat unavailable. Try again.";
      status.textContent = "Please verify again before retrying.";
    } finally {
      busy = false;
      resetVerification(); // Turnstile tokens are single-use.
      messages.scrollTop = messages.scrollHeight;
    }
  });
})();
