/**
 * Created by pascalbrewing on 01/10/14
 *
 */

"use strict";
var inquirer = require('inquirer');
var serverconfig = require('mcaprc');
var urlPattern = /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/;
var stringPattern = /^[a-zA-Z\s]+$/;
var chalk = require('chalk');
var _ = require('lodash');
var Table = require('cli-table');

/**
 * config for Addding
 * @type {*[]}
 */
var configAdd = [
    {
        type    : "input",
        name    : "name",
        message : "Application Name",
        validate: function (value) {
            var pass = value.match(stringPattern);
            if ( pass ) {
                return true;
            } else {
                return "Please enter a valid Application name";
            }
        }
    },
    {
        type    : "input",
        name    : "baseUrl",
        message : "Enter the project url (http://....)",
        validate: function (value) {
            var pass = value.match(urlPattern);

            if ( pass ) {
                return true;
            } else {
                return "Please enter a valid url";
            }
        }
    },
    {
        type   : "input",
        name   : "userName",
        message: "Enter your username"
    },
    {
        type   : "password",
        name   : "password",
        message: "Enter your Password"
    }

];

/**
 * the confirm if you wanna add Y/N
 * @type {{type: string, name: string, message: string, default: boolean}[]}
 */
var configAddConfirm = [
    {
        type   : "confirm",
        name   : "addapp",
        message: "Wanna add the app with the following configuration ? ",
        default: true
    }
];

/**
 * start inquirer
 * @param program
 */
function newserver(program) {
    switch ( program.server ) {
        case 'add':
            return addServer(program);
            break;
        case 'remove':
            return removeServer(program);
            break;
        case 'list':
            var result = serverconfig.parse(program.server, program.args);
            return createOutput(result);
            break;
        default:

            break;
    }
}

/**
 *
 * @param program
 */
function removeServer(program) {
    var list = getServerList(program.server);
    var serverKeys = _cleanUpServerList(_.keys(list));

    //console.log(list,serverKeys);
    var choices = [];
    var defaultServerName = null;

    serverKeys.forEach(function (value, key) {
        if ( value === list.default ) {
            defaultServerName = value;
        }
        choices.push({ name: value });
    });
    _setRemoveCommand(choices, defaultServerName);
    //console.log('list',list);
    //console.log('choices',choices);
}

/**
 *
 * @param choices
 * @param defaultServerName
 * @private
 */
function _setRemoveCommand(choices, defaultServerName) {
    inquirer.prompt(
        [
            {
                type    : "checkbox",
                message : "Select Server/s",
                name    : "server",
                choices : choices,
                validate: function (answer) {
                    console.log('answer');
                    if ( answer.length < 1 ) {
                        return "You must choose at least one server.";
                    }
                    return true;
                }
            }
        ],
        function (answers) {
            console.log('selected', JSON.stringify(answers, null, "  "));
            console.log(Object.keys(answers.server).length);
            console.log(Object.keys(choices).length);
            var choosenServerLength = Object.keys(answers.server).length;
            var choicesLength = Object.keys(choices).length;
            var deleteDefault = _.difference(answers.server, [ defaultServerName ]);

            if ( choosenServerLength === choicesLength ) {
                console.log('delete all');
                //we wann delete the whole world;
            }

            if ( deleteDefault.length <= choicesLength ) {
                console.log('default is in Array wa have to change it');
            }

        });
}

/**
 *
 * @private
 */
function _defaultServerChange(list) {

}

/**
 * return the whole list of server from rc
 * @param server
 * @returns {*}
 */
function getServerList(server) {
    return serverconfig.parse(server, 'list');
}

/**
 * add a new JSON Object to .mcaprc
 * @param program
 */
function addServer(program) {
    inquirer.prompt(
        configAdd,
        function (answers) {
            if ( answers ) {
                var answerConfig = JSON.stringify(answers, null, "  ");
                var rawAnswer = answers;
                configAddConfirm[ 0 ].message += answerConfig;

                inquirer.prompt(
                    configAddConfirm,
                    function (answers) {
                        if ( answers.addapp )
                            return serverconfig.parse(program.server, [ rawAnswer.name, rawAnswer.baseUrl, rawAnswer.userName, rawAnswer.password ]);
                    }
                );
            }
        }
    );
}

/**
 * get the all servers from  th mcaprc
 *
 * @param result
 */
function createOutput(result) {
    if ( typeof result === 'object' && Object.keys(result).length > 0 ) {

        var keys = _.keys(result);
        var servers = _.remove(keys, function (key) {
            return key !== 'config' && key !== '_' ? key : '';
        });

        var table = new Table(
            {
                head: [chalk.magenta("Server"), chalk.magenta("Option"), chalk.magenta("Value")],
                colWidth: [200,200,200]
            }
        );
        var defaultTable = new Table(
            {
                head:['Default Server ','Name'],
                colWidth: [200,200]
            }
        );
        servers.forEach(function (key) {

            var inverseKeys = _.keys(result[ key ]);
            var message = '';
            var tableContent = null;

            if ( key !== 'default' ) {

                if ( inverseKeys.length > 0 ) {
                    var i = 0;
                    inverseKeys.forEach(function (subkey, count) {
                        if ( key !== 'default' ) {
                            table.push( [
                                i === 0?chalk.cyan(key):'',
                                chalk.blue(inverseKeys[ count ]),
                                result[ key ][ subkey ] !== '' ? chalk.green(result[ key ][ subkey ]) : chalk.red('na')
                            ]);
                            i++;
                        }

                    });
                }
            } else {
                defaultTable.push([key, chalk.magenta(result.default)]);
            }
        });
        console.log(defaultTable.toString());
        console.log(table.toString());
    }
}

/**
 * remove config,default,_ from the server Object
 * @param list
 * @returns {*}
 * @private
 */
function _cleanUpServerList(list) {
    return _.remove(list, function (key) {
        return key !== 'config' && key !== '_' && key !== 'default' ? key : '';
    })
}

module.exports = newserver;