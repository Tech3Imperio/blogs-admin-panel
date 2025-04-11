"use server";

import https from "https";

const generateSitemap = (): void => {
  console.log("Entered generate sitemap");
  const url = process.env.DEPLOY_HOOK;

  const req = https.request(
    url!,
    {
      method: "POST",
    },
    (res) => {
      console.log(`Status Code: ${res.statusCode}`);

      res.on("data", (d) => {
        process.stdout.write(d);
      });
    }
  );

  req.on("error", (error: Error) => {
    console.error("Error triggering redeploy:", error);
  });

  req.end();
};

export default generateSitemap;
