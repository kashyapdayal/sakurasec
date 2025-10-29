SakuraSec Login Challenge: The Silent Clue (CTF)

# Challenge Goal

This challenge is a test of low-level web application analysis, focusing on client-side secrets and timing vulnerabilities. The primary objective is to successfully gain access to the hidden Admin Panel.

This requires two key phases:

Discover the Username: The required username is concealed on the client-side using a common encoding method.

Discover the Password: The password must be found through a systematic brute-force, exploiting a subtle, built-in application weakness.

# Setup and Environment

This challenge is designed to run as a static web application (e.g., hosted on GitHub Pages, Netlify, or a local server).

Prerequisites

A web browser.

A proxy tool capable of interception and automated attacks (e.g., Burp Suite or OWASP ZAP).

Deployment

This challenge is hosted on GitHub Pages: https://github.com/kashyapdayal/sakurasec

# The Challenge Details (Hints)

Step 1: Finding the Encoded Username (Cookie Analysis)

The correct username is [REDACTED_USER]. It is not stored in the visible, minified JavaScript but is Base64-encoded and placed into a browser storage location before a network probe is executed.

Task:

Attempt a login with any throwaway credentials.

Intercept the POST /probe request using your proxy tool.

Analyze the Request Headers. A critical piece of information is stored in the Cookie header. Look for the cookie named user=.

Decode the Base64 string found in the cookie to retrieve the plain text username: [ENCODED_VALUE] → [REDACTED_USER].

Step 2: Finding the Password ([REDACTED_PASS]) (Timing Attack)

Once the username is identified, the next step is to find the corresponding password.

Challenge Vulnerability: The application logic contains a client-side Timing Attack vulnerability built into the success validation delay.

Condition

Delay in app.js

Transaction Speed

Full Success (Username AND Password are correct)

N/A (Immediate Redirect)

Fastest

Success Condition Match (e.g., correct username)

120ms

Shorter

Failure Condition Match (e.g., incorrect username)

220ms

Longer

Task:

Configure your proxy tool's Intruder/Fuzzer using the now-known username.

Target the password field with a wordlist.

Crucial: Since the static server rejects the POST request with a 405 error, ignore the HTTP Status Code. Instead, sort the Intruder results by the Response Received Time.

The payload that corresponds to the shortest transaction time will reveal the correct password: [REDACTED_PASS].

Success

Successfully logging in with the discovered credentials will validate the input in the browser and redirect the user to the admin/panel.html page.
