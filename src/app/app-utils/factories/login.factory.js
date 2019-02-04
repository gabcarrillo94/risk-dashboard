angular
.module('dashboard')
.factory('LoginFactory', LoginFactory)

LoginFactory.$inject = ['$http', '$localStorage', '$log', '$state', 'BaseUrl'];
function LoginFactory($http, $localStorage, $log, $state, BaseUrl) {
    var service = {};

    service.Login = Login;
    service.Logout = Logout;
    service.refreshToken = refreshToken;

    return service;

    function Login(username, password, callback) {
        $http.post(BaseUrl.path['URL_LOGIN'] + '?username=' + username, {}, {headers: {password: password}})
                .success(function (response, status, headers) {
                    // login successful if there's a token in the response
                    if (headers('Token')) {

                        var currentDate = new Date();
                        currentDate.setMinutes( currentDate.getMinutes() + parseInt(headers('expiration')));
                        tokenInfo = {
                            expiration: currentDate,
                            token: headers('token')
                        }
                        // store username and token in local storage to keep user logged in between page refreshes
                        // TODO: Definir si va el token como campo en la respuesta o en el header solamente
                        // $localStorage.currentUser = { username: username, token: response.token };
                        $localStorage.currentUser = {
                            userId: response.userId,
                            username: username,
                            name: response.name,
                            tokenInfo: tokenInfo,
                            opcionesMenu: response.opcionesMenu,
                            listadoUsuarioRoles: response.listadoUsuarioRoles
                        };


                        // add jwt token to auth header for all requests made by the $http service
                        $http.defaults.headers.common.Authorization = 'Bearer ' + headers('Token');

                        // execute callback with true to indicate successful login
                        callback(true);
                    } else {
                        // execute callback with false to indicate failed login
                        callback(false);
                    }
                })
                .error(function (response, status, header) {
                    callback(false)
                });
    }

    function refreshToken() {
        return new Promise(function (resolve, reject){
            $http({
                url: BaseUrl.path['URL_REFRESH_TOKEN'],
                method: 'POST',
                headers: {
                    token: $localStorage.currentUser.tokenInfo.token
                }
            })
                    .success(function (response, status, headers) {
                        // login successful if there's a token in the response
                        if (headers('Token')) {
    
                            var currentDate = new Date();
                            currentDate.setMinutes( currentDate.getMinutes() + parseInt(headers('expiration')));
                            tokenInfo = {
                                expiration: currentDate,
                                token: headers('token')
                            }
                            // store username and token in local storage to keep user logged in between page refreshes
                            // TODO: Definir si va el token como campo en la respuesta o en el header solamente
                            // $localStorage.currentUser = { username: username, token: response.token };
                            $localStorage.currentUser = {
                                userId: response.userId,
                                username: response.username,
                                name: response.name,
                                tokenInfo: tokenInfo,
                                opcionesMenu: response.opcionesMenu,
                                listadoUsuarioRoles: response.listadoUsuarioRoles
                            };
    
    
                            // add jwt token to auth header for all requests made by the $http service
                            $http.defaults.headers.common.Authorization = 'Bearer ' + headers('Token');
    
                            // execute callback with true to indicate successful login
                            resolve(response);
                        } else {
                            // execute callback with false to indicate failed login
                            reject(response);
                        }
                    })
                    .error(function (response, status, header) {
                        if (status === 401) {
                            reject(response);
                        }
                    });

        })
    }

    function Logout() {
        // remove user from local storage and clear http auth header
        delete $localStorage.currentUser;
        $http.defaults.headers.common.Authorization = '';
        $state.go('login');
    }
}