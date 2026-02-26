import { Protect } from "../middlware/user.middleware.js";
import {
  RigisterUser,
  LoginUser,
  LogoutUser,
  changeCurrentPassword,
  getuserData,
  updateUserInfo,
  
} from "../controllers/user.controllers.js";
import { Router } from "express";

const router = Router();

router.route("/rigister").post(RigisterUser);
router.route("/login").post(LoginUser);
router.route("/logout").post(Protect, LogoutUser);
router.route("/changepassword").post(Protect, changeCurrentPassword);
router.route("/userdata").get(Protect, getuserData);
router.route("/update").patch(Protect, updateUserInfo);
// router.route("/notescount").get(NotesCount);

// router.route("/:username").get(Protect , getUserChannelProfile);
export default router;
