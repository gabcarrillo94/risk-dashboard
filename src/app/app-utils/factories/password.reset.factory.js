angular
.module('dashboard')
.factory('PasswordResetFactory', PasswordResetFactory)

PasswordResetFactory.$inject = ['$http','BaseUrl'];

    function PasswordResetFactory($http, BaseUrl) {
        var service = {};

        service.changePassword = function (username, token, password, passConfirmation) {
            return new Promise(function (resolve, reject) {
                $http({
                    method: 'PUT',
                    url: BaseUrl.urlPasswordChange(username, token),
                    params: {
                        password: password,
                        password_confirmation: passConfirmation
                    },
                    transformRequest: function (obj) {
                        var str = [];
                        for (var p in obj)
                            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                        return str.join("&");
                    },
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                })
                        .success(function (response, status, headers) {
                            console.log(status);
                            resolve(response, status);
                        })
                        .error(function (response, status, headers) {
                            reject(response, status);
                        });
            });
        };

        service.passwordResetRequest = function (username) {
            return new Promise(function (resolve, reject) {
                $http({
                    method: 'POST',
                    url: BaseUrl.urlPasswordReset(username)
                })
                        .success(function (response, status, headers) {
                            if (status === 500) {
                                reject('error')
                            } else {
                                resolve('done');
                            }
                        })
                        .error(function (response, status, headers) {
                            reject('error');
                        });
            });
        };

        return service;
    }