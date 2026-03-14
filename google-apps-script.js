// ═══════════════════════════════════════════════════
// CRON: Sync engine trigger (every 1 minute)
// ═══════════════════════════════════════════════════

function triggerCron() {
  var URL = "https://stock-market-one-navy.vercel.app/api/cron/snapshot?secret=abc";

  try {
    var response = UrlFetchApp.fetch(URL, {
      method: "get",
      muteHttpExceptions: true,
      followRedirects: true,
    });

    var code = response.getResponseCode();
    var body = response.getContentText();

    console.log("[" + new Date().toISOString() + "] Status: " + code + " | " + body.substring(0, 200));

    if (code === 200) {
      var data = JSON.parse(body);
      if (data.skipped) {
        console.log("Skipped: " + data.reason);
      }
    }
  } catch (e) {
    console.error("Cron fetch failed: " + e.message);
  }
}

function setupTrigger() {
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === "triggerCron") {
      ScriptApp.deleteTrigger(triggers[i]);
    }
  }

  ScriptApp.newTrigger("triggerCron")
    .timeBased()
    .everyMinutes(1)
    .create();

  console.log("Trigger created: triggerCron will run every 1 minute");
}

function removeTrigger() {
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === "triggerCron") {
      ScriptApp.deleteTrigger(triggers[i]);
      console.log("Trigger removed");
    }
  }
}

// ═══════════════════════════════════════════════════
// CRON: Enrichment trigger (every 5 minutes)
// ═══════════════════════════════════════════════════

function triggerEnrich() {
  var URL = "https://stock-market-one-navy.vercel.app/api/cron/enrich?secret=abc";

  try {
    var response = UrlFetchApp.fetch(URL, {
      method: "get",
      muteHttpExceptions: true,
      followRedirects: true,
    });

    var code = response.getResponseCode();
    var body = response.getContentText();

    console.log("[Enrich " + new Date().toISOString() + "] Status: " + code + " | " + body.substring(0, 300));
  } catch (e) {
    console.error("Enrich fetch failed: " + e.message);
  }
}

function setupEnrichTrigger() {
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === "triggerEnrich") {
      ScriptApp.deleteTrigger(triggers[i]);
    }
  }

  ScriptApp.newTrigger("triggerEnrich")
    .timeBased()
    .everyMinutes(5)
    .create();

  console.log("Trigger created: triggerEnrich will run every 5 minutes");
}

function removeEnrichTrigger() {
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === "triggerEnrich") {
      ScriptApp.deleteTrigger(triggers[i]);
      console.log("Enrich trigger removed");
    }
  }
}

// ═══════════════════════════════════════════════════
// DHAN TOKEN AUTO-RENEWAL (every 23 hours)
// ═══════════════════════════════════════════════════

// Store these in Script Properties instead of hardcoding:
//   DHAN_CLIENT_ID, VERCEL_TOKEN, VERCEL_PROJECT_ID, DEPLOY_HOOK, DHAN_TOKEN
// Run setupScriptProperties() once to initialize them.

function getConfig() {
  var props = PropertiesService.getScriptProperties();
  return {
    dhanClientId: props.getProperty("DHAN_CLIENT_ID"),
    vercelToken: props.getProperty("VERCEL_TOKEN"),
    vercelProjectId: props.getProperty("VERCEL_PROJECT_ID"),
    deployHook: props.getProperty("DEPLOY_HOOK"),
    dhanToken: props.getProperty("DHAN_TOKEN"),
    alertEmail: props.getProperty("ALERT_EMAIL"),
  };
}

function renewDhanToken() {
  var config = getConfig();

  if (!config.dhanToken) {
    console.error("No DHAN_TOKEN in script properties.");
    sendAlert(config, "Dhan token renewal failed: no DHAN_TOKEN in script properties.");
    return;
  }

  // Attempt 1: GET
  var newToken = tryRenew("get", config);

  // Attempt 2: POST (fallback)
  if (!newToken) {
    newToken = tryRenew("post", config);
  }

  if (newToken) {
    PropertiesService.getScriptProperties().setProperty("DHAN_TOKEN", newToken);
    console.log("Token renewed and saved!");
    updateVercelAndRedeploy(config, newToken);
  } else {
    console.error("Both renewal attempts failed.");
    sendAlert(config, "Dhan token renewal failed — both GET and POST attempts returned no new token. Current token may expire soon.");
  }
}

function tryRenew(method, config) {
  try {
    var response = UrlFetchApp.fetch("https://api.dhan.co/v2/RenewToken", {
      method: method,
      headers: {
        "access-token": config.dhanToken,
        "client-id": config.dhanClientId,
        "dhanClientId": config.dhanClientId,
      },
      muteHttpExceptions: true,
    });

    var code = response.getResponseCode();
    var body = response.getContentText();
    console.log(method.toUpperCase() + " attempt: " + code + " | " + body);

    if (code === 200) {
      var data = JSON.parse(body);
      if (data.access_token) {
        return data.access_token;
      }
    }
  } catch (e) {
    console.error(method.toUpperCase() + " renewal error: " + e.message);
  }

  return null;
}

function updateVercelAndRedeploy(config, newToken) {
  try {
    // Find DHAN_ACCESS_TOKEN env var
    var listResp = UrlFetchApp.fetch(
      "https://api.vercel.com/v9/projects/" + config.vercelProjectId + "/env",
      { headers: { Authorization: "Bearer " + config.vercelToken } }
    );
    var envs = JSON.parse(listResp.getContentText()).envs || [];
    var dhanEnv = null;
    for (var i = 0; i < envs.length; i++) {
      if (envs[i].key === "DHAN_ACCESS_TOKEN") {
        dhanEnv = envs[i];
        break;
      }
    }

    if (dhanEnv) {
      UrlFetchApp.fetch(
        "https://api.vercel.com/v9/projects/" + config.vercelProjectId + "/env/" + dhanEnv.id,
        {
          method: "patch",
          headers: {
            Authorization: "Bearer " + config.vercelToken,
            "Content-Type": "application/json",
          },
          payload: JSON.stringify({ value: newToken }),
        }
      );
      console.log("Vercel env updated");
    } else {
      console.error("DHAN_ACCESS_TOKEN env var not found in Vercel project");
      sendAlert(config, "Token renewed but DHAN_ACCESS_TOKEN env var not found in Vercel.");
      return;
    }

    // Trigger redeploy
    UrlFetchApp.fetch(config.deployHook, { method: "post", muteHttpExceptions: true });
    console.log("Redeploy triggered");

  } catch (e) {
    console.error("Vercel update failed: " + e.message);
    sendAlert(config, "Token renewed but Vercel update/redeploy failed: " + e.message);
  }
}

function sendAlert(config, message) {
  if (config.alertEmail) {
    try {
      MailApp.sendEmail(config.alertEmail, "[Stock App] Alert", message);
    } catch (e) {
      console.error("Failed to send alert email: " + e.message);
    }
  }
}

function setupTokenRenewal() {
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === "renewDhanToken") {
      ScriptApp.deleteTrigger(triggers[i]);
    }
  }

  ScriptApp.newTrigger("renewDhanToken")
    .timeBased()
    .everyHours(23)
    .create();

  console.log("Auto-renewal trigger created: every 23 hours");
}

function removeTokenRenewal() {
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === "renewDhanToken") {
      ScriptApp.deleteTrigger(triggers[i]);
      console.log("Token renewal trigger removed");
    }
  }
}

// ═══════════════════════════════════════════════════
// SETUP ALL TRIGGERS (run once)
// ═══════════════════════════════════════════════════

function setupAll() {
  setupTrigger();        // Quote sync: every 1 min
  setupEnrichTrigger();  // Sector/industry enrichment: every 5 min
  setupTokenRenewal();   // Dhan token renewal: every 23 hours
  console.log("All triggers set up!");
}

function removeAll() {
  removeTrigger();
  removeEnrichTrigger();
  removeTokenRenewal();
  console.log("All triggers removed!");
}

// ═══════════════════════════════════════════════════
// ONE-TIME SETUP: Run this once to store your secrets
// ═══════════════════════════════════════════════════

function setupScriptProperties() {
  var props = PropertiesService.getScriptProperties();
  props.setProperties({
    DHAN_CLIENT_ID: "YOUR_CLIENT_ID",
    DHAN_TOKEN: "YOUR_CURRENT_DHAN_TOKEN",
    VERCEL_TOKEN: "YOUR_VERCEL_TOKEN",
    VERCEL_PROJECT_ID: "YOUR_VERCEL_PROJECT_ID",
    DEPLOY_HOOK: "YOUR_DEPLOY_HOOK_URL",
    ALERT_EMAIL: "your@email.com",
  });
  console.log("Script properties set. Now delete the real values from this function!");
}
