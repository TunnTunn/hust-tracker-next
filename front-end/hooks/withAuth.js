import { useEffect } from "react";
import { useRouter } from "next/navigation";

const withAuth = (WrappedComponent) => {
    return (props) => {
        const router = useRouter();
        useEffect(() => {
            const token = localStorage.getItem("token");
            if (!token) {
                router.push("/auth/login"); // Redirect to login if not authenticated
            }
        }, [router]);

        return <WrappedComponent {...props} />;
    };
};

export default withAuth;
