import { ToastContainer } from 'react-toastify';

export const EnableToast = () => {
    return <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        theme="dark"
    />
}

