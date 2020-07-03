const axios = require('axios')

let _id_realm;
let _api_key;
let _access_token;
let _refresh_token
let GAMIFICATE_URL = "https://www.gamificate-engine.com/api/"

const instance = axios.create({
    baseURL: GAMIFICATE_URL
})


function create(id_realm, api_key) {
    _id_realm = id_realm;
    _api_key = api_key;
    return _authenticate();
}


function _authenticate() {
    instance.post('auth', { id_realm: _id_realm, api_key: _api_key })
        .then(response => {
            _access_token = response.data.access_token;
            _refresh_token = response.data.refresh_token;
        })
        .catch(error => {
            console.log(error.response)
        })
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
                        _access_token = res.data.access_token;

                        access_token_interceptor = instance.interceptors.request.use(config => {
                            if (_access_token) {
                                config.headers['Authorization'] = `Bearer ${_access_token}`;
                            }
                            return config;
                        },error => {
                            Promise.reject(error)
                        });

                        return instance(originalRequest);
                    }
                })
                .catch(error => console.log(error))
        }
        return Promise.reject(error);
    }
)


function getBadges() {
    return instance.get('badges')
        .then(response => {
            return response.data
        })
        .catch(error => console.log(error))
}


function getUsersBadgesProgress() {
    return instance.get('badges/progress')
        .then(response => {
            return response.data
        })
        .catch(error => console.log(error))
}


function getBadge(id_badge) {
    return instance.get(`badges/${id_badge}`)
        .then(response => {
            return response.data
        })
        .catch(error => console.log(error))
}


function getUsersBadgeProgress(id_badge) {
    return instance.get(`badges/${id_badge}/progress`)
        .then(response => {
            return response.data
        })
        .catch(error => console.log(error))
}


function getUsersBadgeFinished(id_badge) {
    return instance.get(`badges/${id_badge}/progress/finished`)
        .then(response => {
            return response.data
        })
        .catch(error => console.log(error))
}


function getUsersBadgeUnfinished(id_badge) {
    return instance.get(`badges/${id_badge}/progress/unfinished`)
        .then(response => {
            return response.data
        })
        .catch(error => console.log(error))
}


function getLeaderboardByLevel() {
    return instance.get(`leaderboards/level`)
        .then(response => {
            return response.data
        })
        .catch(error => console.log(error))
}


function getLeaderboardByTotalBadges() {
    return instance.get(`leaderboards/total_badges`)
        .then(response => {
            return response.data
        })
        .catch(error => console.log(error))
}


function getLeaderboardByTotalXP() {
    return instance.get(`leaderboards/total_xp`)
        .then(response => {
            return response.data
        })
        .catch(error => console.log(error))
}


function getRewards() {
    return instance.get(`rewards`)
        .then(response => {
            return response.data
        })
        .catch(error => console.log(error))
}


function getUsersRedeemedRewards() {
    return instance.get(`rewards/redeems`)
        .then(response => {
            return response.data
        })
        .catch(error => console.log(error))
}


function getReward(id_reward) {
    return instance.get(`rewards/${id_reward}`)
        .then(response => {
            return response.data
        })
        .catch(error => console.log(error))
}


function getUsersRedeemedReward(id_reward) {
    return instance.get(`rewards/${id_reward}/redeems`)
        .then(response => {
            return response.data
        })
        .catch(error => console.log(error))
}


function getAllUsers() {
    return instance.get(`users`)
        .then(response => {
            return response.data
        })
        .catch(error => console.log(error))
}


function registerUser(username, email) {
    return instance.post(`users`, { username: username, email: email })
        .then(response => {
            return response.data
        })
        .catch(error => console.log(error))
}


function getUser(id_user) {
    return instance.get(`users/${id_user}`)
        .then(response => {
            return response.data
        })
        .catch(error => console.log(error))
}


function editUser(id_user, username, email, active) {
    return instance.put(`users/${id_user}`, { username: username, email: email, active: active })
        .then(response => {
            return response.data
        })
        .catch(error => console.log(error))
}


function getUsersUnredeemedRewards() {
    return instance.get(`users/rewards/unredeemed`)
        .then(response => {
            return response.data
        })
        .catch(error => console.log(error))
}

function getUserRedeemedRewards(id_user) {
    return instance.get(`users/${id_user}/rewards`)
        .then(response => {
            return response.data
        })
        .catch(error => console.log(error))
}


function redeemUserReward(id_user, id_reward) {
    return instance.post(`users/${id_user}/rewards`, { id_reward: id_reward })
        .then(response => {
            return response.data
        })
        .catch(error => console.log(error))
}


function getUserUnredeemedRewards(id_user) {
    return instance.get(`users/${id_user}/rewards/unredeemed`)
        .then(response => {
            return response.data
        })
        .catch(error => console.log(error))
}


function getUserBadgeProgress(id_user, id_badge) {
    return instance.get(`users/${id_user}/badges/${id_badge}`)
        .then(response => {
            return response.data
        })
        .catch(error => console.log(error))
}


function updateUserBadgeProgress(id_user, id_badge, progress) {
    return instance.put(`users/${id_user}/badges/${id_badge}`, { progress: progress })
        .then(response => {
            return response.data
        })
        .catch(error => console.log(error))
}


function getUserBadgesProgress(id_user) {
    return instance.get(`users/${id_user}/badges/all`)
        .then(response => {
            return response.data
        })
        .catch(error => console.log(error))
}


function getUserBadgesFinished(id_user) {
    return instance.get(`users/${id_user}/badges/finished`)
        .then(response => {
            return response.data
        })
        .catch(error => console.log(error))
}


module.exports = {
    create,
    getBadges,
    getUsersBadgesProgress,
    getBadge,
    getUsersBadgeProgress,
    getUsersBadgeFinished,
    getUsersBadgeUnfinished,
    getLeaderboardByLevel,
    getLeaderboardByTotalBadges,
    getLeaderboardByTotalXP,
    getRewards,
    getUsersRedeemedRewards,
    getReward,
    getUsersRedeemedReward,
    getAllUsers,
    registerUser,
    getUser,
    editUser,
    getUsersUnredeemedRewards,
    getUserRedeemedRewards,
    redeemUserReward,
    getUserUnredeemedRewards,
    getUserBadgeProgress,
    updateUserBadgeProgress,
    getUserBadgesProgress,
    getUserBadgesFinished
}