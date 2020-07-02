import axios from 'axios'

let _id_realm;
let _api_key;
let _access_token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1OTM3MTM4MTUsIm5iZiI6MTU5MzcxMzgxNSwianRpIjoiNTViZWVmZWQtMmUwNC00OGQwLThjODQtZmZkNmQ4ZTkwNjI4IiwiZXhwIjoxNTkzNzE0NzE1LCJpZGVudGl0eSI6MiwiZnJlc2giOmZhbHNlLCJ0eXBlIjoiYWNjZXNzIn0.0tleuxZU17poLS15aQ5xjAVZ-RyvpR-lRw1lk_EtIls"
let _refresh_token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1OTM3MTM4MTUsIm5iZiI6MTU5MzcxMzgxNSwianRpIjoiMzg4ZDZmNzYtMTJkMC00NDJlLWE1YTMtNDBhNWFkNDNkZjAzIiwiZXhwIjoxNTk2MzA1ODE1LCJpZGVudGl0eSI6MiwidHlwZSI6InJlZnJlc2gifQ.5WR_yTDehiBynfmmY_P69XpUtYYScCnCKNll2cgYLa4";
let GAMIFICATE_URL = "http://localhost:5000/api/"

const instance = axios.create({
    baseURL: GAMIFICATE_URL
})


export function create(id_realm, api_key) {
    _id_realm = id_realm;
    _api_key = api_key;
}


function _authenticate() {
    instance.post('auth', { id_realm: _id_realm, api_key: _api_key })
            .then(response => {
                _access_token = response.data.access_token;
                _refresh_token = response.data.refresh_token;
            })
            .catch(error => console.log(error.response))
}


let access_token_interceptor = instance.interceptors.request.use(config => {
    if (_access_token) {
        config.headers['Authorization'] = `Bearer ${_access_token}`;
    }
    return config;
    },error => {
        Promise.reject(error)
    }
);


instance.interceptors.response.use((response) => {
        return response
    },(error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && error.response.data.msg === 'Token has expired') {
            originalRequest._retry = true;
            instance.interceptors.request.eject(access_token_interceptor)

            return instance.post('auth/refresh', { }, {
                                headers: {
                                    Authorization: `Bearer ${_refresh_token}`
                                }})
                            .then(res => {
                                if (res.status === 200) {
                                    // 1) save token
                                    _access_token = res.data.access_token;

                                    // 2) Change Authorization header
                                    access_token_interceptor = instance.interceptors.request.use(config => {
                                        if (_access_token) {
                                            config.headers['Authorization'] = `Bearer ${_access_token}`;
                                        }
                                        return config;
                                    },error => {
                                        Promise.reject(error)
                                    });

                                    // 3) return originalRequest object with Axios.
                                    return instance(originalRequest);
                                }
                            })
                            .catch(error => console.log(error))
        }
        return Promise.reject(error);
    }
)


export function getBadges() {
    instance.get('badges')
            .then(response => {
                //console.log(response.data)
                return response.data
            })
            .catch(error => console.log(error))
}


export function getUsersBadgesProgress() {
    instance.get('badges/progress')
            .then(response => {
                //console.log(response.data)
                return response.data
            })
            .catch(error => console.log(error))
}


export function getBadge(id_badge) {
    instance.get(`badges/${id_badge}`)
            .then(response => {
                //console.log(response.data)
                return response.data
            })
            .catch(error => console.log(error))
}


export function getUsersBadgeProgress(id_badge) {
    instance.get(`badges/${id_badge}/progress`)
            .then(response => {
                //console.log(response.data)
                return response.data
            })
            .catch(error => console.log(error))
}


export function getUsersBadgeFinished(id_badge) {
    instance.get(`badges/${id_badge}/progress/finished`)
            .then(response => {
                //console.log(response.data)
                return response.data
            })
            .catch(error => console.log(error))
}


export function getUsersBadgeUnfinished(id_badge) {
    instance.get(`badges/${id_badge}/progress/unfinished`)
        .then(response => {
            //console.log(response.data)
            return response.data
        })
        .catch(error => console.log(error))
}


export function getLeaderboardByLevel() {
    instance.get(`leaderboards/level`)
            .then(response => {
                //console.log(response.data)
                return response.data
            })
            .catch(error => console.log(error))
}


export function getLeaderboardByTotalBadges() {
    instance.get(`leaderboards/total_badges`)
            .then(response => {
                //console.log(response.data)
                return response.data
            })
            .catch(error => console.log(error))
}


export function getLeaderboardByTotalXP() {
    instance.get(`leaderboards/total_xp`)
            .then(response => {
                //console.log(response.data)
                return response.data
            })
            .catch(error => console.log(error))
}


export function getRewards() {
    instance.get(`rewards`)
            .then(response => {
                //console.log(response.data)
                return response.data
            })
            .catch(error => console.log(error))
}


export function getUsersRedeemedRewards() {
    instance.get(`rewards/redeems`)
            .then(response => {
                //console.log(response.data)
                return response.data
            })
            .catch(error => console.log(error))
}


export function getReward(id_reward) {
    instance.get(`rewards/${id_reward}`)
            .then(response => {
                //console.log(response.data)
                return response.data
            })
            .catch(error => console.log(error))
}


export function getUsersRedeemedReward(id_reward) {
    instance.get(`rewards/${id_reward}/redeems`)
            .then(response => {
                console.log(response.data)
                return response.data
            })
            .catch(error => {
                if(error.response.status === 401 && error.response.data.msg === 'Token has expired') {
                    //_refreshToken(() => getUsersRedeemedReward(id_reward))
                }
                else return error.response;
            })
}


export function getAllUsers() {
    instance.get(`users`)
            .then(response => {
                //console.log(response.data)
                return response.data
            })
            .catch(error => console.log(error))
}


export function registerUser(username, email) {
    instance.post(`users`, { username: username, email: email })
            .then(response => {
                //console.log(response.data)
                return response.data
            })
            .catch(error => console.log(error))
}


export function getUser(id_user) {
    instance.get(`users/${id_user}`)
            .then(response => {
                //console.log(response.data)
                return response.data
            })
            .catch(error => console.log(error))
}


export function editUser(id_user, username, email, active) {
    instance.put(`users/${id_user}`, { username: username, email: email, active: active })
            .then(response => {
                console.log(response.data)
                return response.data
            })
            .catch(error => {
                if(error.response.status === 401 && error.response.data.msg === 'Token has expired') {
                    console.log("vai refrescar1")
                    _refreshToken().then(editUser(id_user, username, email, active))
                    console.log("refrescar2")

                }
                else return error.response;
            })
}


export function getUsersUnredeemedRewards() {
    instance.get(`users/rewards/unredeemed`)
            .then(response => {
                //console.log(response.data)
                return response.data
            })
            .catch(error => console.log(error))
}

export function getUserRedeemedRewards(id_user) {
    instance.get(`users/${id_user}/rewards`)
            .then(response => {
                //console.log(response.data)
                return response.data
            })
            .catch(error => console.log(error))
}


export function redeemUserReward(id_user, id_reward) {
    instance.post(`users/${id_user}/rewards`, { id_reward: id_reward })
            .then(response => {
                //console.log(response.data)
                return response.data
            })
            .catch(error => console.log(error))
}


export function getUserUnredeemedRewards(id_user) {
    instance.get(`users/${id_user}/rewards/unredeemed`)
            .then(response => {
                //console.log(response.data)
                return response.data
            })
            .catch(error => console.log(error))
}


export function getUserBadgeProgress(id_user, id_badge) {
    instance.get(`users/${id_user}/badges/${id_badge}`)
            .then(response => {
                //console.log(response.data)
                return response.data
            })
            .catch(error => console.log(error))
}


export function updateUserBadgeProgress(id_user, id_badge, progress) {
    instance.put(`users/${id_user}/badges/${id_badge}`, { progress: progress })
            .then(response => {
                //console.log(response.data)
                return response.data
            })
            .catch(error => console.log(error))
}


export function getUserBadgesProgress(id_user) {
    instance.get(`users/${id_user}/badges/all`)
            .then(response => {
                console.log(response.data)
                return response.data
            })
            .catch(error => console.log(error))
}


export function getUserBadgesFinished(id_user) {
    instance.get(`users/${id_user}/badges/finished`)
        .then(response => {
            console.log(response.data)
            return response.data
        })
        .catch(error => console.log(error))
}


create( 2, "44a21b06a507018b62b7c4046f31b5c9");
//_authenticate();

setTimeout(getUserBadgesFinished, 2000, 2);


