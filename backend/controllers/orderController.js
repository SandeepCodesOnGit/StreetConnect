import Order from "../models/Order.js";

const createOrder = async (req, res) => {
  const customerId = req.user.id;
  const { vendorId, items, totalAmount } = req.body;

  if (!items || items.length == 0) {
    return res
      .status(400)
      .json({ success: false, message: "No items in cart" });
  }

  const newOrder = new Order({
    vendor: vendorId,
    user: customerId,
    items: items,
    totalAmount: totalAmount,
  });
  await newOrder.save();

  res.status(201).json({
    success: true,
    message: "Order placed successfully",
    order: newOrder,
  });
};

const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user.id })
    .populate("vendor", "shopName category")
    .sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    orders: orders,
  });
};

const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "vendor",
    "shopName category location",
  );
  if (!order) {
    return res.status(403).json({ success: false, message: "Order not found" });
  }

  if (order.user.toString() !== req.user.id.toString()) {
    return res
      .status(403)
      .json({ success: false, message: "Not authorized to view this order" });
  }
  res.status(200).json({ success: true, order: order });
};

const getVendorOrders = async (req, res) => {
  const { vendorId } = req.params;
  console.log(vendorId);
  const orders = await Order.find({ vendor: vendorId })
    .populate("user", "username email")
    .sort({ createdAt: -1 });
console.log(orders)
  res.status(200).json({
    success: true,
    orders: orders,
  });
};

const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = [
    "Pending",
    "Accepted",
    "Preparing",
    "Ready",
    "Completed",
    "Cancelled",
  ];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: "Invalid status" });
  }

  const order = await Order.findByIdAndUpdate(id, { status }, { new: true }).populate("user", "username");

  if(!order) {
    return res.status(404).json({ success: false, message: "Order not found"});
  }

  res.status(200).json({
    success: true,
    message: `Order status updated to ${status}`,
    order: order
  });
};

export { createOrder, getMyOrders, getOrderById, getVendorOrders, updateOrderStatus };
