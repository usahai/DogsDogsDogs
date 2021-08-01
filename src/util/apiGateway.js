import axios from "axios";
import { URL } from "./constants";

const instance = axios.create({
	baseURL: URL.BASE_URL,
	timeout: 10000,
	headers: {
		"Content-Type": "application/x-www-form-urlencoded",
		"X-Custom-Header": process.env.DOG_API_KEY
	}
});

export default {
	get: (url, params) =>
		instance({
			method: "GET",
			url: url,
			params: params.params
		})
			.then(resp => resp.data)
			.catch(error => error),
	post: (url, params) =>
		instance({
			method: "POST",
			url: url,
			params: params
		})
			.then(resp => resp.data)
			.catch(error => error)
};
