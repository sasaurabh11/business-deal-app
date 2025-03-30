import dealModel from '../models/deal.model.js';

const createDeal = async (req, res) => {
  try {
    const { title, description, price } = req.body;
    console.log(req.user.role);
    if (req.user.role !== 'seller') {
      return res.status(403).json({ success: false, message: 'Access denied. Only buyers can initiate deals.' });
    }

    const deal = new dealModel({
      seller: req.user.id,
      title,
      description,
      price,
    });

    await deal.save();

    res.status(201).json({ success: true, message: 'Deal created successfully!', deal });
  } catch (error) {
    console.error('Deal Creation Error:', error);
    res.status(500).json({ success: false, message: 'Server error. Unable to create deal.', error });
  }
};

const getDeals = async (req, res) => {
  try {
    const filter = req.user.role === 'buyer' ? { buyer: req.user.id } : { seller: req.user.id };
    const deals = await dealModel.find(filter).populate(req.user.role === 'buyer' ? 'seller' : 'buyer', 'name email');
    
    res.status(200).json({ success: true, message: 'Deals retrieved successfully!', deals });
  } catch (error) {
    console.error('Fetch Deals Error:', error);
    res.status(500).json({ success: false, message: 'Error retrieving deals. Please try again later.', error });
  }
};

const updateDeal = async (req, res) => {
  try {
    const { dealId, status } = req.body;

    if (req.user.role !== 'seller') {
      return res.status(403).json({ success: false, message: 'Unauthorized. Only sellers can update deal status.' });
    }

    const deal = await dealModel.findById(dealId);
    if (!deal) {
      return res.status(404).json({ success: false, message: 'No deal found with the given ID.' });
    }

    if (deal.seller.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Access denied. You cannot modify this deal.' });
    }

    deal.status = status;
    await deal.save();

    res.status(200).json({ success: true, message: 'Deal status successfully updated!', deal });
  } catch (error) {
    console.error('Update Deal Error:', error);
    res.status(500).json({ success: false, message: 'Could not update deal. Please try again later.', error });
  }
};

export { createDeal, getDeals, updateDeal };