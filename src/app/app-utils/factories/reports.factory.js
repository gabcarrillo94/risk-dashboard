angular
.module('dashboard')
.factory('ReportsFactory', ReportsFactory)

    ReportsFactory.$inject = ['$http', '$state', '$localStorage', 'BaseUrl'];

    function ReportsFactory($http, $state, $localStorage, BaseUrl) {
        var service = {};

        // -- Leer datos de las paginas del informe embebido
        // -- Must be in a service instead of a factory
        service.getPages = function(page) {
            var self = this;

            self.name = page.name;
            self.displayName = page.displayName;

            return self;
        };

        // -- Obtener credenciales
        service.getAccess = function (req) {
            return new Promise(function (resolve, reject) {
                $http({
                    url: BaseUrl.path['URL_PWBI'],
                    method: 'GET',
                    headers: {
                        token: $localStorage.currentUser.tokenInfo.token
                    }
                })
                .success(function (response, status, headers) {
                    var pbi = {
                        accessId: response.accessId,
                        username: response.username,
                        active: response.active,
                        clientId: response.clientId,
                        clientSecret: response.clientSecret,
                    }
                    resolve(pbi);
                })
                .error(function (response, status, headers) {
                    reject(response);
                });
            });
        };
        
        // -- Guardar las credenciales
        service.saveCredentials = function (req) {
            return new Promise(function (resolve, reject) {
                // -- Guardar/Actualizar credenciales
                $http({
                    url: BaseUrl.path['URL_PWBI'],
                    method: req.accessId ? "PUT" : "POST",
                    headers: {
                        token: $localStorage.currentUser.tokenInfo.token
                    },
                    data: {
                        accessId: req.accessId || 0,
                        username: req.username,
                        password: req.password,
                        clientId: req.clientId,
                        clientSecret: req.clientSecret,
                    },
                })
                .success(function (response, status, headers) {
                    $localStorage.currentUser.tokenPBI = undefined;
                    service.login();
                    resolve(response);
                })
                .error(function (response, status, headers) {
                    reject(response);
                });
            });
        };

        // -- Login a plataforma powerBI
        service.login = function () {
            return new Promise(function (resolve, reject) {
                // -- Si hay tokenPBI verificar su expiración
                if($localStorage.currentUser.tokenPBI){
                    d = new Date();
                    if((new Date($localStorage.currentUser.tokenPBI.expiration)).getTime() >= d.getTime()){
                        resolve(true);
                    }
                }

                $http({
                    url: BaseUrl.path['URL_LOGIN_PWBI'],
                    method: 'POST',
                    headers: {
                        token: $localStorage.currentUser.tokenInfo.token
                    }
                })
                .success(function (response, status, headers) {
                    $localStorage.currentUser.tokenPBI = {
                        token: response.access_token,
                        expiration: new Date(Number(response.expires_on)*1000),
                    };
                    resolve(true);
                })
                .error(function (response, status, headers) {
                    reject(response);
                });
            });
        };

        // -- Obtener los grupos disponibles
        service.getGroups = function (req) {
            return new Promise(function (resolve, reject) {
                service.login()
                    .then(function() {
                        $http({
                            url: BaseUrl.path['URL_GRUPOS_PWBI'],
                            method: 'GET',
                            headers: {
                                token: $localStorage.currentUser.tokenInfo.token,
                                powerBiToken: $localStorage.currentUser.tokenPBI.token
                            }
                        })
                        .success(function (response, status, headers) {
                            resolve(response);
                        })
                        .error(function (response, status, headers) {
                            reject(response);
                        });
                    })
                    .catch(function (e){
                        console.log("error@PBIlogin");
                        console.log(e.msg);
                        reject(e);
                    });
            });
                
        };

        // -- Obtener los reportes disponibles
        service.getReports = function (req) {
            return new Promise(function (resolve, reject) {
                service.login()
                    .then(function() {
                        $http({
                            url: BaseUrl.urlPowerBIReports(req.groupId),
                            method: 'GET',
                            headers: {
                                token: $localStorage.currentUser.tokenInfo.token,
                                powerBiToken: $localStorage.currentUser.tokenPBI.token
                            }
                        })
                        .success(function (response, status, headers) {
                            resolve(response);
                        })
                        .error(function (response, status, headers) {
                            reject(response);
                        });
                    });
            });
        };

        // -- Obtener/validar token del reporte seleccionado
        service.getReportToken = function (req) {
            return new Promise(function (resolve, reject) {
                service.login()
                    .then(function() {
                        $http({
                            url: BaseUrl.urlPowerBIReportToken(req.groupId, req.reportId),
                            method: 'GET',
                            headers: {
                                token: $localStorage.currentUser.tokenInfo.token,
                                powerBiToken: $localStorage.currentUser.tokenPBI.token
                            }
                        })
                        .success(function (response, status, headers) {
                            resolve(response);
                        })
                        .error(function (response, status, headers) {
                            reject(response);
                        });
                    });
            });
        };

        return service;
    }