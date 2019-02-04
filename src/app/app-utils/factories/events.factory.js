angular
.module('dashboard')
.factory('EventsFactory', EventsFactory)

EventsFactory.$inject = ['$http', '$localStorage', 'BaseUrl'];

  function EventsFactory ($http, $localStorage, BaseUrl) {

    var service = {};

    service.getSummary = function(f) {
      f = f || {};
      var rQuery = f.query || '',
          rPage = f.page,
          rItemsPerPage = f.itemsPerPage,
          rSortBy = f.sortBy || 'criticality',
          rFilterBy = f.filterBy || '',
          rSort = f.sort || 'desc',
          rStartDate = f.startDate || (new Date(0)),
          rEndDate = f.endDate || (new Date(Date.now()));

          moment().local();
          rStartDate = moment(rStartDate).format();
          rEndDate = moment(rEndDate).format();

      return new Promise(function(resolve, reject){
        $http({
          url: BaseUrl.path['URL_EVENTS_SUMMARY'],
          method: 'GET',
          params: {
            query: rQuery,
            page: rPage,
            itemsPerPage: rItemsPerPage,
            sortBy: rSortBy,
            filterBy: rFilterBy,
            sort: rSort,
            startDate: rStartDate,
            endDate: rEndDate
          },
          headers: {
            token: $localStorage.currentUser.tokenInfo.token
          }
        })
        .success(function(response, status, headers){
          resolve({
            events: service.correctSummary(response.events),
            pagination: response.pagination
          });
        })
        .error(function(response, status, headers){
          reject(response);
        });
      });
    };

    service.correctSummary = function(summary) {
      var res = [];
      summary.forEach(function(e){

        var timestamp = moment(e.timestamp)
        
          res.push({
          id: e.id,
          fecha: timestamp.local().format('DD/MM/YYYY HH:mm:ss'),
          //hora: timestamp.local().format('HH:mm:ss'),
          tipo: e.labels[0] || '',
          criticidad: e.criticality,
          estadoCaso: e.caseStatus,
          parameters: e.eventBody ? e.eventBody.entry : undefined,
          estado: e.status,
          visto: e.checked,
          descripcionRegla: e.ruleDescription,
          descripcionReglaTooltip: '#'+e.ruleCode,//+':'+e.ruleDescription,
          nombreRegla: e.ruleName
        });
      });
      return res;
    };

    service.getRelatedEvents = function(id) {
      return new Promise(function(resolve, reject){
        $http({
          method: 'GET',
          url: BaseUrl.urlEventRelatedEvents(id),
          headers: {
            token: $localStorage.currentUser.tokenInfo.token
          }
        })
        .success(function(response, status, headers){
          resolve(service.correctRelatedEvents(response));
        })
        .error(function(response, status, headers){
          reject(response);
        });
      });
    };

    service.correctRelatedEvents = function(data) {
      var res = [];
      data.forEach(function(obj){
        var timestamp = moment(obj.timestamp);

        var params = [];

        obj.eventBody.entry.forEach(function(param){
          params.push({
            key: param.key,
            value: param.value
          });
        });

        res.push({
          id: obj.id,
          fecha: timestamp.format('DD/MM/YYYY'),
          hora: timestamp.format('HH:mm:ss'),
          tipo: obj.labels[0] || '',
          criticidad: obj.criticality,
          params: params
        });
      });
      return res;
    };

    service.checkEvent = function(c) {
        return new Promise(function(resolve, reject){
            $http({
                url: BaseUrl.urlCheckEvents(c.id),
                method: 'PUT',
                data: c,
                headers: {
                    token: $localStorage.currentUser.tokenInfo.token
                }
            })
                .success(function(response, status, headers){
                    resolve(service.correctSummary([response])[0]);
                })
                .error(function(response, status, headers){
                    reject(response);
                });
        });
    };

    return service;

  }