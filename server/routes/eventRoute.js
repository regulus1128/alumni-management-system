import express from "express";
import authorizeRole from "../middlewares/auth.js";
import { deleteEvent, editEvent, getAllEvents, getEventById, getEventsByUser, joinEvent, postEvent } from "../controllers/eventController.js";

const eventRouter = express.Router();

eventRouter.post("/post-event", authorizeRole(["student", "alumni"]), postEvent);
eventRouter.get("/user/:role/:id", authorizeRole(["student", "alumni"]), getEventsByUser);
eventRouter.get("/get-all-events", getAllEvents); 
eventRouter.get("/get-event/:id", getEventById); 
eventRouter.put("/edit-event/:id", authorizeRole(["student", "alumni"]), editEvent); 
eventRouter.delete("/delete-event/:id", authorizeRole(["student", "alumni"]), deleteEvent); 
eventRouter.post("/join-event/:id", authorizeRole(["student", "alumni"]), joinEvent); 

export default eventRouter;