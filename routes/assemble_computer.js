const db = require("../db");

exports.assemble_computer = function(req, res) {
  const systemnoArr = Array.isArray(req.body["systemno"]) ? req.body["systemno"] : [req.body["systemno"]];
  const locationArr = req.body["location"];
  const mousesnoArr = Array.isArray(req.body["mousesno"]) ? req.body["mousesno"] : [req.body["mousesno"]];
  const monitorsnoArr = Array.isArray(req.body["monitorsno"]) ? req.body["monitorsno"] : [req.body["monitorsno"]];
  const cpusnoArr = Array.isArray(req.body["cpusno"]) ? req.body["cpusno"] : [req.body["cpusno"]];
  const keyboardsnoArr = Array.isArray(req.body["keyboardsno"]) ? req.body["keyboardsno"] : [req.body["keyboardsno"]];
  
  let errorMessages = [];
  let successSerialNumbers = [];

 
  
  for (let i = 0; i < systemnoArr.length; i++) {
    const systemno = systemnoArr[i];
    const location = locationArr[i];
    const mousesno = mousesnoArr[i];
    const monitorsno = monitorsnoArr[i];
    const cpusno = cpusnoArr[i];
    const keyboardsno = keyboardsnoArr[i];

    const q = `INSERT INTO computer_master (systemno, location, mousesno, monitorsno, cpusno, keyboardsno) VALUES ("${systemno}", "${location}", "${mousesno}", "${monitorsno}", "${cpusno}", "${keyboardsno}")`;
    db.query(q, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Inserted successfully");
        res.redirect("/assemble_computer");
      }
    });
  }
};
