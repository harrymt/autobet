
'use strict';

var T = 19; // Teams in League - 1
var LAS = 1.49; // League Attack Strength
var LDS = 1.1; // League Defence Strength (Was 1.16)

var HomeAvgGoals = 1.49;
var AwayAvgGoals = 1.11;

function getAttackStrength(goalsScored) {
    return (goalsScored / T) / LAS;
}

function getDefenceStrength(goalsConceded) {
    return (goalsConceded / T) / LDS;
}

function getAwayTeamGoals(matches, hometeam, awayteam) {
    var hometeamStats = searchArray(matches, 'team', hometeam);
    var awayteamStats = searchArray(matches, 'team', awayteam);
    return (awayteamStats.awayAttStr * hometeamStats.homeDefStr * AwayAvgGoals).toFixed(2);
}

//
// Calculate Home Team goals
// HomeTeamGoals = HomeTeamAtt x AwayTeamDef x HomeAvgGoals
//
function getHomeTeamGoals(matches, hometeam, awayteam) {
    var hometeamStats = searchArray(matches, 'team', hometeam);
    var awayteamStats = searchArray(matches, 'team', awayteam);
    return (hometeamStats.homeAttStr * awayteamStats.awayDefStr * HomeAvgGoals).toFixed(2);
}

function processResults(matches) {
    printConfigTable(); // Displays config values used
    displayMatches(matches); // Top Table (LHS)
    fetchFixtures(displayFixtures, matches); // Bottom Table (RHS)

    // End loading spinner
    $('.js-loading-spinner').css('display', 'none');
}

function fetchGoalStats(callback) {
    var matches = [];

    // http://www.soccerstats.com/team_trends.asp?league=england&pmtype=average
    var url = 'https://api.import.io/store/data/4d2918a1-7edf-4ddb-8ad2-bf879b0483b5/_query?input/webpage/url=http%3A%2F%2Fwww.soccerstats.com%2Fteam_trends.asp%3Fleague%3Dengland%26pmtype%3Daverage&_user=24f4e2a3-0b63-4a25-bd86-ee8bc4b28225&_apikey=24f4e2a30b634a25bd86ee8bc4b28225f6f10355b63ffc38bf842e973031e321fe888781eacb90809cdae1358dc9df612d1988b05ceca52c5e73bb19329ee23bdbb4dde347168aea8123b8e69f752817';
    return $.getJSON(url , function( data ) {

      for(var i = 0; i < data.results.length; i++) {
            matches.push({
                team: data.results[i]['link/_text'],
                homeScored: data.results[i].value_1,
                homeConceded: data.results[i].value_2,
                awayScored: data.results[i].value_3,
                awayConceded: data.results[i].value_4,
                homeAttStr: getAttackStrength(data.results[i].value_1).toFixed(2),
                homeDefStr: getDefenceStrength(data.results[i].value_2).toFixed(2),
                awayAttStr: getAttackStrength(data.results[i].value_3).toFixed(2),
                awayDefStr: getDefenceStrength(data.results[i].value_4).toFixed(2)
            });
        }

        callback(matches);
    });
}

function searchArray(array, objectName, searchTerm) {
    var result = $.grep(array, function(e) { return e[objectName] == searchTerm; });
    if (result.length === 0) { // not found
      return 'ERROR: ' + searchTerm + ' not found';
    } else if (result.length == 1) {
        return result[0];
    } else { // multiple items found
      return 'ERROR: 1+ items found';
    }
}

function fetchFixtures(callback, matches) {
    var fixtures = [];
    var gameweekMatches = [];
    var gameweekNumber = 1;
    // fantasy.premierleague.com/fixtures/1/
    return $.ajax({
        url: 'https://www.kimonolabs.com/api/5ngo4jjk?apikey=RbOBR2dkBMXKj1pxkxWWUYEJperNuBsv',
        crossDomain: true,
        dataType: 'jsonp',
        success: function(response) {
            for(var i = 0; i < response.results.match.length; i++) {

                var game = response.results.match[i];

                var htWinChance = getHomeTeamGoals(matches, fixTeam(game.hometeam), fixTeam(game.awayteam));
                var atWinChange = getAwayTeamGoals(matches, fixTeam(game.hometeam), fixTeam(game.awayteam));

                var hometeamresult = 0, awayteamresult = 0;
                var gotCorrectScore = '-';
                 if (game.result == 'v') {
                    hometeamresult = '-'; awayteamresult = '-';
                } else {
                    hometeamresult = game.result.split(' - ')[0];
                    awayteamresult = game.result.split(' - ')[1];

                    if(htWinChance == atWinChange && hometeamresult == awayteamresult ) {
                        gotCorrectScore = 'Y';
                    } else if(htWinChance > atWinChange && hometeamresult > awayteamresult) {
                        gotCorrectScore = 'Y';
                    } else if(htWinChance < atWinChange && hometeamresult < awayteamresult) {
                        gotCorrectScore = 'Y';
                    } else {
                        gotCorrectScore = 'N';
                    }
                }

                var OverXGoals = 'N';
                var XGoals = 2.5;
                if ( hometeamresult != '-' && awayteamresult != '-') {
                    console.log(hometeamresult + ' + ' + awayteamresult + ' = ' + (parseInt(hometeamresult) + parseInt(awayteamresult)));
                    if ((parseInt(hometeamresult) + parseInt(awayteamresult)) > XGoals) {
                        OverXGoals = 'Y';
                    }
                }

                gameweekMatches.push({
                    date: game.date,
                    hometeam: fixTeam(game.hometeam),
                    hometeamGoals: htWinChance,
                    awayteam: fixTeam(game.awayteam),
                    awayteamGoals: atWinChange,
                    hometeamresult: hometeamresult,
                    awayteamresult: awayteamresult,
                    correctResult: gotCorrectScore,
                    correctScore: 'NA', overOrUnder: OverXGoals
                });

                if(i % 10 === 0 && i !== 0) {
                    fixtures.push({
                        matches: gameweekMatches,
                        gameweek: gameweekNumber++
                    });
                    gameweekMatches = [];
                }
            }

            callback(fixtures);
        }
    });
}

function fixTeam(teamName) {
    switch(teamName) {
        case 'Crystal Palace':  return 'Crystal Pala.';
        case 'Leicester':   return 'Leicester Ci.';
        case 'Man City':    return 'Manchester C.';
        case 'Man Utd':     return 'Manchester U.';
        case 'Newcastle':   return 'Newcastle Utd';
        case 'Norwich':     return 'Norwich City';
        case 'Spurs':       return 'Tottenham';
        case 'Stoke':       return 'Stoke City';
        case 'Swansea':     return 'Swansea City';
        case 'West Brom':   return 'West Bromwich';
        case 'West Ham':    return 'West Ham Utd';
    }
    return teamName;
}

function printConfigTable() {
    var keyTable = $('<table>').append(
        $('<tr>').append(
            $('<th>').text('Teams in league - 1'),
            $('<th>').text('League Attack Strength'),
            $('<th>').text('League Defence Strength')
        ),
        $('<tr>').append(
            $('<td>').text(T),
            $('<td>').text(LAS),
            $('<td>').text(LDS)
        )
    );
    $('#js-LHSoutput').append(keyTable);
}

function displayMatches(ms) {
    var tableHeader = $('<tr>').append(
        $('<th>').text('Team'),
        $('<th>').text('Home Scored'),
        $('<th>').text('Home Conceded'),
        $('<th>').text('Away Scored'),
        $('<th>').text('Away Conceded'),
        $('<th>').text('Home Attack Str'),
        $('<th>').text('Home Defence Str'),
        $('<th>').text('Away Attack Str'),
        $('<th>').text('Away Defence Str')
    );

    var table = $('<table>', { id: 'table-stats'}).append(tableHeader);

    for(var i = 0; i < ms.length; i++) {
        var tableRow = $('<tr></tr>').append(
            $('<td>').text(ms[i].team),
            $('<td>').text(ms[i].homeScored),
            $('<td>').text(ms[i].homeConceded),
            $('<td>').text(ms[i].awayScored),
            $('<td>').text(ms[i].awayConceded),
            $('<td>').text(ms[i].homeAttStr),
            $('<td>').text(ms[i].homeDefStr),
            $('<td>').text(ms[i].awayAttStr),
            $('<td>').text(ms[i].awayDefStr)
        );
        table.append(tableRow);
    }
    $('#js-LHSoutput').append(table);

    sorttable.makeSortable(document.getElementById('table-stats')); // Make table sortable
}

function displayFixtures(fs) {
    var output = $('<div class="fixtures"></div>');

    for(var i = 0; i < fs.length; i++) {
        output.append($('<h1></h1>').text('Game Week ' + fs[i].gameweek));

        var table = $('<table>').append(
            $('<thead>').append(
                $('<tr>').append(
                    $('<th>').text('Date'),
                    $('<th>').text('Home'),
                    $('<th>').text('Home Goals%'),
                    $('<th>').text('Away'),
                    $('<th>').text('Away Goals%'),
                    $('<th>').text('Home Result'),
                    $('<th>').text('Away Result'),
                    $('<th>').text('Score exact?'),
                    $('<th>').text('Result?'),
                    $('<th>').text('Over 2.5 Goals')
                )
            )
        );

        var TotalCorrectScore = 0;
        var TotalCorrectResult = 0;
        var TotalCorrectOverOrUnder = 0;
        for(var j = 0; j < fs[i].matches.length; j++) {
            var game = fs[i].matches[j];

            if(game.correctScore == 'Y') {TotalCorrectScore++;}
            if(game.correctResult == 'Y') {TotalCorrectResult++;}
            if(game.overOrUnder == 'Y') {TotalCorrectOverOrUnder++;}

            var tableRow = $('<tr></tr>').append(
                $('<td>').text(game.date),
                $('<td>').text(game.hometeam),
                $('<td>').text(game.hometeamGoals),
                $('<td>').text(game.awayteam),
                $('<td>').text(game.awayteamGoals), //game.awayOdds.toFixed(2)),
                $('<td>').text(game.hometeamresult),
                $('<td>').text(game.awayteamresult),
                $('<td>').text(game.correctScore),
                $('<td>').text(game.correctResult),
                $('<td>').text(game.overOrUnder)
            );
            table.append(tableRow);
        }

        // Create totals row
        table.append(
            $('<tr></tr>').append(
                $('<td>').text(''),
                $('<td>').text(''),
                $('<td>').text(''),
                $('<td>').text(''),
                $('<td>').text(''),
                $('<td>').text(''),
                $('<td>').text('Totals'),
                $('<td>').text(TotalCorrectScore + '/' + fs[i].matches.length),
                $('<td>').text(TotalCorrectResult + '/' + fs[i].matches.length),
                $('<td>').text(TotalCorrectOverOrUnder + '/' + fs[i].matches.length)
            )
        );
        table.append(
            $('<tr></tr>').append(
                $('<td>').text(''),
                $('<td>').text(''),
                $('<td>').text(''),
                $('<td>').text(''),
                $('<td>').text(''),
                $('<td>').text(''),
                $('<td>').text('Success'),
                $('<td>').text((TotalCorrectScore / fs[i].matches.length).toFixed(2)),
                $('<td>').text((TotalCorrectResult / fs[i].matches.length).toFixed(2)),
                $('<td>').text((TotalCorrectOverOrUnder / fs[i].matches.length).toFixed(2))
            )
        );

        output.append(table);
    }
    $('#js-output').append(output);
}

$(function() {
    fetchGoalStats(processResults); // Main
});
