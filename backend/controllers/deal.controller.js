import dealModel from "../models/deal.model.js";

const createDeal = async (req, res) => {
  try {
    const { sellerId, title, description, price } = req.body;

    if (req.user.role !== 'buyer') {
      return res.status(403).json({ message: 'Only buyers can create deals' });
    }

    const newDeal = await dealModel.create({
      buyer: req.user.id,
      seller: sellerId,
      title,
      description,
      price
    });

    res.status(201).json({ success: true, newDeal });
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: 'Failed to create deal', error });
  }
};

const getDeals = async (req, res) => {
  try {
    let deals;
    if (req.user.role === 'buyer') {
      deals = await dealModel.find({ buyer: req.user.id }).populate('seller', 'name email');
    } else {
      deals = await dealModel.find({ seller: req.user.id }).populate('buyer', 'name email');
    }

    res.status(200).json({ success: true, deals });
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: 'Error fetching deals', error });
  }
};

const updateDeal = async (req, res) => {
  try {
    const { dealId, status } = req.body;

    if (req.user.role !== 'seller') {
      return res.status(403).json({ message: 'Only sellers can update deal status' });
    }

    const deal = await dealModel.findById(dealId);
    if (!deal) return res.status(404).json({ success: false, message: 'Deal not found' });

    if (deal.seller.toString() !== req.user.id) {
      return res.status(403).json({ message: 'unauthorized access of assests' });
    }

    deal.status = status;
    await deal.save();

    res.status(200).json({ success: true, message: 'Deal status updated successfully', deal });
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: 'Failed to update deal status', error });
  }
};

export { createDeal, getDeals, updateDeal };
