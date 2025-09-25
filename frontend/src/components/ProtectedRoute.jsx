import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const ProtectedRoute = ({
    element,
    allowedUserTypes,
    authenticationStatus,
    userType
}) => {
    if (!authenticationStatus) {
        return <Navigate to="/" state={{ from: window.location.pathname }} />;
    }

    if (!allowedUserTypes.includes(userType)) {
        return <Navigate to="/" />;
    }

    return element;
};

ProtectedRoute.propTypes = {
    element: PropTypes.element.isRequired,
    allowedUserTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
    authenticationStatus: PropTypes.bool.isRequired,
    userType: PropTypes.string,
};

export default ProtectedRoute;