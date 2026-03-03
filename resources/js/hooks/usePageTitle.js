import { useEffect } from "react";
import { useParams } from "react-router-dom";

function usePageTitle(title, param = "") {
    const { id } = useParams();
    
    useEffect(() => {
        const fullTitle = param
            ? `${title} - ${param} | Admin Panel`
            : `${title} | Admin Panel`;

        document.title = fullTitle;
    }, [title, param]);
}

export default usePageTitle;