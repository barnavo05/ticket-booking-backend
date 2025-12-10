const express = require("express");
const router = express.Router();
const { createShow, getShows } = require("../controllers/admin.controller");

router.post("/show", createShow);
router.get("/shows", getShows);

module.exports = router;
