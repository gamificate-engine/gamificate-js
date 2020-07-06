const axios = require('axios')

class Gamificate {
    constructor(id_realm, api_key) {
        this._id_realm = id_realm;
        this._api_key = api_key;
        this.instance = axios.create({
            baseURL: "https://www.gamificate-engine.com/api/"
        });
        this.access_token_interceptor = this.instance.interceptors.request.use(config => {
                if (this._access_token) {
                    config.headers['Authorization'] = `Bearer ${this._access_token}`;
                }
                return config;
            },error => {
                Promise.reject(error)
            }
        );
        this.instance.interceptors.response.use((response) => {
                return response
            } ,(error) => {
                console.log(error)
                const originalRequest = error.config;
                if (error.response.status === 401 && error.response.data.msg === 'Token has expired') {
                    originalRequest._retry = true;
                    this.instance.interceptors.request.eject(this.access_token_interceptor)

                    return this.instance.post('auth/refresh', { }, {
                        headers: {
                            Authorization: `Bearer ${this._refresh_token}`
                        }})
                        .then(res => {
                            if (res.status === 200) {
                                this._access_token = res.data.access_token;

                                this.access_token_interceptor = this.instance.interceptors.request.use(config => {
                                    if (_access_token) {
                                        config.headers['Authorization'] = `Bearer ${_access_token}`;
                                    }
                                    return config;
                                },error => {
                                    Promise.reject(error)
                                });

                                return this.instance(originalRequest);
                            }
                        })
                        .catch(error => console.log(error))
                }
                return Promise.reject(error);
            }
        );

        this._authenticate();
    }

    _authenticate() {
        this.instance.post('auth', { id_realm: this._id_realm, api_key: this._api_key })
            .then(response => {
                this._access_token = response.data.access_token;
                this._refresh_token = response.data.refresh_token;
            })
            .catch(error => {
                console.log(error)
            })
    }


    getBadges() {
        return this.instance.get('badges')
            .then(response => {
                return response.data
            })
            .catch(error => console.log(error))
    }


    getUsersBadgesProgress() {
        return this.instance.get('badges/progress')
            .then(response => {
                return response.data
            })
            .catch(error => console.log(error))
    }


    getBadge(id_badge) {
        return this.instance.get(`badges/${id_badge}`)
            .then(response => {
                return response.data
            })
            .catch(error => console.log(error))
    }


    getUsersBadgeProgress(id_badge) {
        return this.instance.get(`badges/${id_badge}/progress`)
            .then(response => {
                return response.data
            })
            .catch(error => console.log(error))
    }


    getUsersBadgeFinished(id_badge) {
        return this.instance.get(`badges/${id_badge}/progress/finished`)
            .then(response => {
                return response.data
            })
            .catch(error => console.log(error))
    }


    getUsersBadgeUnfinished(id_badge) {
        return this.instance.get(`badges/${id_badge}/progress/unfinished`)
            .then(response => {
                return response.data
            })
            .catch(error => console.log(error))
    }


    getLeaderboardByLevel() {
        return this.instance.get(`leaderboards/level`)
            .then(response => {
                return response.data
            })
            .catch(error => console.log(error))
    }


    getLeaderboardByTotalBadges() {
        return this.instance.get(`leaderboards/total_badges`)
            .then(response => {
                return response.data
            })
            .catch(error => console.log(error))
    }


    getLeaderboardByTotalXP() {
        return this.instance.get(`leaderboards/total_xp`)
            .then(response => {
                return response.data
            })
            .catch(error => console.log(error))
    }


    getRewards() {
        return this.instance.get(`rewards`)
            .then(response => {
                return response.data
            })
            .catch(error => console.log(error))
    }


    getUsersRedeemedRewards() {
        return this.instance.get(`rewards/redeems`)
            .then(response => {
                return response.data
            })
            .catch(error => console.log(error))
    }


    getReward(id_reward) {
        return this.instance.get(`rewards/${id_reward}`)
            .then(response => {
                return response.data
            })
            .catch(error => console.log(error))
    }


    getUsersRedeemedReward(id_reward) {
        return this.instance.get(`rewards/${id_reward}/redeems`)
            .then(response => {
                return response.data
            })
            .catch(error => console.log(error))
    }


    getAllUsers() {
        return this.instance.get(`users`)
            .then(response => {
                return response.data
            })
            .catch(error => console.log(error))
    }


    registerUser(username, email) {
        return this.instance.post(`users`, { username: username, email: email })
            .then(response => {
                return response.data
            })
            .catch(error => console.log(error))
    }


    getUser(id_user) {
        return this.instance.get(`users/${id_user}`)
            .then(response => {
                return response.data
            })
            .catch(error => console.log(error))
    }


    editUser(id_user, username, email, active) {
        return this.instance.put(`users/${id_user}`, { username: username, email: email, active: active })
            .then(response => {
                return response.data
            })
            .catch(error => console.log(error))
    }


    getUsersUnredeemedRewards() {
        return this.instance.get(`users/rewards/unredeemed`)
            .then(response => {
                return response.data
            })
            .catch(error => console.log(error))
    }

    getUserRedeemedRewards(id_user) {
        return this.instance.get(`users/${id_user}/rewards`)
            .then(response => {
                return response.data
            })
            .catch(error => console.log(error))
    }


    redeemUserReward(id_user, id_reward) {
        return this.instance.post(`users/${id_user}/rewards`, { id_reward: id_reward })
            .then(response => {
                return response.data
            })
            .catch(error => console.log(error))
    }


    getUserUnredeemedRewards(id_user) {
        return this.instance.get(`users/${id_user}/rewards/unredeemed`)
            .then(response => {
                return response.data
            })
            .catch(error => console.log(error))
    }


    getUserBadgeProgress(id_user, id_badge) {
        return this.instance.get(`users/${id_user}/badges/${id_badge}`)
            .then(response => {
                return response.data
            })
            .catch(error => console.log(error))
    }


    updateUserBadgeProgress(id_user, id_badge, progress) {
        return this.instance.put(`users/${id_user}/badges/${id_badge}`, { progress: progress })
            .then(response => {
                return response.data
            })
            .catch(error => console.log(error))
    }


    getUserBadgesProgress(id_user) {
        return this.instance.get(`users/${id_user}/badges/all`)
            .then(response => {
                return response.data
            })
            .catch(error => console.log(error))
    }


    getUserBadgesFinished(id_user) {
        return this.instance.get(`users/${id_user}/badges/finished`)
            .then(response => {
                return response.data
            })
            .catch(error => console.log(error))
    }
}


module.exports = Gamificate
