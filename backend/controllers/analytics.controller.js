import dealModel from "../models/deal.model.js";
import userModel from "../models/user.model.js";

const getDealsStatistics = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Unauthorized: Admin access required." });
    }

    const [pendingDeals, completedDeals, InProgress,Cancelled] = await Promise.all([
      dealModel.countDocuments({ status: "Pending" }),
      dealModel.countDocuments({ status: "Completed" }),
      dealModel.countDocuments({ status: "In Progress"}),
      dealModel.countDocuments({ status: "Cancelled"})
    ]);

    res.status(200).json({ success: true, data: { pendingDeals, completedDeals, InProgress, Cancelled } });
  } catch (error) {
    console.error("Error fetching deal statistics:", error);
    res.status(500).json({ success: false, message: "Failed to retrieve deal statistics. Please try again later." });
  }
};

const getUserEngagement = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Unauthorized: Admin access required." });
    }

    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const activeUsers = await userModel.countDocuments({ updatedAt: { $gte: oneWeekAgo } });

    res.status(200).json({ success: true, data: { activeUsers } });
  } catch (error) {
    console.error("Error fetching user engagement data:", error);
    res.status(500).json({ success: false, message: "Failed to retrieve user engagement data. Please try again later." });
  }
};

export { getDealsStatistics, getUserEngagement };