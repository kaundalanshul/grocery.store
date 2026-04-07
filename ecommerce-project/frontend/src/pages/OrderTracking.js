import React from 'react';
import { Link } from 'react-router-dom';

const OrderTracking = () => {
	return (
		<div className="auth-page">
			<div className="auth-card">
				<h1>My Orders</h1>
				<p className="auth-subtitle">Track your latest order status from here.</p>

				<div className="auth-form">
					<label>Order ID</label>
					<input type="text" value="ORD-102938" readOnly />

					<label>Current Status</label>
					<input type="text" value="Out for delivery" readOnly />

					<label>Estimated Delivery</label>
					<input type="text" value="Today, 7:00 PM - 9:00 PM" readOnly />
				</div>

				<Link className="auth-back-link" to="/">
					Back to home
				</Link>
			</div>
		</div>
	);
};

export default OrderTracking;