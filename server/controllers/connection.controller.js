import Alumni from "../models/alumni.model.js";
import Connection from "../models/connection.model.js";
import Notification from "../models/notification.model.js";
import Student from "../models/student.model.js";


export const sendConnectionRequest = async (req, res) => {
  try {
    const { alumniId, studentId, connectedById } = req.body;

    if (!alumniId || (!studentId && !connectedById)) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const existingRequest = await Connection.findOne({
      alumniId,
      studentId: studentId || undefined,
      connectedById: connectedById || undefined,
      status: { $in: ['pending', 'accepted'] },
    });

    if (existingRequest) {
      return res.status(409).json({ success: false, message: "Request already sent or accepted" });
    }

    const newConnection = await Connection.create({
      alumniId,
      studentId: studentId || null,
      connectedById: connectedById || null,
      status: 'pending',
    });

    if (connectedById) {
      await Alumni.findByIdAndUpdate(connectedById, {
        $push: { sentConnections: newConnection._id }
      });
    } else if (studentId) {
      await Student.findByIdAndUpdate(studentId, {
        $push: { connections: newConnection._id } // student uses 'connections' field
      });
    }

    // Push to alumni's receivedConnections
    await Alumni.findByIdAndUpdate(alumniId, {
      $push: { receivedConnections: newConnection._id }
    });

    let senderName = "";
if (connectedById) {
  const sender = await Alumni.findById(connectedById).select("name");
  senderName = sender?.name;
} else if (studentId) {
  const sender = await Student.findById(studentId).select("name");
  senderName = sender?.name;
}

await Notification.create({
  recipient: alumniId,
  recipientModel: "alumni",
  type: "connection-request",
  message: `${senderName} sent you a connection request.`,
  link: `/profile/profile-connections`, // Adjust the link as needed
});

    res.status(201).json({ success: true, connection: newConnection });
  } catch (error) {
    console.error("Connection request error:", error);
    res.status(500).json({ success: false, message: "Failed to send connection request" });
  }
};

export const respondToConnection = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const updated = await Connection.findByIdAndUpdate(id, { status }, { new: true })
      .populate("alumniId", "name")
      .populate("studentId", "name")
      .populate("connectedById", "name");

    if (!updated) {
      return res.status(404).json({ success: false, message: "Connection not found" });
    }

    // Log data for debug
    console.log("Updated Connection:", updated);

    

    res.status(200).json({ success: true, message: `Connection ${status}`, connection: updated });
  } catch (error) {
    console.error("Connection response error:", error);
    res.status(500).json({ success: false, message: "Failed to update connection status" });
  }
};



  // GET /api/connection/alumni/:id?status=pending
  export const getConnectionsByAlumni = async (req, res) => {
    try {
      const { id } = req.params;
  
      const connections = await Connection.find({
        alumniId: id,
        status: 'pending',
      })
      .populate('studentId', 'name dept pursuing avatar batch')
      .populate('connectedById', 'name jobRole company avatar');
  
      res.status(200).json({ success: true, connections });
    } catch (error) {
      console.error("Fetch connections error:", error);
      res.status(500).json({ success: false, message: "Failed to fetch connections" });
    }
  };
  


  export const getSentConnections = async (req, res) => {
    try {
      const { id, role } = req.params;
  
      let connections;
  
      if (role === 'student') {
        connections = await Connection.find({
          studentId: id,
          status: { $in: ['pending', 'accepted'] },
        }).populate('alumniId', 'name jobRole company avatar');
      } else if (role === 'alumni') {
        connections = await Connection.find({
          connectedById: id,
          status: { $in: ['pending', 'accepted'] },
        }).populate('alumniId', 'name jobRole company avatar');
      } else {
        return res.status(400).json({ success: false, message: "Invalid role provided" });
      }
  
      const sentAlumniIds = connections.map(c => c.alumniId.toString());
  
      res.status(200).json({ success: true, connections, sentAlumniIds });
    } catch (error) {
      console.error("Fetch sent connections error:", error);
      res.status(500).json({ success: false, message: "Failed to fetch sent connections" });
    }
  };
  

  export const updateConnectionStatus = async (req, res) => {
    try {
      const { connectionId } = req.params;
      const { status } = req.body;
  
      if (!["accepted", "rejected"].includes(status.toLowerCase())) {
        return res.status(400).json({ success: false, message: "Invalid status value." });
      }
  
      const updatedConnection = await Connection.findByIdAndUpdate(
        connectionId,
        { status: status.toLowerCase() },
        { new: true }
      )
        .populate('studentId')
        .populate('connectedById')
        .populate('alumniId');
  
      // 🛑 Prevent null errors
      if (!updatedConnection) {
        return res.status(404).json({ success: false, message: "Connection not found." });
      }
  
      if (status.toLowerCase() === "accepted") {
        const recipientId = updatedConnection.studentId?._id || updatedConnection.connectedById?._id;
        const recipientModel = updatedConnection.studentId ? "student" : "alumni";
        const senderName = updatedConnection.alumniId?.name;
  
        if (recipientId && senderName) {
          const notif = await Notification.create({
            recipient: recipientId,
            recipientModel,
            type: "connection-accepted",
            message: `${senderName} accepted your connection request.`,
            link: `/profile/profile-connections`,
          });
  
          // console.log("✅ Notification created:", notif);
        } else {
          console.warn("⚠️ Missing recipientId or senderName, skipping notification.");
        }
      }
  
      return res.status(200).json({
        success: true,
        message: `Connection ${status}`,
        connection: updatedConnection,
      });
    } catch (error) {
      console.error("❌ Update connection status error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to update connection status.",
      });
    }
  };
  ;
  

  export const getAcceptedConnectionsByAlumni = async (req, res) => {
    try {
      const { id } = req.params;
  
      const acceptedConnections = await Connection.find({
        alumniId: id,
        status: 'accepted',
      })
      .populate('studentId', 'name dept pursuing avatar batch')
      .populate('connectedById', 'name jobRole company avatar');
  
      res.status(200).json({ success: true, connections: acceptedConnections });
    } catch (error) {
      console.error("Error fetching accepted connections:", error);
      res.status(500).json({ success: false, message: "Failed to fetch accepted connections" });
    }
  };
  


  
  