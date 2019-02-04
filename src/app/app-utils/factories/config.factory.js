angular
.module('dashboard')
.factory('ConfigFactory', ConfigFactory)

ConfigFactory.$inject = ['$http', '$localStorage', 'BaseUrl'];

    function ConfigFactory($http, $localStorage, BaseUrl) {
        var service = {};

        service.getConfig = function () {
            return new Promise(function (resolve, reject) {
                $http({
                    url: BaseUrl.path['URL_CONFIG'],
                    method: 'GET',
                    headers: {
                        token: $localStorage.currentUser.tokenInfo.token
                    }
                })
                        .success(function (response, status, headers) {
                            resolve(response);
                        })
                        .error(function (response, status, headers) {
                            reject(response);
                        });
            });
        };

        service.upsertConfig = function (c) {
            return new Promise(function (resolve, reject) {
                $http({
                    url: BaseUrl.path['URL_CONFIG'],
                    method: 'PUT',
                    data: c,
                    headers: {
                        token: $localStorage.currentUser.tokenInfo.token
                    }
                })
                        .success(function (response, status, headers) {
                            resolve(response);
                        })
                        .error(function (response, status, headers) {
                            reject(response);
                        });
            });
        };

        return service;
    }