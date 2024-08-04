import puppeteer from "puppeteer-extra";

import StealthPlugin from "puppeteer-extra-plugin-stealth";

puppeteer.use(StealthPlugin());

async function loginAccount() {
  const browser = await puppeteer.launch({
    headless: true,
  });

  const page = await browser.newPage(); // Create a new page
  await page.setUserAgent(
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36"
  );

  await page.goto("https://play.pixels.xyz/", {
    waitUntil: "load",
    timeout: 0,
  });

  const code = await page.evaluate(() => {
    return new Promise((m, R) => {
      setTimeout(() => {
        m("4fd394a2-bc99-47c5-86d2-64414ee3d1db");
      }, 3e4),
        window.GetTelemetryID
          ? window
              .GetTelemetryID("public-token-live-e4dbf337-9f27-447f-908f-17038ec8d940")
              .then((C) => {
                C ||
                  (console.log("GetTelemetryID returned nothing"),
                  R({
                    message: "no-telemetryId-available",
                  })),
                  m(C);
              })
          : (console.log("GetTelemetryID not on window"),
            R({
              message: "no-telemetryId-available",
            }));
    });
  });

  await browser.close();
  return code;
}

export { loginAccount };
// loginAccount().then((code) => console.log(code));
