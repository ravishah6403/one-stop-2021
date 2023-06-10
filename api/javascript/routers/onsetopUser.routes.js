const express = require("express");
const { updateOnestopUserValidate, updateOnestopUser, logoutUserValidate, logoutUser, regenerateUserAccessToken, guestUserLogin, getUserInfo } = require("../controllers/onestopUserController");
const { requestValidation } = require("../middlewares/validate.request");
const { verifyUserRequest, restrictIfGuest } = require("../middlewares/user.auth");
const onestopUserRouter = express.Router();
const { body, matchedData } = require("express-validator");

// onestopUserRouter.get("/onestop-user",)
// onestopUserRouter.post("/onestop-user", createOnestopUser);
onestopUserRouter.post("/user/guest/login",guestUserLogin);
onestopUserRouter.post("/user/accesstoken",regenerateUserAccessToken);

onestopUserRouter.get("/user",verifyUserRequest,getUserInfo);
onestopUserRouter.patch("/user",verifyUserRequest,restrictIfGuest, updateOnestopUserValidate, requestValidation, updateOnestopUser);
onestopUserRouter.delete("/user/logout",verifyUserRequest,logoutUserValidate,requestValidation,logoutUser);

module.exports = onestopUserRouter;