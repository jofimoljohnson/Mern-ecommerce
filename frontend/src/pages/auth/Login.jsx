import { useState } from "react";
import { Link } from "react-router-dom";
import CommonForm from "@/components/common/CommonForm";
import { loginFormControls } from "@/config";
import { useDispatch } from "react-redux";
import { login } from "@/store/authSlice";
import { toast } from "sonner";

const initialState = {
    email: "",
    password: "",
};
const Login = () => {
    const [formData, setFormData] = useState(initialState);
    const dispatch = useDispatch();

    const onSubmit = (event) => {
        event.preventDefault();
        dispatch(login(formData)).then((data) => {
            if (data?.payload?.success) {
                toast.success("Login successful");
            } else {
                toast.error(data?.payload?.message || "Login Failed.");
            }

            console.log(data);
        });
    };

    return (
        <>
            <div className="mx-auto w-full max-w-md space-y-6">
                <div className="text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Sign In Your Account</h1>
                    <p>
                        Dont have an account
                        <Link className="font-medium ml-2 text-primary hover:underline" to="/auth/register">
                            Register
                        </Link>
                    </p>
                </div>
                <CommonForm
                    formControls={loginFormControls}
                    buttonText={"Sign In"}
                    formData={formData}
                    setFormData={setFormData}
                    onSubmit={onSubmit}
                />

                <div>
                    <p>User email:jofi@gmail.com</p>
                    <p>User password:secret123</p>
                    <p>Admin email:john@gmail.com</p>
                    <p>Admin password:secret123</p>
                    <p>Paypal payment email:</p>
                    <p>sb-buot850317992@personal.example.com</p>
                    <p>Paypal payment password: {"<O9w%e@l"}</p>
                </div>
            </div>
        </>
    );
};

export default Login;
