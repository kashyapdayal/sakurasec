# SakuraSec Login Challenge: The Silent Clue (CTF)

A client-side web challenge focused on encoded secrets and timing-based analysis, culminating in access to a hidden Admin Panel.

## Goal

- Identify the hidden username using client-side storage analysis and decoding.
- Discover the password via a timing side‑channel using an interceptor/fuzzer, then log in to reach the Admin Panel.

## Setup

- Static hosting supported: GitHub Pages, Netlify, or a local static server.
- Tools:
  - A modern web browser.
  - A web proxy with interception and automation (e.g., Burp Suite Community/Pro or OWASP ZAP).

Live deployment: see this repository’s Pages site in your repo settings once enabled on the default branch’s root or docs folder.

## Challenge Flow

1) Find the encoded username from client-side state and request flow.
2) Brute-force the password using a timing signal exposed by the app logic; sort results by response time, not HTTP status.

***

## Phase 1 — Encoded Username (Cookie Analysis)

Context

- The application sets a cookie before issuing a network “probe” during login, and the username is Base64-encoded in that cookie value.

Steps

- Submit any throwaway credentials on the Login page to trigger the probe.
- Intercept the POST /probe request with your proxy.
- Inspect Request Headers → Cookie → find user=[ENCODED_VALUE].
- Base64-decode the value to reveal the username: [ENCODED_VALUE] → [REDACTED_USER].

Hints

- If you miss it in the request, check the browser’s Application/Storage tab for Cookies or try DOM inspection to confirm when the cookie is set client-side.
- Ensure your proxy captures browser-origin traffic and that intercept is on before clicking “Sign in”.

Deliverable

- The decoded username string [REDACTED_USER] (keep it private to maintain challenge integrity).

***

## Phase 2 — Password via Timing Attack

Premise

- The client logic introduces different delays depending on match conditions, creating a measurable timing side-channel for password discovery even on a static host.

Timing Model

- Full Success (username AND password correct): immediate redirect (fastest).
- Success Condition Match (username correct): ~120 ms.
- Failure Condition Match (username incorrect): ~220 ms.

Instructions

- Configure your proxy’s Intruder/Fuzzer:
  - Target the login POST with the fixed username discovered in Phase 1.
  - Set the password field as the payload position and supply a wordlist.
- Important: The static server may return 405 or other non-2xx codes; ignore HTTP status and use “Response Received Time” or “Total Time” as the discriminator when reviewing results.
- Sort the results by shortest time; the fastest response correlates with the correct password [REDACTED_PASS] and triggers the client-side redirect when used in the browser.

Tips

- Keep the proxy running and avoid background network noise while testing, to reduce jitter.
- Run multiple passes or repeat top candidates to confirm the timing gap consistently stands out.

Deliverable

- The discovered password [REDACTED_PASS] (do not publish; preserve the challenge).

***

## Login Validation and Admin Panel

- After you have both the username and password, log in through the UI.
- On full match, the page redirects to admin/panel.html, confirming success.

***

## Hosting Notes

- GitHub Pages:
  - Prefer relative asset paths like href="assets/style.css" at repo root and ../assets/style.css in subfolders to avoid broken CSS on Project Pages (username.github.io/repo).
  - Case sensitivity matters: assets/style.css is different from Assets/Style.css.
- If CSS appears missing, verify the stylesheet URL returns 200 OK and Content-Type: text/css; 404s often show up as text/html and cause “stylesheet not loaded” warnings in DevTools.

***

## Learning Objectives

- Recognize client-side secret exposure and common encodings like Base64 in storage and headers.
- Execute a practical timing attack workflow using sorter-by-time fuzzing in a proxy tool, independent of HTTP status codes.

***

## Ethical Use

- Use strictly in controlled training environments with consent. Do not deploy such patterns in production apps; consult modern authentication hardening guidance and rate-limiting best practices for real-world systems.
