import React, { useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Navbar from '../../Components/Store/Navbar';
import Empty from '../../Components/Empty';
import Modal from '../../Components/Modal';
import Input from '../../Components/Input';
import { clearCart, login, removeFromCart } from '../../Redux/actions';
import classes from './Cart.module.css'
import Button from '../../Components/Button';
import Axios from 'axios';
import { server } from '../../config';
import { useToasts } from 'react-toast-notifications';
import { Link } from 'react-router-dom';

const Cart = ({ removeFromCart, cart, user, token, clearCart, login }) => {
    const { addToast } = useToasts()
    const [done, setDone] = useState(false)
    const [state, setState] = useState({
        name: "",
        city: "",
        street: "",
        block: "",
        apt: "",
        tel: "",
        telRezerv: ""
    })
    const [modal, setModal] = useState(false)
    const handleChange = (field) => (e) => {
        setState({
            ...state,
            [field]: e.target.value
        })
    }
    const buy = e => {
        e.preventDefault();
        if (!state.name || !state.city || !state.street || !state.block || !state.apt || !state.tel || !state.telRezerv) {
            return addToast("Заполните все поля", {
                appearance: "error"
            })
        }
        setModal(true);
    }
    const send = () => {
        setModal(false);
        Axios({
            url: server + `api/v1/create_shop_order/`,
            method: "POST",
            headers: {
                Authorization: `Token ${token}`,
            },
            data: cart.map((el) => [el.id, el.count, `${state.city}, ${state.street} ${state.block}, кв ${state.apt}`, `${state.tel}`, `${state.name}`, `${state.telRezerv}`])
        }).then((res) => {
            if (res.data) {
                Axios({
                    url: server + `api/v1/user_info/`,
                    headers: {
                        Authorization: `Token ${token}`
                    }
                }).then((res) => {
                    if (res.data) {
                        login(res.data, token)
                    }
                })
                setDone(true);
                clearCart();
            }
        })
    }
    const total = cart.length ? (cart.length > 1 ? cart.map((a) => a.count * a.price).reduce((a, b) => a + b) : cart[0].price * cart[0].count) : 0
    return (
        <div className={classes.Cart}>
            <Navbar />
            <div className="container">
                {done ? null : <h1>Корзина</h1>}
                {done ? (
                    <>
                        <h1>Благодарим за покупку!</h1>
                        <p>Мы свяжемся с Вами по указанным номерам для уточнения данных по Вашему заказу!</p>
                        <Link to="/store">
                            <Button style={{
                                width: "fit-content"
                            }} icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2V6l-3-4H6zM3.8 6h16.4M16 10a4 4 0 1 1-8 0" /></svg>}>В магазин</Button>
                        </Link>
                    </>
                ) : (cart.length ? (
                    <>
                        <div className={classes.items}>
                            {cart.map((el, i) => (
                                <div key={el.id} className={classes.item}>
                                    <div style={{
                                        backgroundImage: `url(${el.image})`
                                    }} className={classes.itemPhoto} />
                                    <div className={classes.itemInfo}>
                                        <div className={classes.itemMain}>
                                            <div className={classes.itemName}>
                                                <b>{el.item}</b>
                                                {el.count > 1 ? (<span>✕ {el.count}</span>) : null}
                                            </div>
                                            <div className={classes.itemTotal}>{el.price * el.count} EdCoins</div>
                                        </div>
                                        <Button onClick={() => removeFromCart(i)} type="outline" style={{
                                            marginTop: 16,
                                            width: "fit-content"
                                        }} icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>} size="small">Убрать</Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className={classes.total}>
                            <b>Итого</b>
                            <span>{total} EdCoins</span>
                        </div>
                        <div className={classes.buy}>
                            {user ? (total > user.edcoin ? (
                                <div className={classes.alert}>
                                    У Вас недостаточно EdCoin’ов для данной покупки
                                </div>
                            ) : (
                                    <>
                                        <div className={classes.alert}>ВНИМАНИЕ! Если Вам нет 18 лет, просим ввести данные Вашего родителя или ответственного совершеннолетнего лица.</div>
                                        <form onSubmit={buy}>
                                            <div className={classes.field}>
                                                <Input value={state.name} placeholder="ФИО" onChange={handleChange("name")} />
                                            </div>
                                            <div className={classes.field}>
                                                <Input value={state.city} placeholder="Город" onChange={handleChange("city")} />
                                            </div>
                                            <div className={classes.doubleField}>
                                                <Input value={state.street} placeholder="Улица" onChange={handleChange("street")} />
                                                <Input value={state.block} placeholder="Дом" onChange={handleChange("block")} />
                                                <Input value={state.apt} placeholder="Квартира" onChange={handleChange("apt")} />
                                            </div>
                                            <div className={classes.field}>
                                                <Input value={state.tel} mask="+7 (999) 999-99-99" placeholder="Телефон" onChange={handleChange("tel")} />
                                            </div>
                                            <div className={classes.field}>
                                                <Input value={state.telRezerv} mask="+7 (999) 999-99-99" placeholder="Резервный телефон" onChange={handleChange("telRezerv")} />
                                            </div>
                                            <Button icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="10" cy="20.5" r="1" /><circle cx="18" cy="20.5" r="1" /><path d="M2.5 2.5h3l2.7 12.4a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.6l1.6-8.4H7.1" /></svg>} style={{
                                                width: "fit-content",
                                                marginLeft: "auto",
                                                paddingLeft: 16,
                                                paddingRight: 16,
                                            }}>Купить</Button>
                                        </form>

                                    </>
                                )) : (
                                    <>
                                        <p>Вы должны войти в аккаунт, чтобы совершить заказ</p>
                                        <Link style={{
                                            width: "fit-content"
                                        }} to="/login">
                                            <Button style={{
                                                width: "fit-content"
                                            }}>Войти в аккаунт</Button>
                                        </Link>
                                    </>
                                )}
                        </div>
                    </>
                ) : <Empty height={320} />)}
                <div className={classes.notice}>
                    <p>Все заказы по Mirum Store будут обрабатываются с 1 по 10 число каждого месяца. Например: Если Вы сделали заказ в период с 10 по 30 (31) число определенного месяца, он будет принят и обработан, но оформление и отправка заказа будет осуществляться с 1 по 10 число следующего месяца.</p>
                    <p>Внешние и внутренние характеристики выбранного товара могут не соответствовать с товаром, имеющимся на данный момент в наличии. Все выявленные нюансы будут обговорены с заказчиком. Например: Если Вы выбрали телефон Xiaomi Redmi 9С черного цвета, но в наличии останутся лишь белые, то мы Вам об этом сообщим. Если Вас устроит, мы отправим товар. В противном случае - вернем эдкоины. Если функциональные характеристики имеющегося товара ниже, чем у выбранного, с Вашего согласия мы отправим имеющийся товар и возместим определенную сумму эдкоинов.</p>
                    <p>Цены и каталог товаров могут обновляться по решению Администрации платформы Mirum. Но заказанные Вами товары будут оформленны и выданы по ценам и состоянию на момент обработки заказа.</p>
                    <p>Заказать товар с доплатой собственных денег запрещено. Но Вы можете обменять тенге на эдкоины по курсу 4 тенге = 1 эдкоин. Обмен эдкоинов на деньги проходит по курсу 1 эдкоин = 1 тенге.</p>
                    <p>Все дополнительные вопросы Вы можете задать, позвонив по номерам: +7 707 801 91 19, +7 775 467 61 53.</p>
                </div>
                <Modal open={modal} onClick={() => setModal(false)}>
                    <p>Вы уверены, что хотите оформить данный заказ?</p>
                    <div className={classes.buttons}>
                        <Button onClick={send}>Да</Button>
                        <Button type="outline" onClick={() => setModal(false)}>Нет</Button>
                    </div>
                </Modal>
            </div>
        </div>
    );
}

const mapDispatchToProps = dispatch => ({
    removeFromCart: bindActionCreators(removeFromCart, dispatch),
    clearCart: bindActionCreators(clearCart, dispatch),
    login: bindActionCreators(login, dispatch)
})

export default connect(state => state, mapDispatchToProps)(Cart);