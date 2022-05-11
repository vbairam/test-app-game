import { api } from "./api";

export const getWeatherById = (id) => {
    return api.get('', {params: {id: id, units: 'metric',appid: process.env.REACT_APP_API_KEY}})
}