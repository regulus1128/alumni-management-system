import axios from "axios";
import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  const fetchAllNotifications = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/notification/notifications`,
        { withCredentials: true }
      );
      setNotifications(res.data.notifications);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/notification/notifications/${id}`,
        {},
        { withCredentials: true }
      );
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error("Mark read error:", err);
    }
  };

  

  useEffect(() => {
    fetchAllNotifications();
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <h2 className="text-2xl font-semibold mb-6">YOUR NOTIFICATIONS</h2>
      {notifications.length === 0 ? (
        <p className="text-gray-500">No notifications yet.</p>
      ) : (
        <ul className="space-y-4">
          {notifications.map((n) => (
            <li
              key={n._id}
              className={`p-4 rounded-md cursor-pointer ${
                n.read ? "bg-gray-100 text-gray-500" : "bg-neutral-200 hover:bg-neutral-300"
              }`}
              onClick={async () => {
                await markAsRead(n._id);
                navigate(n.link);
              }}
            >
              <div className="text-sm">{n.message}</div>
              <div className="text-xs mt-2 text-gray-500">
                {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;
