import axios, { type AxiosError } from 'axios';
import { toast } from 'svelte-sonner';
type errorMessage = { message: string };

const axiosInstance = axios.create({
	timeout: 1000,
	headers: { 'Content-Type': 'application/json' },
	withCredentials: true
});

axiosInstance.interceptors.response.use(
	function (response) {
		// Any status code that lie within the range of 2xx cause this function to trigger
		// Do something with response data
		return response;
	},
	function (error: AxiosError<errorMessage>) {
		// Any status codes that falls outside the range of 2xx cause this function to trigger
		// Do something with response error

		if (!error.response) {
			toast.error('Network Error');
			return Promise.reject(error);
		}

		const { status, data } = error.response;

		switch (status) {
			// case 401:
			// 	toast.error('Unauthorized Redirecting to login page');
			// 	break;
			case 400:
				toast.error(data.message || 'Bad Request');
				break;
			case 404:
				toast.error(data.message || 'Not Found');
				break;
			case 500:
				toast.error('Server Error');
				break;
			default:
				toast.error(data.message || 'An error occurred');
		}

		return Promise.reject(error);
	}
);

export default axiosInstance;
