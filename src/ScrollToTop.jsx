const { useEffect } = require("react");
const { useLocation } = require("react-router-dom")

const ScrollToTop = ({ children }) => {
    const location = useLocation();
    useEffect(() => {
        if (!location.hash) {
            window.scrollTo(0, 0)
        }

    }, [location])
    return children
}

export default ScrollToTop