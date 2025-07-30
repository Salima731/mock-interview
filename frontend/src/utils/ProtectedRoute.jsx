import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({children, requiredRole}) => {
    const {isAuthenticated, user} = useSelector((state) => state?.usersState?? '');

    const userRole = user?.role?? "";
    console.log("roleee",userRole);

    if(!isAuthenticated){
        return <Navigate to={"/auth"}/>
    }
    if(requiredRole && !requiredRole.includes(userRole)){
        return <Navigate to={"/auth"}/>
    }
  return children;
}

export default ProtectedRoute;