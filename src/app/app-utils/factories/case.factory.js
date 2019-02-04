angular
.module('dashboard')
.factory('CaseFactory', CaseFactory)

CaseFactory.$inject = ['$http', '$state', '$localStorage', 'BaseUrl'];
    function CaseFactory($http, $state, $localStorage, BaseUrl) {
        var service = {};

        // Cases
        service.createCase = function (c) {
            return new Promise(function (resolve, reject) {
                $http({
                    url: BaseUrl.path['URL_CASES_CREATE'],
                    method: 'POST',
                    data: c,
                    headers: {
                        token: $localStorage.currentUser.tokenInfo.token
                    }
                }).success(function (response, status, headers) {
                    resolve(response);
                })
                        .error(function (response, status, headers) {
                            reject(response);
                        });
            });
        };
        
        service.deleteEvent = function (c) {
            return new Promise(function (resolve, reject) {
                $http({
                    url: BaseUrl.path['URL_COMMENT_LIST'] + '/' + c.id + '/events/' + c.eventId,
                    method: 'DELETE',
                    headers: {
                        token: $localStorage.currentUser.tokenInfo.token
                    }
                })
                .success(function (response, status, headers) {
                    resolve(true);
                })
                .error(function (response, status, headers) {
                    reject(response);
                });
            });
        };
        
        service.upsertCase = function (c) {
            return new Promise(function (resolve, reject) {
                $http({
                    url: BaseUrl.path['URL_CASES_CREATE'] + '/' + c.id,
                    method: 'PUT',
                    data: c,
                    headers: {
                        token: $localStorage.currentUser.tokenInfo.token
                    }
                })
                        .success(function (response, status, headers) {
                            resolve(service.correctSummary([response])[0]);
                        })
                        .error(function (response, status, headers) {
                            reject(response);
                        });
            });
        };
        
        // Comments
        service.createComment = function (c) {
            return new Promise(function (resolve, reject) {
                $http({
                    url: BaseUrl.path['URL_COMMENT_LIST'] + '/' + c.id + '/createComment',
                    method: 'POST',
                    data: c,
                    headers: {
                        token: $localStorage.currentUser.tokenInfo.token
                    }
                }).success(function (response, status, headers) {
                    resolve(response);
                })
                .error(function (response, status, headers) {
                    reject(response);
                });
            });
        };
        
        service.getComments = function (id) {
            return new Promise(function (resolve, reject) {
                $http({
                    url: BaseUrl.path['URL_COMMENT_LIST'] + '/' + id + '/comments',
                    method: 'GET',
                    headers: {
                        token: $localStorage.currentUser.tokenInfo.token
                    }
                }).success(function (response, status, headers) {
                    resolve(response);
                }).error(function (response, status, headers) {
                    reject(response);
                });
            });
        };
        
        service.uploadComment = function (c) {
            return new Promise(function (resolve, reject) {
                $http({
                    url: BaseUrl.path['URL_COMMENT_LIST'] + '/' + c.id + '/updateComment/' + c.caseId,
                    method: 'PUT',
                    data: c,
                    headers: {
                        token: $localStorage.currentUser.tokenInfo.token
                    }
                })
                .success(function (response, status, headers) {
                    resolve(true);
                })
                .error(function (response, status, headers) {
                    reject(response);
                });
            });
        };
        
        service.deleteComment = function (c) {
            return new Promise(function (resolve, reject) {
                $http({
                    url: BaseUrl.path['URL_COMMENT_LIST'] + '/' + c.caseId + '/deleteComment/' + c.id,
                    method: 'PUT',
                    data: c,
                    headers: {
                        token: $localStorage.currentUser.tokenInfo.token
                    }
                })
                .success(function (response, status, headers) {
                    resolve(true);
                })
                .error(function (response, status, headers) {
                    reject(response);
                });
            });
        };
        
        // Files
        service.getFiles = function (c) {
            return new Promise(function (resolve, reject) {
                $http({
                    url: BaseUrl.path['URL_UP_FILE'] + '/' + c.id + '/file',
                    method: 'GET',
                    headers: {
                        token: $localStorage.currentUser.tokenInfo.token
                    }
                }).success(function (response, status, headers) {
                    resolve(response);
                })
                .error(function (response, status, headers) {
                    reject(response);
                });
            });
        };
        
        service.uploadFile = function (c) {
            return new Promise(function (resolve, reject) {
                $http({
                    url: BaseUrl.path['URL_UP_FILE'] + '/' + c.id,
                    method: 'POST',
                    data: c,
                    headers: {
                        token: $localStorage.currentUser.tokenInfo.token
                    }
                }).success(function (response, status, headers) {
                    resolve(response);
                })
                .error(function (response, status, headers) {
                    reject(response);
                });
            });
        };
        
        service.downloadFile = function (c) {
            return new Promise(function (resolve, reject) {
                $http({
                    url: BaseUrl.path['URL_UP_FILE'] + '/' + c.id + '/download',
                    method: 'GET',
                    data: c,
                    headers: {
                        token: $localStorage.currentUser.tokenInfo.token
                    }
                }).success(function (response, status, headers) {
                    resolve(response);
                })
                .error(function (response, status, headers) {
                    reject(response);
                });
            });
        };
        
        service.deleteFile = function (c) {
            return new Promise(function (resolve, reject) {
                $http({
                    url: BaseUrl.path['URL_COMMENT_LIST'] + '/' + c.caseId + '/file/' + c.id,
                    method: 'PUT',
                    data: c,
                    headers: {
                        token: $localStorage.currentUser.tokenInfo.token
                    }
                })
                .success(function (response, status, headers) {
                    resolve(true);
                })
                .error(function (response, status, headers) {
                    reject(response);
                });
            });
        };

        // Events
        service.getRelatedEvents = function (id) {
            return new Promise(function (resolve, reject) {
                $http({
                    url: BaseUrl.urlCaseRelatedEvents(id),
                    method: 'GET',
                    params: {
                        id: id
                    },
                    headers: {
                        token: $localStorage.currentUser.tokenInfo.token
                    }
                })
                        .success(function (response, status, headers) {
                            resolve(service.correctRelatedEvents(response));
                        })
                        .error(function (response, status, headers) {
                            reject(response);
                        });
            });
        };

        service.upsertEvents = function (id, newEvents, done) {
            var add = [];
            var rem = [];
            service.getRelatedEvents(id).then(function (rEvents) {
                Object.keys(newEvents).forEach(function (ne) {
                    var found = false;
                    rEvents.forEach(function (re) {
                        if (re.id == ne) {
                            found = true;
                        }
                    });
                    if (found && !newEvents[ne]) {
                        rem.push(ne);
                    }
                    if (!found && newEvents[ne]) {
                        add.push(ne);
                    }
                });
                var promises = [];

                promises.push(new Promise(function (resolve, reject) {
                    var addArr = [];
                    add.forEach(function (a) {
                        addArr.push({eventId: a});
                    });
                    $http({
                        url: BaseUrl.urlCaseRelatedEvents(id),
                        method: 'POST',
                        data: addArr,
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
                }));

                rem.forEach(function (r) {
                    promises.push(new Promise(function (resolve, reject) {
                        $http({
                            url: BaseUrl.urlCaseRelatedEvents(id) + '/' + r,
                            method: 'DELETE',
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
                    }));
                });

                Promise.all(promises).then(function (responses) {
                    done(responses);
                });

            });

        };

        service.correctRelatedEvents = function (summary) {
            var res = [];
            summary.forEach(function (e) {

                var timestamp = moment(e.timestamp)

                res.push({
                    id: e.id,
                    fecha: timestamp.format('DD/MM/YYYY'),
                    hora: timestamp.format('HH:mm:ss'),
                    tipo: e.labels[0] || '',
                    criticidad: e.criticality,
                    estadoCaso: e.caseStatus
                });
            });
            return res;
        };

        // Summary
        service.getSummary = function (f) {
            f = f || {};
            var rQuery = f.query || '',
                    rPage = f.page || 1,
                    rItemsPerPage = f.itemsPerPage || 20,
                    rSortBy = f.sortBy,
                    rSort = f.sort || 'desc',
                    rStartDate = f.startDate || (new Date(0)).toISOString(),
                    rEndDate = f.endDate || (new Date(Date.now())).toISOString();

            rStartDate = moment(rStartDate).toISOString();
            rEndDate = moment(rEndDate).toISOString();

            return new Promise(function (resolve, reject) {
                $http({
                    url: BaseUrl.path['URL_CASES_SUMMARY'],
                    method: 'GET',
                    params: {
                        query: rQuery,
                        page: rPage,
                        itemsPerPage: rItemsPerPage,
                        sortBy: rSortBy,
                        sort: rSort,
                        startDate: rStartDate,
                        endDate: rEndDate
                    },
                    headers: {
                        token: $localStorage.currentUser.tokenInfo.token
                    }
                })
                        .success(function (response, status, headers) {
                            resolve({
                                cases: service.correctSummary(response.cases),
                                pagination: response.pagination
                            });
                        })
                        .error(function (response, status, headers) {
                            reject(response);
                        });
            });
        };

        service.correctSummary = function (summary) {
            var res = [];
            summary.forEach(function (e) {

                var timestamp = moment(e.creationDate);

                res.push({
                    id: e.caseId,
                    titulo: e.title,
                    descripcion: e.description,
                    estado: e.state,
                    fecha: timestamp.format('DD/MM/YYYY'),
                    hora: timestamp.format('HH:mm:ss'),
                    criticidad: e.criticality,
                    usuario: {
                        id: e.user.userId,
                        username: e.user.username,
                        email: e.user.email,
                        nombre: e.user.name
                    }
                });
            });
            return res;
        };
        return service;
    }