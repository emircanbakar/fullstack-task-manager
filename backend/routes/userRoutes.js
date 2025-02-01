const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Auth = require("../models/Auth");

const router = express.Router()
const JWT_SECRET = process.env.JWT_SEC


router.post