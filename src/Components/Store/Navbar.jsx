import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import logo from "../../Assets/logoNoText.svg";
import classes from './Navbar.module.css'

const Navbar = ({ user, cart }) => {
    return (
        <nav className={classes.Navbar}>
            <div className="container">
                <Link to="/store" className={classes.brand}>
                    <img height={36} className={classes.logo} src={logo} alt="Mirum logo" />
                    <span>Mirum Store</span>
                </Link>
                <div className={classes.right}>
                    <Link to="/store/cart" className={classes.cart}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="10" cy="20.5" r="1" /><circle cx="18" cy="20.5" r="1" /><path d="M2.5 2.5h3l2.7 12.4a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.6l1.6-8.4H7.1" /></svg>
                        {cart && cart.length ? <span className={classes.cartBadge}>{cart.length > 1 ? cart.map((a) => a.count).reduce((a, b) => a + b) : cart[0].count}</span> : null}
                    </Link>
                    {user ? <div className={classes.balance}>
                        <div className={classes.label}>Ваш баланс</div>
                        <div className={classes.value}>{user.edcoin} EdCoins</div>
                    </div> : null}
                </div>
            </div>
        </nav>
    );
}

export default connect(state => state)(Navbar);