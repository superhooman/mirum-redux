import React, { useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Button from '../Button';
import classes from './Item.module.css';
import { addToCart } from "../../Redux/actions"
import { useHistory } from 'react-router-dom';
import clsx from 'clsx';

const BagIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2V6l-3-4H6zM3.8 6h16.4M16 10a4 4 0 1 1-8 0" /></svg>

const getImages = (item) => {
    const result = [item.image];

    if (item.image2) {
        result.push(item.image2)
    }

    if (item.image3) {
        result.push(item.image3)
    }

    if (item.image4) {
        result.push(item.image4)
    }

    return result;
}

const Item = ({ item, addToCart, cart }) => {
    const history = useHistory();
    const inCart = !!cart.filter(el => el.id === item.id)[0];
    const images = getImages(item)
    return (
        <div className={classes.Item}>
            {images.length > 1 ? <Slider images={images} /> : (<div style={{
                backgroundImage: `url(${item.image})`
            }} className={classes.image} />)}
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

const Slider = ({ images }) => {
    const [slide, setSlide] = useState(0);
    let xDown = null;
    const handleTouchStart = (evt) => {
        const firstTouch = evt.touches[0];
        xDown = firstTouch.clientX;
    };
    const handleTouchMove = (evt) => {
        if (!xDown) {
            return;
        }
        const xUp = evt.touches[0].clientX;
        const xDiff = xDown - xUp;
        if (xDiff > 5) {
            if (slide < images.length - 1) {
                setSlide(slide + 1);
            }
        } else if (xDiff < -5) {
            if (slide > 0) {
                setSlide(slide - 1);
            }
        }
        xDown = null;
    }
    return (
        <div onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} className={classes.sliderWrap}>
            <button disabled={slide === 0} onClick={() => setSlide(slide - 1)} className={classes.prev}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
            </button>
            <div style={{
                width: images.length * 100 + "%",
                transform: `translateX(-${slide * (100 / images.length)}%)`
            }} className={classes.slider}>
                {images.map(image => (
                    <div style={{
                        backgroundImage: `url(${image})`
                    }} className={classes.image} />
                ))}
            </div>
            <button disabled={slide === images.length - 1} onClick={() => setSlide(slide + 1)} className={classes.next}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
            </button>
            <div className={classes.dots}>
                {images.map((el, i) => (
                    <div onClick={() => setSlide(i)} className={clsx(classes.dot, {
                        [classes.active]: i === slide
                    })} />
                ))}
            </div>
        </div>
    )
}

const mapDispatchToProps = (dispatch) => ({
    addToCart: bindActionCreators(addToCart, dispatch)
})

export default connect(state => state, mapDispatchToProps)(Item);