import { Protect } from "../middlware/user.middleware.js";

import {createNotes , getNotes , updateNotes , deleteNotes } from "../controllers/notes.controllers.js";

import { Router } from "express";

const router = Router();

router.route("/create").post(Protect , createNotes);
router.route("/getNotes").get(Protect , getNotes);
router.route("/update").post(Protect , updateNotes);
router.route("/delete").delete(Protect , deleteNotes );


export default router;