import { LogoutContext } from './logoutContext'
import { useContext, useEffect, useRef } from 'react'

 export default function LogoutModal() {
     
 
    const {logout, open, close, logoutSystem} = useContext(LogoutContext);
    const modalRef = useRef(null);

    useEffect(() => {
        const handleOnclick = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
                close();
            }
        };

        if (logout) {
            document.addEventListener("mousedown", handleOnclick);
        }

        return () => {
            document.removeEventListener("mousedown", handleOnclick);
        };
    }, [logout, close]);

    if (!logout) return null; // Evita render innecesario

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
            <div 
                ref={modalRef}
                className="bg-white dark:bg-gray-800 w-full max-w-md p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700"
            >
                {/* Icono */}
                <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 flex items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
                        <span className="text-red-600 dark:text-red-300 text-4xl">⛔</span>
                    </div>
                </div>

                {/* Título */}
                <h1 className="text-2xl font-bold text-center mb-2 text-gray-900 dark:text-white">
                    ¿Cerrar sesión?
                </h1>

                {/* Texto */}
                <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
                    Si cierras sesión tendrás que iniciar sesión nuevamente.
                </p>

                {/* Botones */}
                <div className="flex flex-col space-y-3">
                    <button
                        onClick={logoutSystem}
                        className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-xl transition-all"
                    >
                        🔒 Cerrar sesión
                    </button>

                    <button
                        onClick={close}
                        className="w-full py-3 bg-gray-300 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 
                        text-gray-800 dark:text-white font-semibold rounded-xl transition-all"
                    >
                        ↩️ Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
};


