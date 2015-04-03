//Generate Test Data
var config = require('../../config');
require('mongoose').connect(config.databaseURL);
var uuid = require('node-uuid');
var bcrypt = require('bcryptjs');

var Manga = require('../../models/manga');
var Group = require('../../models/group');
var User = require('../../models/user');

const NUMBER_OF_ADMINISTRATOR = 1;
const NUMBER_OF_MODERATOR = 10;
const NUMBER_OF_USERS = 100;

const NUMBER_OF_MANGA = 10;

const PATHS = [
    '/mangas'
]

const METHODS = [
    'GET',
    'POST',
    'PUT',
    'DELETE'
];

generateManga(NUMBER_OF_MANGA);

generateGroup('administrators', NUMBER_OF_ADMINISTRATOR, function(group, callback){
    group.access = [];
    for(var i = 0;i<PATHS.length;i++){
        for(var j = 0;j<METHODS.length;j++){
            group.access.push({
                path:PATHS[i],
                method:METHODS[i]
            });
        }
    }
    callback();
});
generateGroup('moderators', NUMBER_OF_MODERATOR, function(group, callback){
    group.access = [];
    for(var i = 0;i<PATHS.length;i++){
        for(var j = 0;j<METHODS.length;j++){
            if(METHODS[i] != 'DELETE'){
                group.access.push({
                    path:PATHS[i],
                    method:METHODS[i]
                });
            }
        }
    }
    callback();
});
generateGroup('users', NUMBER_OF_USERS, function(group, callback){
    group.access = [];
    for(var i = 0;i<PATHS.length;i++){
        group.access.push({
            path:PATHS[i],
            method:'GET'
        });
    }
    callback();
});
generateGroup('guest', function(group, callback){
    group.access = [];
    group.access.push({
        path:'/',
        method:'GET'
    });
    callback();
});

function generateManga(numberOfManga){
    for(var i = 0;i< numberOfManga;i++){
        var manga = new Manga();
        manga.uuid = uuid.v4();
        console.log(manga.uuid);
        manga.name = 'Manga' + i;
        manga.save(function(error){
            if(error){
                console.log('Error - ' + error);
            }else{
                console.log('Success - Data Saved');
            }
        });
    }
}

function generateGroup(name, numberOfUsers, generateAccess){
    var group = new Group();
    group.id = uuid.v4();
    group.name = name;
    group.users = [];
    
    for(var i = 0;i< numberOfUsers;i++){
        var user = new User();
        debugger;
        user.pseudo = name + i;
        user.group = [];
        user.group.push(group);
        bcrypt.genSalt(config.security.password.bcryptIterations, function(err, salt) {
            bcrypt.hash(user.pseudo, salt, function(err, hash) {
                if(err){
                    console.log(err);
                }
                user.hashedPassword = hash;
                user.save(function(error){
                    if(error){
                        console.log('Error - ' + error);
                    }else{
                        group.users.push(user);
                        console.log('Success - Data Saved');
                    }
                });
            });
        });
    }
    
    generateAccess(group, function(){
        group.save(function(error){
            if(error){
                console.log('Error - ' + error);
            }else{
                console.log('Success - Group Saved');
            }
        });
    });
}