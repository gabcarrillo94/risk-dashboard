/* Servicio encargado de hacer las diversas validaciones en las distintas rutas
    del archivo index.route.js */

(function() {
    'use strict';
    
    angular
    .module('dashboard')
    .service('Alarmas', Alarmas)

    Alarmas.$inject = [];

    function Alarmas() {
        this.allAlarmas = allAlarmas;


        var data = [
        {
            "id": "",
            "fecha": "2016-04-02T06:55:08-07:00",
            "ejecutivo": "Gay Key",
            "descripcion": "ante ipsum primis in faucibus orci luctus et ultrices posuere"
        },
        {
            "id": "",
            "fecha": "2015-10-12T20:32:08-07:00",
            "ejecutivo": "Hillary Cabrera",
            "descripcion": "semper erat, in consectetuer ipsum nunc id enim. Curabitur massa."
        },
        {
            "id": "",
            "fecha": "2016-05-12T03:07:48-07:00",
            "ejecutivo": "Iris Burks",
            "descripcion": "metus urna convallis erat, eget tincidunt dui augue eu tellus."
        },
        {
            "id": "",
            "fecha": "2016-02-11T11:05:11-08:00",
            "ejecutivo": "Orla Levy",
            "descripcion": "vitae risus. Duis a mi fringilla mi lacinia mattis. Integer"
        },
        {
            "id": "",
            "fecha": "2015-09-07T23:08:05-07:00",
            "ejecutivo": "Phoebe Moody",
            "descripcion": "dolor. Nulla semper tellus id nunc interdum feugiat. Sed nec"
        },
        {
            "id": "",
            "fecha": "2015-12-24T03:04:50-08:00",
            "ejecutivo": "Ivan Barber",
            "descripcion": "nisi a odio semper cursus. Integer mollis. Integer tincidunt aliquam"
        },
        {
            "id": "",
            "fecha": "2016-01-12T20:42:53-08:00",
            "ejecutivo": "Victor Barron",
            "descripcion": "lectus. Nullam suscipit, est ac facilisis facilisis, magna tellus faucibus"
        },
        {
            "id": "",
            "fecha": "2015-08-04T02:09:16-07:00",
            "ejecutivo": "Ina Phillips",
            "descripcion": "blandit enim consequat purus. Maecenas libero est, congue a, aliquet"
        },
        {
            "id": "",
            "fecha": "2015-09-24T16:16:10-07:00",
            "ejecutivo": "Eugenia Marsh",
            "descripcion": "egestas. Aliquam fringilla cursus purus. Nullam scelerisque neque sed sem"
        },
        {
            "id": "",
            "fecha": "2016-04-13T14:40:13-07:00",
            "ejecutivo": "Oliver Sellers",
            "descripcion": "risus. Donec nibh enim, gravida sit amet, dapibus id, blandit"
        },
        {
            "id": "",
            "fecha": "2016-04-29T01:52:44-07:00",
            "ejecutivo": "Dana Hodges",
            "descripcion": "Nullam lobortis quam a felis ullamcorper viverra. Maecenas iaculis aliquet"
        },
        {
            "id": "",
            "fecha": "2015-08-28T07:42:23-07:00",
            "ejecutivo": "Chaim Stevenson",
            "descripcion": "gravida non, sollicitudin a, malesuada id, erat. Etiam vestibulum massa"
        },
        {
            "id": "",
            "fecha": "2016-03-03T10:24:19-08:00",
            "ejecutivo": "Justine Madden",
            "descripcion": "purus, in molestie tortor nibh sit amet orci. Ut sagittis"
        },
        {
            "id": "",
            "fecha": "2016-02-10T03:45:46-08:00",
            "ejecutivo": "Brennan Wise",
            "descripcion": "diam at pretium aliquet, metus urna convallis erat, eget tincidunt"
        },
        {
            "id": "",
            "fecha": "2015-07-04T21:25:50-07:00",
            "ejecutivo": "Robin Pitts",
            "descripcion": "eu turpis. Nulla aliquet. Proin velit. Sed malesuada augue ut"
        },
        {
            "id": "",
            "fecha": "2016-02-17T22:49:48-08:00",
            "ejecutivo": "Janna Crawford",
            "descripcion": "dolor quam, elementum at, egestas a, scelerisque sed, sapien. Nunc"
        },
        {
            "id": "",
            "fecha": "2016-04-29T19:40:19-07:00",
            "ejecutivo": "Meghan Brown",
            "descripcion": "mi pede, nonummy ut, molestie in, tempus eu, ligula. Aenean"
        },
        {
            "id": "",
            "fecha": "2016-04-16T09:03:12-07:00",
            "ejecutivo": "Lani Marshall",
            "descripcion": "velit in aliquet lobortis, nisi nibh lacinia orci, consectetuer euismod"
        },
        {
            "id": "",
            "fecha": "2016-04-09T21:01:18-07:00",
            "ejecutivo": "Carson Levine",
            "descripcion": "eleifend non, dapibus rutrum, justo. Praesent luctus. Curabitur egestas nunc"
        },
        {
            "id": "",
            "fecha": "2016-01-29T04:35:31-08:00",
            "ejecutivo": "India Langley",
            "descripcion": "Nam consequat dolor vitae dolor. Donec fringilla. Donec feugiat metus"
        },
        {
            "id": "",
            "fecha": "2016-05-08T16:56:32-07:00",
            "ejecutivo": "Jeanette English",
            "descripcion": "nec, mollis vitae, posuere at, velit. Cras lorem lorem, luctus"
        },
        {
            "id": "",
            "fecha": "2015-07-23T00:52:39-07:00",
            "ejecutivo": "Emma Wilson",
            "descripcion": "aliquam adipiscing lacus. Ut nec urna et arcu imperdiet ullamcorper."
        },
        {
            "id": "",
            "fecha": "2015-08-10T05:08:01-07:00",
            "ejecutivo": "Isabelle Conway",
            "descripcion": "sed tortor. Integer aliquam adipiscing lacus. Ut nec urna et"
        },
        {
            "id": "",
            "fecha": "2016-04-30T21:59:58-07:00",
            "ejecutivo": "Fay Burch",
            "descripcion": "vestibulum nec, euismod in, dolor. Fusce feugiat. Lorem ipsum dolor"
        },
        {
            "id": "",
            "fecha": "2015-07-31T03:20:08-07:00",
            "ejecutivo": "Quentin Guzman",
            "descripcion": "sapien, cursus in, hendrerit consectetuer, cursus et, magna. Praesent interdum"
        },
        {
            "id": "",
            "fecha": "2015-10-24T05:38:04-07:00",
            "ejecutivo": "Ann Freeman",
            "descripcion": "augue scelerisque mollis. Phasellus libero mauris, aliquam eu, accumsan sed,"
        },
        {
            "id": "",
            "fecha": "2015-06-23T22:12:25-07:00",
            "ejecutivo": "Veda Rodriquez",
            "descripcion": "Phasellus vitae mauris sit amet lorem semper auctor. Mauris vel"
        },
        {
            "id": "",
            "fecha": "2015-06-14T10:20:19-07:00",
            "ejecutivo": "Sylvester Flynn",
            "descripcion": "erat neque non quam. Pellentesque habitant morbi tristique senectus et"
        },
        {
            "id": "",
            "fecha": "2015-09-29T23:39:37-07:00",
            "ejecutivo": "Anastasia Finley",
            "descripcion": "adipiscing lobortis risus. In mi pede, nonummy ut, molestie in,"
        },
        {
            "id": "",
            "fecha": "2015-10-29T10:09:15-07:00",
            "ejecutivo": "Roth Wise",
            "descripcion": "amet ante. Vivamus non lorem vitae odio sagittis semper. Nam"
        },
        {
            "id": "",
            "fecha": "2016-04-15T03:52:07-07:00",
            "ejecutivo": "Theodore Romero",
            "descripcion": "erat nonummy ultricies ornare, elit elit fermentum risus, at fringilla"
        },
        {
            "id": "",
            "fecha": "2016-02-08T14:02:49-08:00",
            "ejecutivo": "Jakeem Hammond",
            "descripcion": "nonummy ac, feugiat non, lobortis quis, pede. Suspendisse dui. Fusce"
        },
        {
            "id": "",
            "fecha": "2015-07-18T16:54:57-07:00",
            "ejecutivo": "Haviva Robertson",
            "descripcion": "aliquet, metus urna convallis erat, eget tincidunt dui augue eu"
        },
        {
            "id": "",
            "fecha": "2016-04-08T00:16:48-07:00",
            "ejecutivo": "Ryder Monroe",
            "descripcion": "sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus"
        },
        {
            "id": "",
            "fecha": "2016-04-13T19:46:51-07:00",
            "ejecutivo": "Murphy Hardin",
            "descripcion": "nunc nulla vulputate dui, nec tempus mauris erat eget ipsum."
        },
        {
            "id": "",
            "fecha": "2015-10-23T23:32:28-07:00",
            "ejecutivo": "Keelie Montoya",
            "descripcion": "Ut sagittis lobortis mauris. Suspendisse aliquet molestie tellus. Aenean egestas"
        },
        {
            "id": "",
            "fecha": "2015-10-25T07:31:06-07:00",
            "ejecutivo": "Melanie Clark",
            "descripcion": "dictum placerat, augue. Sed molestie. Sed id risus quis diam"
        },
        {
            "id": "",
            "fecha": "2015-09-28T17:26:21-07:00",
            "ejecutivo": "Lev Shaffer",
            "descripcion": "dui nec urna suscipit nonummy. Fusce fermentum fermentum arcu. Vestibulum"
        },
        {
            "id": "",
            "fecha": "2016-01-12T09:37:59-08:00",
            "ejecutivo": "Brooke Mitchell",
            "descripcion": "fames ac turpis egestas. Aliquam fringilla cursus purus. Nullam scelerisque"
        },
        {
            "id": "",
            "fecha": "2016-01-03T17:46:28-08:00",
            "ejecutivo": "Emmanuel Bass",
            "descripcion": "sapien molestie orci tincidunt adipiscing. Mauris molestie pharetra nibh. Aliquam"
        },
        {
            "id": "",
            "fecha": "2016-01-21T09:43:54-08:00",
            "ejecutivo": "Gail Clark",
            "descripcion": "pharetra, felis eget varius ultrices, mauris ipsum porta elit, a"
        },
        {
            "id": "",
            "fecha": "2016-03-29T05:35:19-07:00",
            "ejecutivo": "Dante Pratt",
            "descripcion": "fermentum arcu. Vestibulum ante ipsum primis in faucibus orci luctus"
        },
        {
            "id": "",
            "fecha": "2015-07-04T15:04:05-07:00",
            "ejecutivo": "Lesley Hensley",
            "descripcion": "eu, euismod ac, fermentum vel, mauris. Integer sem elit, pharetra"
        },
        {
            "id": "",
            "fecha": "2016-01-25T19:04:27-08:00",
            "ejecutivo": "Sopoline Sears",
            "descripcion": "vitae, aliquet nec, imperdiet nec, leo. Morbi neque tellus, imperdiet"
        },
        {
            "id": "",
            "fecha": "2016-04-13T21:22:55-07:00",
            "ejecutivo": "Basil Howard",
            "descripcion": "sed leo. Cras vehicula aliquet libero. Integer in magna. Phasellus"
        },
        {
            "id": "",
            "fecha": "2015-07-21T10:15:02-07:00",
            "ejecutivo": "Willow Richmond",
            "descripcion": "sem, consequat nec, mollis vitae, posuere at, velit. Cras lorem"
        },
        {
            "id": "",
            "fecha": "2015-09-04T05:19:42-07:00",
            "ejecutivo": "Keefe Fulton",
            "descripcion": "ut, sem. Nulla interdum. Curabitur dictum. Phasellus in felis. Nulla"
        },
        {
            "id": "",
            "fecha": "2015-11-05T10:03:53-08:00",
            "ejecutivo": "Charde Oneil",
            "descripcion": "et malesuada fames ac turpis egestas. Fusce aliquet magna a"
        },
        {
            "id": "",
            "fecha": "2015-08-09T01:51:06-07:00",
            "ejecutivo": "Damon Bell",
            "descripcion": "et tristique pellentesque, tellus sem mollis dui, in sodales elit"
        },
        {
            "id": "",
            "fecha": "2015-07-26T01:39:51-07:00",
            "ejecutivo": "Scarlet Gray",
            "descripcion": "rhoncus id, mollis nec, cursus a, enim. Suspendisse aliquet, sem"
        },
        {
            "id": "",
            "fecha": "2015-10-02T16:56:51-07:00",
            "ejecutivo": "Derek Ashley",
            "descripcion": "convallis erat, eget tincidunt dui augue eu tellus. Phasellus elit"
        },
        {
            "id": "",
            "fecha": "2015-06-16T09:06:15-07:00",
            "ejecutivo": "Isaiah Phelps",
            "descripcion": "libero mauris, aliquam eu, accumsan sed, facilisis vitae, orci. Phasellus"
        },
        {
            "id": "",
            "fecha": "2015-09-17T17:02:52-07:00",
            "ejecutivo": "Forrest Collier",
            "descripcion": "tempus, lorem fringilla ornare placerat, orci lacus vestibulum lorem, sit"
        },
        {
            "id": "",
            "fecha": "2015-11-25T16:27:15-08:00",
            "ejecutivo": "Rhiannon Medina",
            "descripcion": "Fusce dolor quam, elementum at, egestas a, scelerisque sed, sapien."
        },
        {
            "id": "",
            "fecha": "2015-08-17T02:33:36-07:00",
            "ejecutivo": "Sophia Cook",
            "descripcion": "augue id ante dictum cursus. Nunc mauris elit, dictum eu,"
        },
        {
            "id": "",
            "fecha": "2015-06-14T17:06:12-07:00",
            "ejecutivo": "Bell Clements",
            "descripcion": "ante blandit viverra. Donec tempus, lorem fringilla ornare placerat, orci"
        },
        {
            "id": "",
            "fecha": "2015-08-21T15:06:37-07:00",
            "ejecutivo": "Jolie Garrett",
            "descripcion": "semper auctor. Mauris vel turpis. Aliquam adipiscing lobortis risus. In"
        },
        {
            "id": "",
            "fecha": "2016-01-03T02:59:47-08:00",
            "ejecutivo": "Taylor Bradley",
            "descripcion": "eu, odio. Phasellus at augue id ante dictum cursus. Nunc"
        },
        {
            "id": "",
            "fecha": "2015-07-25T05:25:54-07:00",
            "ejecutivo": "Zoe Walker",
            "descripcion": "Ut semper pretium neque. Morbi quis urna. Nunc quis arcu"
        },
        {
            "id": "",
            "fecha": "2015-09-28T22:42:53-07:00",
            "ejecutivo": "Ronan Good",
            "descripcion": "neque sed sem egestas blandit. Nam nulla magna, malesuada vel,"
        },
        {
            "id": "",
            "fecha": "2015-12-20T17:43:51-08:00",
            "ejecutivo": "Lewis Griffin",
            "descripcion": "et magnis dis parturient montes, nascetur ridiculus mus. Donec dignissim"
        },
        {
            "id": "",
            "fecha": "2016-02-19T02:00:11-08:00",
            "ejecutivo": "Nicole Watson",
            "descripcion": "mollis. Duis sit amet diam eu dolor egestas rhoncus. Proin"
        },
        {
            "id": "",
            "fecha": "2015-08-22T13:16:32-07:00",
            "ejecutivo": "Alika Rivers",
            "descripcion": "urna. Ut tincidunt vehicula risus. Nulla eget metus eu erat"
        },
        {
            "id": "",
            "fecha": "2016-05-05T23:00:51-07:00",
            "ejecutivo": "Demetria Wilder",
            "descripcion": "sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus"
        },
        {
            "id": "",
            "fecha": "2015-05-23T06:57:47-07:00",
            "ejecutivo": "Hadley Lindsay",
            "descripcion": "faucibus. Morbi vehicula. Pellentesque tincidunt tempus risus. Donec egestas. Duis"
        },
        {
            "id": "",
            "fecha": "2015-10-18T02:04:23-07:00",
            "ejecutivo": "Noah Hudson",
            "descripcion": "sapien. Aenean massa. Integer vitae nibh. Donec est mauris, rhoncus"
        },
        {
            "id": "",
            "fecha": "2016-01-19T05:28:07-08:00",
            "ejecutivo": "Amanda Harmon",
            "descripcion": "ac, eleifend vitae, erat. Vivamus nisi. Mauris nulla. Integer urna."
        },
        {
            "id": "",
            "fecha": "2016-02-26T14:57:04-08:00",
            "ejecutivo": "Azalia Gates",
            "descripcion": "aliquet. Proin velit. Sed malesuada augue ut lacus. Nulla tincidunt,"
        },
        {
            "id": "",
            "fecha": "2015-08-11T10:27:36-07:00",
            "ejecutivo": "Rudyard Suarez",
            "descripcion": "hendrerit id, ante. Nunc mauris sapien, cursus in, hendrerit consectetuer,"
        },
        {
            "id": "",
            "fecha": "2015-07-17T19:52:56-07:00",
            "ejecutivo": "Rudyard Mann",
            "descripcion": "eu odio tristique pharetra. Quisque ac libero nec ligula consectetuer"
        },
        {
            "id": "",
            "fecha": "2015-11-05T01:39:28-08:00",
            "ejecutivo": "Wallace Drake",
            "descripcion": "ullamcorper magna. Sed eu eros. Nam consequat dolor vitae dolor."
        },
        {
            "id": "",
            "fecha": "2015-11-22T17:58:06-08:00",
            "ejecutivo": "Hilary Gill",
            "descripcion": "sed, sapien. Nunc pulvinar arcu et pede. Nunc sed orci"
        },
        {
            "id": "",
            "fecha": "2015-07-04T04:24:29-07:00",
            "ejecutivo": "Cullen Roach",
            "descripcion": "diam nunc, ullamcorper eu, euismod ac, fermentum vel, mauris. Integer"
        },
        {
            "id": "",
            "fecha": "2015-07-18T03:56:11-07:00",
            "ejecutivo": "Kieran Rodriquez",
            "descripcion": "diam. Proin dolor. Nulla semper tellus id nunc interdum feugiat."
        },
        {
            "id": "",
            "fecha": "2015-07-28T14:47:27-07:00",
            "ejecutivo": "Fletcher Thomas",
            "descripcion": "eget magna. Suspendisse tristique neque venenatis lacus. Etiam bibendum fermentum"
        },
        {
            "id": "",
            "fecha": "2015-11-24T06:07:02-08:00",
            "ejecutivo": "Lyle Kidd",
            "descripcion": "erat. Sed nunc est, mollis non, cursus non, egestas a,"
        },
        {
            "id": "",
            "fecha": "2015-08-08T17:56:49-07:00",
            "ejecutivo": "Ori Moses",
            "descripcion": "ipsum primis in faucibus orci luctus et ultrices posuere cubilia"
        },
        {
            "id": "",
            "fecha": "2016-02-03T20:29:12-08:00",
            "ejecutivo": "Ronan Henson",
            "descripcion": "sem, vitae aliquam eros turpis non enim. Mauris quis turpis"
        },
        {
            "id": "",
            "fecha": "2015-07-27T06:30:08-07:00",
            "ejecutivo": "Yasir Johnson",
            "descripcion": "eget metus eu erat semper rutrum. Fusce dolor quam, elementum"
        },
        {
            "id": "",
            "fecha": "2015-10-22T06:15:25-07:00",
            "ejecutivo": "Levi Jenkins",
            "descripcion": "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices"
        },
        {
            "id": "",
            "fecha": "2015-11-10T02:11:54-08:00",
            "ejecutivo": "Harriet Castaneda",
            "descripcion": "Quisque ornare tortor at risus. Nunc ac sem ut dolor"
        },
        {
            "id": "",
            "fecha": "2016-04-12T13:25:18-07:00",
            "ejecutivo": "Jasmine Camacho",
            "descripcion": "molestie arcu. Sed eu nibh vulputate mauris sagittis placerat. Cras"
        },
        {
            "id": "",
            "fecha": "2015-06-09T12:56:02-07:00",
            "ejecutivo": "Merritt Travis",
            "descripcion": "at, egestas a, scelerisque sed, sapien. Nunc pulvinar arcu et"
        },
        {
            "id": "",
            "fecha": "2016-01-23T15:13:07-08:00",
            "ejecutivo": "Carly Simpson",
            "descripcion": "placerat eget, venenatis a, magna. Lorem ipsum dolor sit amet,"
        },
        {
            "id": "",
            "fecha": "2016-02-13T20:27:55-08:00",
            "ejecutivo": "Laurel Gamble",
            "descripcion": "malesuada vel, venenatis vel, faucibus id, libero. Donec consectetuer mauris"
        },
        {
            "id": "",
            "fecha": "2015-11-30T21:10:19-08:00",
            "ejecutivo": "Chandler Higgins",
            "descripcion": "mollis. Integer tincidunt aliquam arcu. Aliquam ultrices iaculis odio. Nam"
        },
        {
            "id": "",
            "fecha": "2015-12-31T09:19:32-08:00",
            "ejecutivo": "Bruce Hamilton",
            "descripcion": "diam eu dolor egestas rhoncus. Proin nisl sem, consequat nec,"
        },
        {
            "id": "",
            "fecha": "2016-02-18T04:49:13-08:00",
            "ejecutivo": "Amethyst Griffith",
            "descripcion": "id, mollis nec, cursus a, enim. Suspendisse aliquet, sem ut"
        },
        {
            "id": "",
            "fecha": "2015-08-07T06:04:38-07:00",
            "ejecutivo": "Driscoll Barber",
            "descripcion": "elit elit fermentum risus, at fringilla purus mauris a nunc."
        },
        {
            "id": "",
            "fecha": "2016-02-05T04:20:43-08:00",
            "ejecutivo": "Jasmine Quinn",
            "descripcion": "luctus vulputate, nisi sem semper erat, in consectetuer ipsum nunc"
        },
        {
            "id": "",
            "fecha": "2015-09-06T22:48:48-07:00",
            "ejecutivo": "Stephanie Hurst",
            "descripcion": "Mauris eu turpis. Nulla aliquet. Proin velit. Sed malesuada augue"
        },
        {
            "id": "",
            "fecha": "2015-11-09T14:23:04-08:00",
            "ejecutivo": "Austin Mack",
            "descripcion": "est, vitae sodales nisi magna sed dui. Fusce aliquam, enim"
        },
        {
            "id": "",
            "fecha": "2015-09-28T08:10:30-07:00",
            "ejecutivo": "Marshall Mendez",
            "descripcion": "molestie tortor nibh sit amet orci. Ut sagittis lobortis mauris."
        },
        {
            "id": "",
            "fecha": "2016-03-24T00:55:10-07:00",
            "ejecutivo": "Jaime Nolan",
            "descripcion": "sed, sapien. Nunc pulvinar arcu et pede. Nunc sed orci"
        },
        {
            "id": "",
            "fecha": "2015-07-05T15:30:12-07:00",
            "ejecutivo": "Ora Henderson",
            "descripcion": "Donec porttitor tellus non magna. Nam ligula elit, pretium et,"
        },
        {
            "id": "",
            "fecha": "2016-02-16T12:21:22-08:00",
            "ejecutivo": "Ayanna Alford",
            "descripcion": "Nunc pulvinar arcu et pede. Nunc sed orci lobortis augue"
        },
        {
            "id": "",
            "fecha": "2015-10-15T02:07:38-07:00",
            "ejecutivo": "Drew Knight",
            "descripcion": "ac mattis semper, dui lectus rutrum urna, nec luctus felis"
        },
        {
            "id": "",
            "fecha": "2015-12-31T20:29:33-08:00",
            "ejecutivo": "Owen Vaughan",
            "descripcion": "vulputate, posuere vulputate, lacus. Cras interdum. Nunc sollicitudin commodo ipsum."
        },
        {
            "id": "",
            "fecha": "2015-07-25T13:55:15-07:00",
            "ejecutivo": "Nash Le",
            "descripcion": "nibh lacinia orci, consectetuer euismod est arcu ac orci. Ut"
        },
        {
            "id": "",
            "fecha": "2015-11-28T07:29:46-08:00",
            "ejecutivo": "Shana Mcintosh",
            "descripcion": "non, luctus sit amet, faucibus ut, nulla. Cras eu tellus"
        }]
        
        function allAlarmas() {
            return data;
        }
    }
})();