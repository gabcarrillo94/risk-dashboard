angular
.module('dashboard')
.factory('DashboardFactory', DashboardFactory)

DashboardFactory.$inject = ['$http', '$localStorage', 'BaseUrl']

function DashboardFactory($http, $localStorage, BaseUrl) {
    var service = {};

    service.getDashboard = function (startDate, endDate) {
        return new Promise(function (resolve, reject) {
            $http({
                url: BaseUrl.path['URL_DASHBOARD'],
                method: 'GET',
                params: {
                    startDate: encodeURI(startDate.toISOString()),
                    endDate: encodeURI(endDate.toISOString())
                },
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
    }

    return service;
}