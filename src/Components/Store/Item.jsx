import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Button from '../Button';
import classes from './Item.module.css';
import { addToCart } from "../../Redux/actions"
import { useHistory } from 'react-router-dom';

const BagIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2V6l-3-4H6zM3.8 6h16.4M16 10a4 4 0 1 1-8 0" /></svg>

const Item = ({ item, addToCart, cart }) => {
    const history = useHistory()
    const inCart = !!cart.filter(el => el.id === item.id)[0]
    return (
        <div className={classes.Item}>
            <div style={{
                backgroundImage: `url(${item.image})`
            }} className={classes.image} />
            <div className={classes.price}><b>{item.price}</b><span>EdCoins</span></div>
            <div className={classes.title}>{item.item}</div>
            <div className={classes.description}>{item.description}</div>
            <div className={classes.buttons}>
                {inCart ? <Button type="outline" onClick={() => history.push("/store/cart")} style={{
                    width: "fit-content"
                }} icon={<BagIcon />} size="small">
                    Перейти в корзину
                </Button> : <Button onClick={() => addToCart(item)} style={{
                        width: "fit-content"
                    }} icon={<BagIcon />} size="small">
                        Добавить в корзину
                </Button>}
                {inCart ? <Button onClick={() => addToCart(item)} style={{
                    width: "fit-content"
                }} size="small">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                </Button> : null}
            </div>
        </div>
    );
}

const mapDispatchToProps = (dispatch) => ({
    addToCart: bindActionCreators(addToCart, dispatch)
})

export default connect(state => state, mapDispatchToProps)(Item);