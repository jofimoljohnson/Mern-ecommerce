import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CommonForm from "@/components/common/CommonForm";
import { registerFormControls } from "@/config";
import { useDispatch } from "react-redux";
import { register } from "@/store/authSlice";
import { toast } from "sonner";

const initialState = {
    username: "",
    email: "",
    password: "",
};

const Register = () => {
    const [formData, setFormData] = useState(initialState);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onSubmit = (event) => {
        event.preventDefault();
        dispatch(register(formData)).then((data) => {
            if (data?.payload?.success) {
                toast.success("Registration successful");
                setTimeout(() => {
                    navigate("/auth/login");
                }, 1000);
            } else {
                toast.error(data?.payload?.message || "User already exists with the same email. Please try again.");
            }

            console.log(data);
        });
    };

    return (
        <div className="mx-auto w-full max-w-md space-y-6">
            <div className="text-center">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Create new account</h1>
                <p>
                    Already have an account
                    <Link className="font-medium ml-2 text-primary hover:underline" to="/auth/login">
                        Login
                    </Link>
                </p>
            </div>
            <CommonForm
                formControls={registerFormControls}
                buttonText={"Sign Up"}
                formData={formData}
                setFormData={setFormData}
                onSubmit={onSubmit}
            />
        </div>
    );
};

export default Register;
