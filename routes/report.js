const db = require("../db");
const csvWriter = require("csv-writer");
const fs = require("fs");

exports.report = (req, res) => {
  const q = `SELECT * FROM device_master WHERE verify = "verified"`;

  db.query(q, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.render("report", {
        title: "Report",
        menu: "Report",
        stock: result,
        filter: "All", // Set the filter to "All"
        status: "All", // Set the status to "All"
        lab: "All", // Set the lab to "All"
      });
    }
  });
};

exports.filterRequest = (req, res) => {
  const reportBy = req.body.reportBy;
  const status = req.body.status;
  const lab = req.body.lab;

  console.log('reportBy:', reportBy);
  console.log('status:', status);
  console.log('lab:', lab);

  let q = '';

  if (reportBy === 'dump') {
    q = `SELECT d.serialno, d.disposaldate, m.devicetype FROM dump d JOIN device_master m ON d.serialno = m.serialno`;
  } else if (reportBy === 'invoiceno') {
    q = `SELECT invoiceno, invoicedate, serialno, devicetype FROM device_master WHERE verify = 'verified'`;
  } else if (status === 'working') {
    q = `SELECT serialno, devicetype, location FROM device_master WHERE verify = 'verified' AND status = 'Working'`;
  } else if (status === 'notWorking') {
    q = `SELECT serialno, devicetype, location FROM device_master WHERE verify = 'verified' AND status = 'not working'`;
  } else if (lab !== '') {
    q = `SELECT * FROM computer_master WHERE location = '${lab}'`;
  } else if (reportBy === 'All' && status === 'All' && lab === 'All') {
    q = `SELECT * FROM device_master WHERE verify = 'verified'`;
  }

  if (q === '') {
    q = `SELECT * FROM device_master WHERE verify = 'verified'`;
  }

  db.query(q, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.render('report', {
        title: 'Report',
        menu: 'Report',
        stock: result,
        location: [],
        filter: reportBy,
        status: status,
        lab: lab,
        reportBy: reportBy,
      });
    }
  });
};




exports.downloadReport = (req, res) => {
  const { reportBy, status, lab } = req.body;
  const q = `SELECT * FROM device_master WHERE verify = "verified"`;

  db.query(q, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      const filteredRecords = filterRecords(result, reportBy, status, lab); // Filter the records based on the selected filters

      const filename = "report.csv";
      const header = [
        { id: "serialno", title: "Serial No." },
        { id: "devicetype", title: "Device Type" },
        { id: "mac", title: "MAC" },
        { id: "ram", title: "RAM" },
        { id: "location", title: "Location" },
        { id: "status", title: "Status" },
        { id: "invoiceno", title: "Invoice No." },
        { id: "invoicedate", title: "Invoice Date" },
        { id: "specification", title: "Specification" },

      ];

      const writer = csvWriter.createObjectCsvWriter({
        path: filename,
        header,
      });

      writer.writeRecords(filteredRecords).then(() => {
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=' + filename);

        const fileStream = fs.createReadStream(filename);
        fileStream.pipe(res);

        fileStream.on('end', () => {
          fs.unlinkSync(filename); // Remove the temporary CSV file
        });
      });
    }
  });
};

// Function to filter the records based on selected filters
function filterRecords(records, reportBy, status, lab) {
  return records.map(item => {
    const filteredRecord = {
      serialno: item.serialno,
      devicetype: item.devicetype,
      location: item.location,
      status: item.status,
      invoiceno: item.invoiceno,
      invoicedate: item.invoicedate,
      specification: item.specification,

    };

    return filteredRecord;
  });
}