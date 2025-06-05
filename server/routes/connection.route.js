import express from "express";
import authorizeRole from "../middlewares/auth.js";
import { getAcceptedConnectionsByAlumni, getConnectionsByAlumni, getSentConnections, respondToConnection, sendConnectionRequest, updateConnectionStatus } from "../controllers/connection.controller.js";

const connectionRouter = express.Router();

connectionRouter.post("/request", authorizeRole(["student", "alumni"]), sendConnectionRequest);
// connectionRouter.put("/respond/:id", authorizeRole(["student", "alumni"]), respondToConnection);
connectionRouter.put("/status/:connectionId", authorizeRole(["student", "alumni"]), updateConnectionStatus);
connectionRouter.get("/connection/:id", authorizeRole(["student", "alumni"]), getConnectionsByAlumni); // received connections
connectionRouter.get("/connection/:role/:id", authorizeRole(["student", "alumni"]), getSentConnections); // sent connections
connectionRouter.get("/accepted-connections/:id", authorizeRole(["student", "alumni"]), getAcceptedConnectionsByAlumni);


export default connectionRouter;