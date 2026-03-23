const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {

  res.json({
    stats: {
      patients: 120,
      appointments: 45,
      revenue: 25000
    },
    chart: [
      { date: "Mon", count: 5 },
      { date: "Tue", count: 8 },
      { date: "Wed", count: 6 },
      { date: "Thu", count: 10 },
      { date: "Fri", count: 7 }
    ]
  });

});

module.exports = router;