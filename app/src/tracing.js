(function () {
  const SERVICE = "diwali-frontend";
  const ENDPOINT = "/v1/traces";

  function hex(bytes) {
    const a = new Uint8Array(bytes);
    crypto.getRandomValues(a);
    return Array.from(a, b => b.toString(16).padStart(2, "0")).join("");
  }

  function nowNs() {
    const micros = Math.round((performance.timeOrigin + performance.now()) * 1000);
    return String(BigInt(micros) * 1000n);
  }

  function attrs(obj) {
    return Object.entries(obj).map(([k, v]) => ({
      key: k,
      value: typeof v === "boolean" ? { boolValue: v } : { stringValue: String(v) }
    }));
  }

  function send(span) {
    const body = {
      resourceSpans: [{
        resource: { attributes: attrs({ "service.name": SERVICE }) },
        scopeSpans: [{ scope: { name: "browser-manual" }, spans: [span] }]
      }]
    };
    fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      keepalive: true
    }).catch(() => {});
  }

  function startSpan(name, attributes) {
    const span = {
      traceId: hex(16),
      spanId: hex(8),
      name: name,
      kind: 1,
      startTimeUnixNano: nowNs(),
      attributes: attrs(attributes || {})
    };
    return {
      end: function (extra) {
        span.endTimeUnixNano = nowNs();
        if (extra) span.attributes = span.attributes.concat(attrs(extra));
        send(span);
      }
    };
  }

  function visible(id) {
    const el = document.getElementById(id);
    return !!el && getComputedStyle(el).display !== "none";
  }

  function waitUntil(check, timeoutMs, done) {
    const t0 = performance.now();
    (function poll() {
      const result = check();
      if (result || performance.now() - t0 > timeoutMs) return done(result);
      setTimeout(poll, 25);
    })();
  }

  function currentUser() {
    const el = document.getElementById("display-user");
    return el ? el.textContent : "unknown";
  }

  function onClick(id, handler) {
    const el = document.getElementById(id);
    if (el) el.addEventListener("click", handler);
  }

  // Login: time until the dashboard or the error message appears
  onClick("login-btn", function () {
    const user = (document.getElementById("username") || {}).value || "unknown";
    const span = startSpan("login", { "user.name": user });
    waitUntil(
      function () { return visible("celebration-section") || visible("login-error"); },
      3000,
      function () { span.end({ "login.success": visible("celebration-section") }); }
    );
  });

  // Bomb click: time until the Diwali message appears
  function trackCrack(name) {
    return function () {
      const span = startSpan(name, { "user.name": currentUser() });
      waitUntil(
        function () { return visible("revealed-greeting-box"); },
        5000,
        function () { span.end(); }
      );
    };
  }
  onClick("cracker-trigger", trackCrack("bomb-click"));
  onClick("burst-again-btn", trackCrack("bomb-click-again"));

  // Logout
  onClick("logout-btn", function () {
    startSpan("logout", { "user.name": currentUser() }).end();
  });
})();