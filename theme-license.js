// theme-license.js - Secure Firebase License Validator with Fail-Safe

(function () {
  const THEME_LICENSE_KEY = "DLAB-SITE-A1B2C3D4E5-XYZ";
  const EXPECTED_CREDIT_TEXT = "Developed By YAMMY";
  const CREDIT_ELEMENT_ID = "theme-credit";
  const INTEGRITY_MARKER = "LIC_CHK_PASS_2024_XYZ";

  if (!THEME_LICENSE_KEY || INTEGRITY_MARKER !== "LIC_CHK_PASS_2024_XYZ") {
    document.body.innerHTML = "<h2 style='color:red;text-align:center;'>Theme License Error: License config missing or tampered.</h2>";
    throw new Error("License key or integrity marker missing");
  }

  const creditElement = document.getElementById(CREDIT_ELEMENT_ID);
  if (!creditElement || !creditElement.textContent.includes(EXPECTED_CREDIT_TEXT)) {
    document.body.innerHTML = "<h2 style='color:red;text-align:center;'>Theme License Error: Credit line missing or modified.</h2>";
    throw new Error("Credit line missing or modified");
  }

  Promise.all([
    import("https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js"),
    import("https://www.gstatic.com/firebasejs/11.8.1/firebase-analytics.js"),
    import("https://www.gstatic.com/firebasejs/11.8.1/firebase-database.js")
  ]).then(([firebaseApp, analytics, dbLib]) => {
    const firebaseConfig = {
      apiKey: "AIzaSyBaFIIjQQatADHhs9EQYalW7iFLUHma9Fs",
      authDomain: "designlab-official-licences.firebaseapp.com",
      databaseURL: "https://designlab-official-licences-default-rtdb.firebaseio.com",
      projectId: "designlab-official-licences",
      storageBucket: "designlab-official-licences.appspot.com",
      messagingSenderId: "554677591623",
      appId: "1:554677591623:web:4e7b66bbf17dc782659b62",
      measurementId: "G-GEZQYX8885"
    };

    const app = firebaseApp.initializeApp(firebaseConfig);
    analytics.getAnalytics(app);
    const db = dbLib.getDatabase(app);

    const domain = location.hostname.replace(/^www\./, '').replace(/\./g, '_');
    const refPath = dbLib.ref(db, `licenses/${domain}`);

    dbLib.get(refPath).then(snapshot => {
      if (!snapshot.exists()) {
        document.body.innerHTML = "<h2 style='color:red;text-align:center;'>Theme License Error: License not found for this domain.</h2>";
        throw new Error("No license for domain");
      }

      const data = snapshot.val();
      if (data.licenseKey !== THEME_LICENSE_KEY || data.status !== "active") {
        document.body.innerHTML = "<h2 style='color:red;text-align:center;'>Theme License Error: Invalid or inactive license.</h2>";
        throw new Error("Invalid or inactive license");
      }

      console.log("✅ Theme license verified.");
      dbLib.update(refPath, {
        lastChecked: new Date().toISOString()
      });
    }).catch(err => {
      console.error(err);
      document.body.innerHTML = "<h2 style='color:red;text-align:center;'>Theme License Error: Firebase error during verification.</h2>";
    });

  }).catch(err => {
    console.error(err);
    document.body.innerHTML = "<h2 style='color:red;text-align:center;'>Theme License Error: Required Firebase modules failed to load.</h2>";
  });

})();
