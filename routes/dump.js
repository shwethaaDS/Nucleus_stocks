const db = require("../db");

exports.dump = (req, res) => {
  const serialNos = Array.isArray(req.body["serialno"]) ? req.body["serialno"] : [req.body["serialno"]];
  const dumpDate = req.body["fdate"];

  const successSerialNos = []; // To keep track of inserted serial numbers
  const errorMessages = []; // To store error messages

  const promises = serialNos.map((serialNo, index) => {
    const checkDeviceQuery = `SELECT * FROM device_master WHERE serialno = "${serialNo}"`;

    return new Promise((resolve, reject) => {
      db.query(checkDeviceQuery, (checkDeviceErr, checkDeviceResult) => {
        if (checkDeviceErr) {
          console.log(checkDeviceErr);
          reject(checkDeviceErr);
        } else if (checkDeviceResult.length === 0) {
          const errorMsg = `Serial number ${serialNo} does not exist in the device master table`;
          console.log(errorMsg);
          errorMessages.push(errorMsg);
          resolve();
        } else if (checkDeviceResult[0].status === "working") {
          const errorMsg = `Serial number ${serialNo} is not eligible for dumping because its status is ${checkDeviceResult[0].status}`;
          console.log(errorMsg);
          errorMessages.push(errorMsg);
          resolve();
        } else if (checkDeviceResult[0].status === "notworking") {
          const insertQuery = `INSERT INTO dump (serialno, disposaldate) VALUES ('${serialNo}', '${dumpDate}')`;
          db.query(insertQuery, (insertErr) => {
            if (insertErr) {
              console.log(`Error inserting serial number ${serialNo}: ${insertErr}`);
              reject(insertErr);
            } else {
              console.log(`Inserted serial number ${serialNo} successfully`);
              successSerialNos.push(serialNo);
              resolve();
            }
          });
        }
      });
    });
  });

  Promise.all(promises)
    .then(() => {
      if (errorMessages.length > 0) {
        const alert = `Errors: ${errorMessages.join(", ")}`;
        console.log("Errors:", errorMessages);
        res.render("dump", {
          title: "dump",
          alert,
          role: res.locals.role,
          isPR: res.locals.isPR,
          errors: errorMessages,
        });
      } else {
        const alert = "Serial numbers sent to dump successfully";
        console.log("Success:", successSerialNos);
        res.render("dump", {
          title: "dump",
          alert,
          role: res.locals.role,
          isPR: res.locals.isPR,
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.render("dump", {
        title: "dump",
        alert: "Insertion unsuccessful",
        errors: ["An error occurred while processing your request. Please try again later."],
      });
    });
};
