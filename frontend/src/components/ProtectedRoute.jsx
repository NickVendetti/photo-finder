import { Navigate } from 'react-router-dom';

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

export default ProtectedRoute;