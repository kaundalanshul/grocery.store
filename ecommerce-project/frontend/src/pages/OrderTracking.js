import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { NavigationBar } from '../components/Home/NavigationBar';
import '../styles/home.css';
import '../App.css';
import '../styles/orderTracking.css';

const OrderTracking = ({ theme, onToggleTheme }) => {
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const { addToCart } = useCart();
	const [expandedOrder, setExpandedOrder] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		fetchMyOrders();
	}, []);

	const getOrderItemId = (item) => {
		if (item?.product && typeof item.product === 'object') {
			return item.product._id || item.product.id || item.product;
		}
		return item?.product || item?._id || item?.id;
	};

	const fetchMyOrders = async () => {
		try {
			setLoading(true);
			const token = localStorage.getItem('authToken');
			
			if (!token) {
				setError('Please log in to view your orders');
				setLoading(false);
				return;
			}

			const response = await fetch('/api/orders/my', {
				method: 'GET',
				headers: {
					'Authorization': `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || 'Failed to fetch orders');
			}

			const data = await response.json();
			setOrders(data.orders || []);
		} catch (err) {
			setError(err.message);
			console.error('Error fetching orders:', err);
		} finally {
			setLoading(false);
		}
	};

	const handleBuyAgain = (order) => {
		// Add all items from the order to cart
		order.items.forEach(item => {
			addToCart({
				_id: getOrderItemId(item),
				name: item.name,
				image: item.image,
				price: item.price,
				quantity: item.quantity,
			});
		});
		alert(`${order.items.length} item(s) added to your cart!`);
	};

	const handleBuyNow = (order) => {
		// Add all items from the order to cart
		order.items.forEach(item => {
			addToCart({
				_id: getOrderItemId(item),
				name: item.name,
				image: item.image,
				price: item.price,
				quantity: item.quantity,
			});
		});
		// Immediately redirect to checkout
		navigate('/checkout');
	};

	const handleCancelOrder = async (orderId) => {
		const reason = window.prompt('Enter cancellation reason (optional):', 'Customer requested cancellation') || 'Customer requested cancellation';
		try {
			const token = localStorage.getItem('authToken');
			const response = await fetch(`/api/orders/${orderId}/cancel`, {
				method: 'PUT',
				headers: {
					'Authorization': `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ reason }),
			});

			const data = await response.json();
			if (!response.ok || !data.success) {
				throw new Error(data.message || 'Failed to cancel order');
			}

			setOrders((prev) => prev.map((order) => (order._id === orderId ? data.order : order)));
			setExpandedOrder(null);
		} catch (cancelError) {
			alert(cancelError.message || 'Unable to cancel order right now.');
		}
	};

	const getStatusColor = (status) => {
		const statusMap = {
			placed: '#FFA500',
			confirmed: '#4169E1',
			shipped: '#87CEEB',
			out_for_delivery: '#32CD32',
			delivered: '#228B22',
			cancelled: '#FF6347',
		};
		return statusMap[status] || '#666';
	};

	const isCancellable = (status) => !['delivered', 'cancelled'].includes(status);

	if (loading) {
		return (
			<div className="page-wrapper">
				<NavigationBar theme={theme} onToggleTheme={onToggleTheme} />
				<div className="order-tracking-page">
					<div className="orders-container">
						<h1>📦 My Orders</h1>
						<div className="ot-loading"><div className="spinner"></div><p>Loading your orders…</p></div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="page-wrapper">
			<NavigationBar theme={theme} onToggleTheme={onToggleTheme} />
		<div className="order-tracking-page">
			<div className="orders-container">
				<h1>📦 My Orders</h1>
				<p className="orders-subtitle">View and manage your orders</p>

				{error && <div className="error-message">{error}</div>}

				{orders.length === 0 ? (
					<div className="no-orders">
						<p>You have no orders yet.</p>
						<Link to="/products" className="shop-now-btn">
							Start Shopping
						</Link>
					</div>
				) : (
					<div className="orders-list">
						{orders.map(order => (
							<div key={order._id} className="order-card">
								<div className="order-header" onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}>
									<div className="order-info">
										<div className="order-id">Order #{order._id.slice(-8).toUpperCase()}</div>
										<div className="order-date">
											{new Date(order.createdAt).toLocaleDateString('en-US', {
												year: 'numeric',
												month: 'short',
												day: 'numeric',
											})}
										</div>
									</div>
									<div className="order-status" style={{ backgroundColor: getStatusColor(order.orderStatus) }}>
										{order.orderStatus.replace(/_/g, ' ').toUpperCase()}
									</div>
									<div className="order-amount">₹{order.totalAmount.toFixed(2)}</div>
								</div>

								{expandedOrder === order._id && (
									<div className="order-details">
										<div className="order-items">
											<h4>Items Ordered:</h4>
											<div className="items-list">
												{order.items.map((item, idx) => (
													<div key={idx} className="order-item">
														<div className="item-image">
															{item.image && <img src={item.image} alt={item.name} />}
														</div>
														<div className="item-details">
															<h5>{item.name}</h5>
															<p>₹{item.price.toFixed(2)} × {item.quantity}</p>
														</div>
														<div className="item-subtotal">
															₹{(item.price * item.quantity).toFixed(2)}
														</div>
													</div>
												))}
											</div>
										</div>

										<div className="shipping-info">
											<h4>Shipping Address:</h4>
											<p>
												{order.shippingAddress?.name}
												<br />
												{order.shippingAddress?.address}
												<br />
												{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}
												<br />
												{order.shippingAddress?.country}
											</p>
										</div>

										{order.trackingNumber && (
											<div className="tracking-info">
												<h4>Tracking Number:</h4>
												<p>{order.trackingNumber}</p>
											</div>
										)}

										<div className="order-footer-actions">
											<button
												className="buy-now-btn"
												onClick={() => handleBuyNow(order)}
											>
												⚡ Buy Now
											</button>
											<button
												className="buy-again-btn"
												onClick={() => handleBuyAgain(order)}
											>
												🛒 Buy Again
											</button>
											{isCancellable(order.orderStatus) && (
												<button
													className="cancel-order-btn"
													onClick={() => handleCancelOrder(order._id)}
												>
													✖ Cancel Order
												</button>
											)}
											<Link
												to={`/payment?orderId=${order._id}`}
												className="view-invoice-btn"
											>
												📄 View Invoice
											</Link>
										</div>
									</div>
								)}
							</div>
						))}
					</div>
				)}

				<Link className="auth-back-link" to="/">
					Back to home
				</Link>
			</div>
		</div>
		</div>
	);
};

export default OrderTracking;
