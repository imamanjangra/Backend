import { Protect } from "../middlware/user.middleware.js";
import {createFolder , getFolder, updateFolder , deleteFolder} from "../controllers/folder.controllers.js"

import { Router } from "express";

const router = Router();

router.route("/createFolder").post(Protect , createFolder)
router.route("/getFolder").get(Protect , getFolder)
router.route("/updateFolder").patch(Protect , updateFolder);
router.route("/deleteFolder").delete(Protect , deleteFolder)

export default router