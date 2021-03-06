import axios, { AxiosResponse } from 'axios';
import { AppConfiguration } from '../config/app.config';
import EventRegister from './EventRegister';

type ApiMethod = 'get' | 'post' | 'put' | 'delete';
export type ApiRole   =  'administrator';
type ApiResponseStatus = 'ok' | 'error' | 'login';

export interface ApiResponse {
    status: ApiResponseStatus,
    data: any,
}

export default function api(
    method: ApiMethod,
    path: string,
    role: any,
    body: any | undefined = undefined,
    attemptToRefresh: boolean = true,
): Promise<ApiResponse> {
    return new Promise<ApiResponse>(resolve => {
        axios({
            method: method,
            baseURL: AppConfiguration.API_URL,
            url: path,
            data: body ? JSON.stringify(body) : '',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getAuthToken(role),
            },
        })
        .then(res => responseHandler(res, resolve))
        .catch(async err => {
            if (attemptToRefresh && ("" + err).includes("401")) {
                const newToken: string|null = await refreshToken(role);

                if (newToken === null) {
                    EventRegister.emit("AUTH_EVENT", "force_login");

                    return resolve({
                        status: 'login',
                        data: null,
                    });
                }

                saveAuthToken(role, newToken);

                api(method, path, role, body, false)
                    .then(res => resolve(res))
                    .catch(() => {
                        EventRegister.emit("AUTH_EVENT", "force_login");

                        resolve({
                            status: 'login',
                            data: null,
                        });
                    });

                return;
            }

            if (err?.response?.status === 401) {
                EventRegister.emit("AUTH_EVENT", "force_login");

                return resolve({
                    status: 'login',
                    data: null,
                });
            }

            if (err?.response?.status === 403) {
                EventRegister.emit("AUTH_EVENT", "force_login");

                return resolve({
                    status: 'login',
                    data: 'Wrong role',
                });
            }

            resolve({
                status: 'error',
                data: err?.response,
            });
        });
    });
}

function responseHandler(res: AxiosResponse<any>, resolve: (data: ApiResponse) => void) {
    if (res?.status < 200 || res?.status >= 300) {
        return resolve({
            status: 'error',
            data: '' + res,
        });
    }

    resolve({
        status: 'ok',
        data: res.data,
    });
}

function getAuthToken(role: any): string {
    return localStorage.getItem(role + "-auth-token") ?? '';
}

function getRefreshToken(role: any): string {
    return localStorage.getItem(role + "-refresh-token") ?? '';
}

export function saveAuthToken(role: any, token: string) {
    localStorage.setItem(role + "-auth-token", token);
}

export function saveRefreshToken(role: any, token: string) {
    localStorage.setItem(role + "-refresh-token", token);
}

export function saveIdentity(role: any, identity: string) {
    localStorage.setItem(role + "-identity", identity);
}

export function getIdentity(role: any): string {
    return localStorage.getItem(role + "-identity") ?? '';
}

function refreshToken(role: any): Promise<string|null> {
    return new Promise<string|null>(resolve => {
        axios({
            method: "post",
            baseURL: AppConfiguration.API_URL,
            url: "/auth/" + role + "/refresh",
            data: JSON.stringify({
                refreshToken: getRefreshToken(role),
            }),
            headers: { 'Content-Type': 'application/json' },
        })
        .then(res => refreshTokenResponseHandler(res, resolve))
        .catch(() => {
            resolve(null);
        });
    });
}

function refreshTokenResponseHandler(res: AxiosResponse<any>, resolve: (data: string|null) => void) {
    if (res.status !== 200) {
        return resolve(null);
    }

    resolve(res.data?.authToken);
}

export function isRoleLoggedIn(role: any): Promise<boolean> {
    return new Promise<boolean>(resolve => {
        api("get", "/auth/" + role + "/ok", role)
        .then(res => {
            if(res?.data === "OK") return resolve(true);
            resolve(false);
        })
        .catch(() => {
            resolve(false)
        })
    });
}