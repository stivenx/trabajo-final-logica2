import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../apiconfig/api";
import useAuthRedirect from "../Hooks/useAuthRedirect";

const Register = () => {
    useAuthRedirect();

    const [name, setName] = React.useState("");
    const [email, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");
    const [direction, setDirection] = React.useState("");
    const [error, setError] = React.useState("");
    const navigate = useNavigate();

    // 🔹 Temporizador para ocultar el error después de 5 segundos
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                setError("");
            }, 5000); // 5000ms = 5 segundos

            return () => clearTimeout(timer); // Limpia el temporizador si el error cambia
        }
    }, [error]); // Se ejecuta cada vez que el error cambia

    const handleRegister = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden.");
            return;
        }

        try {
            const { data } = await api.post("/users/register", { email, password, name, direction });
            localStorage.setItem("token", data.token);
            window.dispatchEvent(new Event("authChange"));
            navigate("/");
        } catch (error) {
            let errorMessage = "Error desconocido";

            if (error.response) {
                console.error("Detalles del error:", error.response.data);
                errorMessage = error.response.data.message || errorMessage;

                if (error.response.status === 400) {
                    errorMessage = "El correo electrónico ya está registrado.";
                } else if (error.response.status === 500) {
                    errorMessage = "Error interno del servidor. Intente nuevamente más tarde.";
                }
            } else {
                console.error("Error de conexión:", error.message);
                errorMessage = "Hubo un problema con la conexión al servidor.";
            }

            setError(errorMessage);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    return (
        <section className="bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Crear una cuenta
                        </h1>

                        {/* Mostrar mensaje de error */}
                        {error && (
                            <div className="p-3 text-sm text-red-700 bg-red-100 border border-red-400 rounded-lg dark:bg-red-800 dark:text-red-200">
                                {error}
                            </div>
                        )}

                        <form className="space-y-4 md:space-y-6" onSubmit={handleRegister}>
                            <div>
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Tu correo electrónico
                                </label>
                                <input type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="nombre@empresa.com" required value={email} onChange={(e) => setUsername(e.target.value)} />
                            </div>
                            <div>
                                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Tu nombre
                                </label>
                                <input type="text" name="name" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Nombre" required value={name} onChange={(e) => setName(e.target.value)} />
                            </div>
                            <div>
                                <label htmlFor="direction" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Tu dirección
                                </label>
                                <input type="text" name="direction" id="direction" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Dirección" required value={direction} onChange={(e) => setDirection(e.target.value)} />
                            </div>

                            <div>
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Contraseña
                                </label>
                                <input type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required value={password} onChange={(e) => setPassword(e.target.value)} />
                            </div>
                            <div>
                                <label htmlFor="confirm-password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Confirmar contraseña
                                </label>
                                <input type="password" name="confirm-password" id="confirm-password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                            </div>

                            <div className="flex items-start">
                                <div className="flex items-center h-5">
                                    <input id="terms" aria-describedby="terms" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" required />
                                </div>
                                <div className="ml-3 text-sm">
                                    <label htmlFor="terms" className="font-light text-gray-500 dark:text-gray-300">
                                        Acepto los <a className="font-medium text-primary-600 hover:underline dark:text-primary-500" href="#">Términos y Condiciones</a>
                                    </label>
                                </div>
                            </div>

                            <button type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                                Crear una cuenta
                            </button>
                        </form>
                    </div>
                </div>

            </div>

        </section>
    );
};

export default Register;
    
    
    


