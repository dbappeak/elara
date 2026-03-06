import { useState } from "react";
import { login } from "../../src/services/authServices";
import { useNavigate } from "react-router-dom";
import usePageTitle from "../../hooks/usePageTitle";

function Login() {
    usePageTitle("Login");
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setErrors({});
            const res = await login(form);
            localStorage.setItem("token", res.data.data.token);
            navigate("/dashboard");
        } catch (error) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors);
            }
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold mb-4">Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-600">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            className="w-full border p-2 rounded"
                            value={form.email}
                            onChange={handleChange}
                        />
                        {errors?.email && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.email[0]}
                            </p>
                        )}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-gray-600">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            className="w-full border p-2 rounded"
                            value={form.password}
                            onChange={handleChange}
                        />
                        {errors?.password && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.password[0]}
                            </p>
                        )}
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;