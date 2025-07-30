import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const useToasterAndNavigate = () => {

    const navigate = useNavigate();

    const showToasterAndNavigate = (success, message, path) => {
        console.log("succc,mess", success);
        console.log("messs", message);
        
        
        if(!success){
           return toast.error(message);
        }else{
            toast.success(message);
            if(path){
                navigate(path);
            }
        }
    }

    return showToasterAndNavigate;
}

export default useToasterAndNavigate;