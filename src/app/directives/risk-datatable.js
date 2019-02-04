(function() {
    'use strict';

    angular.module("dashboard")
        .directive('riskDatatable', function ($http, $localStorage, $sce, Paginator,$timeout, $interval, $httpParamSerializer) {
        return {
            scope:{
                id: "@?",
                tableCss: "@?",
                config: "=",
                fnClick: "=?",
                fnDblClick: "=?",
                toExcel : "=?",
                api: "=?",
                selected: "="
            },
            restrict: 'E',
            replace: 'true',
            templateUrl: "app/directives/risk-datatable.html",
            link: function (scope, elem, attr) {
                scope.columnTypes = {};
                scope.data = [];
                scope.api = {};
                scope.pagination = {rule: [1]};
                scope.visibleColumns = 0;
                //sortableOps
                scope.sortReverse  = false;
                scope.filters = {};
                scope.innerQuery = {};

                //configuraciones para los filtros de la grilla
                scope.defaultFilters = {
                    filter:[]
                };
                var existeCheckboxes = false;
                $.each(scope.config.columns, function(key, value){
                    //construir los filtros segun tipo
                    if(value.filterable!==undefined){
                        scope.filters[value.name] = {};
                        if(value.filterable.type==="number"){
                            scope.filters[value.name].min = "";
                            scope.filters[value.name].max = "";
                        }else if(value.filterable.type==="string"){
                            scope.filters[value.name].query = "";
                        }else if(value.filterable.type==="checkbox"){
                            existeCheckboxes = true;
                            scope.innerQuery[value.name]= "";
                            scope.defaultFilters.filter.push({name : value.name, checked: scope.config.filterDatasource.paramsDefault.checked || "" });
                        }
                    }
                    //ultima fila, buscar los filtros checkeados por defecto
                    if(scope.config.columns.length-1 === key){
                        if(existeCheckboxes){
                            var resolve = new Promise(function(resolve, reject){
                                $http({
                                    url: scope.config.filterDatasource.url,
                                    method: "POST",
                                    data: scope.defaultFilters.filter,
                                    headers: {
                                        token: $localStorage.currentUser.tokenInfo.token
                                    }
                                })
                                    .success(function(response, status, headers){
                                        //identificar checkbox por defecto
                                        if(response && response.filters!==undefined && response.filters.length>0){
                                            $.each(response.filters, function(key, value){
                                                $.each(value.filters, function(keyCheck, valueCheck){
                                                    scope.filters[value.name][valueCheck.name] = (valueCheck.checked==="true");
                                                });
                                            });
                                        }
                                        createWatchFilters();
                                    })
                                    .error(function(response, status, headers){
                                        createWatchFilters();
                                        reject(response);
                                    });
                            });
                        }else{
                            createWatchFilters();
                        }
                    }
                });

                function createWatchFilters(){
                    scope.$watch("filters", function(nval, oval){
                        if(nval){
                            scope.config.datasource.params.filterBy = JSON.stringify(nval || "{}");
                            scope.api.queryFilters();
                        }
                    },true);
                }

                scope.showFilter = function(query, value){
                    if(query!==undefined && query!==""){
                        if(value.indexOf(query)>=0){
                            return true;
                        }else{
                            return false;
                        }
                    }else{
                        return true;
                    }
                };

                scope.sort = function(column){
                    if(column.sortable){
                        scope.config.datasource.params.sort = (!scope.sortReverse) ? "asc" : "desc";
                        scope.sortReverse = !scope.sortReverse;
                        scope.config.datasource.params.sortBy = column.name;
                    }
                    scope.api.query();
                }
                
                scope.checkEvent = function(id) {
                    if (scope.selected.indexOf(id) !== -1) {
                        delete scope.selected[scope.selected.indexOf(id)];
                    }
                    else {
                        scope.selected.push(id)
                    }
                    
                    console.log(scope.selected)
                }

                /*COMMON API METHODS*/
                //Get data currently in grid
                scope.api.data = function(){
                    return scope.data;
                };


                /*REST API METHODS*/
                scope.api.query = function(){
                    if(scope.config.datasource.origin==="WS" || scope.config.datasource.origin==="WSS"){
                        scope.config.datasource.params.token = $localStorage.currentUser.tokenInfo.token;//required for validation
                        scope.websocket.send(JSON.stringify(scope.config.datasource.params));
                    }else if(scope.config.datasource.origin!=="ARRAY"){
                        queryREST();
                    }

                };

                //Uso solo para filtros, setea una pagina inicial, previo a ir a buscar la data.
                scope.api.queryFilters = function(){

                    scope.socketWatcher = $interval(function () {
                        scope.api.sendMessage();
                      }, 1000);
                    
                    if(scope.config.datasource.origin==="WS" || scope.config.datasource.origin==="WSS"){
                        
                       scope.config.datasource.params.page=1;
                       scope.config.datasource.params.token = $localStorage.currentUser.tokenInfo.token;//required for validation
                        
                       scope.api.sendMessage();
          
                     
                   }else if(scope.config.datasource.origin!=="ARRAY"){
                        queryREST();
                    }

               };

               scope.api.sendMessage = function(){

                   if(scope.websocket.readyState==1){
                      $interval.cancel(scope.socketWatcher);
                      scope.websocket.send(JSON.stringify(scope.config.datasource.params));
                  }

             }

                scope.api.filter = function(filters){
                    scope.config.datasource.params = filters || {};
                    scope.config.datasource.params.filterBy = JSON.stringify(scope.filters || "{}");
                    scope.api.query();
                };
                scope.api.filterExcel = function(filters){
                    scope.config.datasource.params = filters || {};
                    scope.config.datasource.params.filterBy = JSON.stringify(scope.filters || "{}");
                    //scope.api.query();
                };



                
                //Add element to grid
                scope.api.add = function(item){
                    if(item && Object.keys(item).length===scope.config.columns.length){
                        scope.data.add(item);
                        return 0;
                    }else{
                        console.error("Can't add the item, missing columns");
                        return -1;
                    }
                }

                //clean grid data
                scope.api.deleteAll = function(){
                    scope.data.remove();
                }
                 
                /*INNER API METHODS*/
                function fieldParser(type){
                    var func;
                    switch (type.toUpperCase()){
                        case "NUMBER":
                            func = function(number){
                                    return parseInt(number)
                                };
                            break;
                        case "DATE":
                            func = function(timestamp){
                                    return moment(timestamp).local().format('DD/MM/YYYY HH:mm:ss')
                                };
                            break
                        case "ARRAY":
                            func = function(arr){
                                //display array elements concated by ","
                                return (arr && arr.length>0) ? arr.join(", ") : "";
                            }
                            break;
                        default:
                            func= function(s){return s};
                            break;
                    }
                    return func;
                }

                function queryREST(){
                    var resolve = new Promise(function(resolve, reject){
                        $http({
                            url: scope.config.datasource.url,
                            method: scope.config.datasource.origin,
                            params: scope.config.datasource.params,
                            headers: {
                                token: $localStorage.currentUser.tokenInfo.token
                            }
                        })
                        .success(function(response, status, headers){
                            scope.data = parseResponse(response[scope.config.datasource.paramsOut.data]);
                            scope.pagination = response[scope.config.datasource.paramsOut.pagination];
                            scope.setPaginationRule();
                        })
                        .error(function(response, status, headers){
                            reject(response);
                        });
                    });
                }

                function parseResponse(data){
                    var res = [];
                    data.forEach(function(row){
                        var parsedRow = {};

                        for(var key in scope.columnTypes){
                            if(scope.columnTypes[key].type==="html"){
                                for(var ckey in scope.config.columns){
                                    if(scope.config.columns[ckey].name===key){
                                        //buscar una forma de transformar el string html en html
                                        row[key] = scope.config.columns[ckey].html;
                                    }
                                }
                            }
                        }
                        //parse data by column type, can throw errors
                        for(var key in row){
                            var parser = scope.columnTypes[key];
                            parsedRow[key] = (parser)? parser.call(row[key]) : row[key];
                        }

                        res.push(parsedRow);
                    });
                    return res;
                };

                /*Export to excel*/
                scope.exportExcel = function(){
                  var excel = scope.toExcel();
                  if(excel){
                      scope.api.downloadExcel(excel.filename, excel.data);
                  }
                };
                scope.api.downloadExcel = function(fileName, data) {

                    function datenum(v, date1904) {
                        if(date1904) v+=1462;
                        var epoch = Date.parse(v);
                        return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
                    };

                    function getSheet(data, opts) {
                        var ws = {};
                        var range = {s: {c:10000000, r:10000000}, e: {c:0, r:0 }};
                        for(var R = 0; R != data.length; ++R) {
                            for(var C = 0; C != data[R].length; ++C) {
                                if(range.s.r > R) range.s.r = R;
                                if(range.s.c > C) range.s.c = C;
                                if(range.e.r < R) range.e.r = R;
                                if(range.e.c < C) range.e.c = C;
                                var cell = {v: data[R][C] };
                                if(cell.v == null) continue;
                                var cell_ref = XLSX.utils.encode_cell({c:C,r:R});

                                if(typeof cell.v === 'number') cell.t = 'n';
                                else if(typeof cell.v === 'boolean') cell.t = 'b';
                                else if(cell.v instanceof Date) {
                                    cell.t = 'n'; cell.z = XLSX.SSF._table[14];
                                    cell.v = datenum(cell.v);
                                }
                                else cell.t = 's';

                                ws[cell_ref] = cell;
                            }
                        }
                        if(range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
                        return ws;
                    };

                    function Workbook() {
                        if(!(this instanceof Workbook)) return new Workbook();
                        this.SheetNames = [];
                        this.Sheets = {};
                    }

                    var wb = new Workbook(), ws = getSheet(data);
                    /* add worksheet to workbook */
                    wb.SheetNames.push(fileName);
                    wb.Sheets[fileName] = ws;
                    var wbout = XLSX.write(wb, {bookType:'xlsx', bookSST:true, type: 'binary'});

                    function s2ab(s) {
                        var buf = new ArrayBuffer(s.length);
                        var view = new Uint8Array(buf);
                        for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
                        return buf;
                    }

                    saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), fileName+'.xlsx');
                };

                /*Pagination*/
                scope.setPaginationRule = function() {
                              
                    scope.pagination.rule = Paginator.getPagesWindow(scope.pagination.totalRecords, scope.config.datasource.params.itemsPerPage, scope.config.datasource.params.page);
                };

                scope.goToPage = function(destiny) {
                    var totalPages = Math.ceil(scope.pagination.totalRecords/scope.config.datasource.params.itemsPerPage);
                    switch (destiny) {
                        case 'start':
                            scope.config.datasource.params.page = 1;
                            break;
                        case 'end':
                            scope.config.datasource.params.page = totalPages;
                            break;
                        case '1more':
                            scope.config.datasource.params.page++;
                            break;
                        case '1less':
                            scope.config.datasource.params.page--;
                            break;
                        default:
                            scope.config.datasource.params.page = destiny;
                    }
                    scope.api.query();
                };

                scope.showLessArrow = function() {
                    return scope.pagination.rule.length > 1 && scope.pagination.rule[0] != 1;
                };

                scope.showMoreArrow = function() {
                    return scope.pagination.rule.length > 1 && scope.pagination.rule[scope.pagination.rule.length-1] != Math.ceil(scope.pagination.totalRecords/scope.config.datasource.params.itemsPerPage);
                };

                /*WEBSOCKET CONFIG*/
                if(scope.config && scope.config.datasource && (scope.config.datasource.origin ==='WS' || scope.config.datasource.origin ==='WSS')){
                    scope.close=false;

                    scope.start = function() {
                        var url = scope.config.datasource.url;
                        var ws = "";
                        if(scope.config.datasource.origin==='WS')
                            ws = "ws://"+url;
                        else
                            ws= "wss://"+url;

                        var webSocket = new WebSocket(ws);
                        scope.config.datasource.params = scope.config.datasource.paramsDefault;
                        scope.config.datasource.params.token = $localStorage.currentUser.tokenInfo.token;

                        //Al abrir enviar KEY
                        webSocket.onopen = function(message){
                            console.log("Websocket: Comunicacion iniciada");
                            //se utiliza para esperar la construccion de los filtros asociados a la grilla
                            // if(scope.config.datasource.autoLoad===true) {
                                // console.log("Websocket: Comunicacion iniciada");
                                // webSocket.send(JSON.stringify(scope.config.datasource.params));
                            // }
                        };

                        webSocket.onerror = function(err){
                            console.log("Websocket error:");
                            console.log(err);
                        };

                        //Mensaje Recibido
                        webSocket.onmessage = function(message){
                            var data={};
                            try { data=JSON.parse(message.data); }
                            catch(err) {}
                            if (data!== undefined) {
                                scope.data = parseResponse(data[scope.config.datasource.paramsOut.data]);
                                scope.pagination = data[scope.config.datasource.paramsOut.pagination];
                                scope.setPaginationRule();
                                scope.$apply();
                            }
                        };
                        
                        //renovar la conexion cada 60 segundos
                        scope.interval = $interval(function(){
                            webSocket.send(JSON.stringify(scope.config.datasource.params));
                        }, 1000 * 60);

                        //Conexion cerrada
                        webSocket.onclose = function(message){
                            console.log("Conexión perdida");
                            $interval.cancel(scope.interval);
                            if (scope.close==false) {
                                $timeout(function() {
                                    console.log("Reanudando conexión");
                                    scope.websocket = scope.start();
                                }, 5000);
                            }
                        };
                        return webSocket;
                    };

                    // -- Inicia el Websocket
                    scope.websocket = scope.start();

                    // -- Cierra el WebSocket al destruir
                    scope.$on('$destroy', function() {
                        console.log("Websocket: Comunicacion cerrada");
                        scope.close=true;
                        scope.websocket.onclose("exit");
                        $interval.cancel(scope.interval);
                    });
                }

                /*INIT CONFIG*/
                if(scope.config){
                    // -- Identify parsers for each column of the grid
                    scope.visibleColumns = 0;
                    scope.config.columns.forEach(function(c){
                        scope.columnTypes[c.name] = {type:c.type, call: fieldParser(c.type)};
                        if(!c.hidden)
                            scope.visibleColumns++;
                    });

                    if(scope.config.datasource.autoLoad===true){
                        scope.api.filter(scope.config.datasource.paramsDefault);
                    }
                }
            }
        };
    });

})();