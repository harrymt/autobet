
$(function() {
    'use strict';

    var config = {
        T: 19, // Teams in League - 1

        LAS: 1.49, // League Attack Strength
        LDS: 1.1, // League Defence Strength (Was 1.16)

        GoalTarget: 2.5,

        HomeAvgGoals: 1.49,
        AwayAvgGoals: 1.11,

        DecimalPlaces: 3,

        NumberOfYears: 2,
        MergeYears: true // Combine data from every year & create an average / number of years
     };

    function getAttackStrength(goalsScored) {
        return (goalsScored / config.T) / config.LAS;
    }

    function getDefenceStrength(goalsConceded) {
        return (goalsConceded / config.T) / config.LDS;
    }

    function getAwayTeamGoals(matches, hometeam, awayteam) {
        var hometeamStats = searchArray(matches, 'team', hometeam);
        var awayteamStats = searchArray(matches, 'team', awayteam);
        return (awayteamStats.awayAttStr * hometeamStats.homeDefStr * config.AwayAvgGoals).toFixed(config.DecimalPlaces);
    }

    //
    // Calculate Home Team goals
    // HomeTeamGoals = HomeTeamAtt x AwayTeamDef x HomeAvgGoals
    //
    function getHomeTeamGoals(matches, hometeam, awayteam) {
        var hometeamStats = searchArray(matches, 'team', hometeam);
        var awayteamStats = searchArray(matches, 'team', awayteam);
        return (hometeamStats.homeAttStr * awayteamStats.awayDefStr * config.HomeAvgGoals).toFixed(config.DecimalPlaces);
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

        // http://www.soccerstats.com/widetable.asp?league=england_2015
        var url = 'https://www.kimonolabs.com/api/7jzhc6fe?apikey=RbOBR2dkBMXKj1pxkxWWUYEJperNuBsv';
        return $.ajax({
            url: url,
            crossDomain: true,
            dataType: 'jsonp',
            success: function(response) {
                for(var i = 0; i < response.results.Teams.length; i++) {
                    var Team = response.results.Teams[i];

                    if (config.MergeYears) {
                        var found_team = false;
                        for (var m = 0; m < matches.length; m++) {
                            console.log(Team.Team);
                            console.log(matches[m].team);
                            if (!found_team && matches[m].team == Team.Team) {
                                matches[m].gamesInWithOver2point5Goals = (parseInt(Team.GamesWithOver25Goals.replace('%', '')) + parseInt(matches[m].gamesInWithOver2point5Goals)) / config.NumberOfYears;
                                matches[m].homeScored = (parseInt(Team.GoalsScoredHome) + parseInt(matches[m].homeScored)) / config.NumberOfYears;
                                matches[m].homeConceded = (parseInt(Team.GoalsConcededHome) + parseInt(matches[m].homeConceded)) / config.NumberOfYears;
                                matches[m].awayScored = (parseInt(Team.GoalsScoredAway) + parseInt(matches[m].awayScored)) / config.NumberOfYears;
                                matches[m].awayConceded = (parseInt(Team.GoalsConcededAway) + parseInt(matches[m].awayConceded)) / config.NumberOfYears;
                                matches[m].homeAttStr = getAttackStrength(matches[m].homeScored).toFixed(config.DecimalPlaces);
                                matches[m].homeDefStr = getDefenceStrength(matches[m].homeConceded).toFixed(config.DecimalPlaces);
                                matches[m].awayAttStr = getAttackStrength(matches[m].awayScored).toFixed(config.DecimalPlaces);
                                matches[m].awayDefStr = getDefenceStrength(matches[m].awayConceded).toFixed(config.DecimalPlaces);
                                matches[m].year = '2015 & 2016';
                                found_team = true;
                            }
                        }

                        if (!found_team) {
                            matches.push({
                                lastrun: response.thisversionrun,
                                team: Team.Team,
                                gamesInWithOver2point5Goals: parseInt(Team.GamesWithOver25Goals.replace('%', '')),
                                homeScored: parseInt(Team.GoalsScoredHome),
                                homeConceded: parseInt(Team.GoalsConcededHome),
                                awayScored: parseInt(Team.GoalsScoredAway),
                                awayConceded: parseInt(Team.GoalsConcededAway),
                                homeAttStr: parseInt(getAttackStrength(Team.GoalsScoredHome).toFixed(config.DecimalPlaces)),
                                homeDefStr: parseInt(getDefenceStrength(Team.GoalsConcededHome).toFixed(config.DecimalPlaces)),
                                awayAttStr: parseInt(getAttackStrength(Team.GoalsScoredAway).toFixed(config.DecimalPlaces)),
                                awayDefStr: parseInt(getDefenceStrength(Team.GoalsConcededAway).toFixed(config.DecimalPlaces)),
                                year: Team.url.substring(Team.url.length - 4) == '2014' ? '2015' : '2016'
                            });
                        }
                    } else {
                        var year_data = Team.url.substring(Team.url.length - 4) == '2014' ? '2015' : '2016';

                        matches.push({
                            lastrun: response.thisversionrun,
                            team: Team.Team,
                            gamesInWithOver2point5Goals: Team.GamesWithOver25Goals,
                            homeScored: Team.GoalsScoredHome,
                            homeConceded: Team.GoalsConcededHome,
                            awayScored: Team.GoalsScoredAway,
                            awayConceded: Team.GoalsConcededAway,
                            homeAttStr: getAttackStrength(Team.GoalsScoredHome).toFixed(config.DecimalPlaces),
                            homeDefStr: getDefenceStrength(Team.GoalsConcededHome).toFixed(config.DecimalPlaces),
                            awayAttStr: getAttackStrength(Team.GoalsScoredAway).toFixed(config.DecimalPlaces),
                            awayDefStr: getDefenceStrength(Team.GoalsConcededAway).toFixed(config.DecimalPlaces),
                            year: year_data
                        });

                    }
                }

                callback(matches);
            }
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
        // fantasy.premierleague.com/fixtures/1/
        return $.ajax({
            url: 'https://www.kimonolabs.com/api/5ngo4jjk?apikey=RbOBR2dkBMXKj1pxkxWWUYEJperNuBsv&kimbypage=1',
            crossDomain: true,
            dataType: 'jsonp',
            success: function(response) {
                for(var i = 0; i < response.results.length; i++) {

                    for(var j = 0; j < response.results[i].match.length; j++) {

                        var game = response.results[i].match[j];

                        var htWinChance = getHomeTeamGoals(matches, fixTeam(game.hometeam), fixTeam(game.awayteam));
                        var atWinChance = getAwayTeamGoals(matches, fixTeam(game.hometeam), fixTeam(game.awayteam));

                        var hometeamresult = 0, awayteamresult = 0;
                        var gotCorrectScore = '-';
                         if (game.result == 'v') {
                            hometeamresult = '-'; awayteamresult = '-';
                        } else {
                            hometeamresult = game.result.split(' - ')[0];
                            awayteamresult = game.result.split(' - ')[1];

                            if(htWinChance == atWinChance && hometeamresult == awayteamresult ) {
                                gotCorrectScore = 'Y';
                            } else if(htWinChance > atWinChance && hometeamresult > awayteamresult) {
                                gotCorrectScore = 'Y';
                            } else if(htWinChance < atWinChance && hometeamresult < awayteamresult) {
                                gotCorrectScore = 'Y';
                            } else {
                                gotCorrectScore = 'N';
                            }
                        }

                        var OverXGoals = 'N';
                        var XGoals = config.GoalTarget;
                        if ( hometeamresult != '-' && awayteamresult != '-') {
                            if ((parseInt(hometeamresult) + parseInt(awayteamresult)) > XGoals) {
                                OverXGoals = 'Y';
                            }
                        }

                        gameweekMatches.push({
                            date: game.date,
                            hometeam: fixTeam(game.hometeam),
                            hometeamGoals: htWinChance,
                            awayteam: fixTeam(game.awayteam),
                            awayteamGoals: atWinChance,
                            hometeamresult: hometeamresult,
                            awayteamresult: awayteamresult,
                            correctResult: gotCorrectScore,
                            correctScore: 'NA',
                            overOrUnder: OverXGoals
                        });
                    }

                    fixtures.push({
                        matches: gameweekMatches,
                        gameweek: response.results[i].page,
                        lastrun: response.thisversionrun
                    });

                    gameweekMatches = [];
                }
                callback(fixtures);
            }
        });
    }

    function fixTeam(teamName) {
        switch(teamName) {
            case 'Crystal Palace':  return 'Crystal Palace';
            case 'Leicester':       return 'Leicester City';
            case 'Man City':        return 'Manchester City';
            case 'Man Utd':         return 'Manchester Utd';
            case 'Newcastle':       return 'Newcastle Utd';
            case 'Norwich':         return 'Norwich City';
            case 'Spurs':           return 'Tottenham';
            case 'Stoke':           return 'Stoke City';
            case 'Swansea':         return 'Swansea City';
            case 'West Brom':       return 'West Bromwich';
            case 'West Ham':        return 'West Ham Utd';
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
                $('<td>').text(config.T),
                $('<td>').text(config.LAS),
                $('<td>').text(config.LDS)
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
            $('<th>').text('Home Defence Weakness'),
            $('<th>').text('Away Attack Str'),
            $('<th>').text('Away Defence Weakness'),
            $('<th>').text('% of matches with > 2.5 goals'),
            $('<th>').text('Year')
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
                $('<td>').text(ms[i].awayDefStr),
                $('<td>').text(ms[i].gamesInWithOver2point5Goals),
                $('<td>').text(ms[i].year)
            );
            table.append(tableRow);
        }
        $('#js-LHSoutput').append('<p></p>').text('Table updated ' + makePrettyDate(ms[0].lastrun));
        $('#js-LHSoutput').append(table);

        sorttable.makeSortable(document.getElementById('table-stats')); // Make table sortable
    }

    function displayFixtures(fs) {
        var current_gameweek = 0;

        var output = $('<div class="fixtures"></div>');

        for(var i = 0; i < fs.length; i++) {
            output.append($('<h1></h1>', { id: 'gameweek-' + fs[i].gameweek}).text('Game Week ' + fs[i].gameweek));
            var table = $('<table>').append(
                $('<thead>').append(
                    $('<tr>').append(
                        $('<th>').text('Date'),
                        $('<th>').text('Home'),
                        $('<th>').text('Home Goals%'),
                        $('<th>').text('Away Goals%'),
                        $('<th>').text('Away'),
                        $('<th>').text('Home Result'),
                        $('<th>').text('Away Result'),
                        // $('<th>').text('Score exact?'),
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

                // if(game.correctScore == 'Y') {TotalCorrectScore++;}
                if(game.correctResult == 'Y') {TotalCorrectResult++;}
                if(game.overOrUnder == 'Y') {TotalCorrectOverOrUnder++;}

                var htColour = 'default-colour', atColour = 'default-colour';
                if (game.hometeamGoals > game.awayteamGoals) {
                    htColour = 'success-colour';
                } else if(game.hometeamGoals < game.awayteamGoals){
                    atColour = 'success-colour';
                }

                var tableRow = $('<tr></tr>').append(
                    $('<td>').text(game.date),
                    $('<td>').text(game.hometeam).attr('class', htColour),
                    $('<td>').text(game.hometeamGoals).attr('class', htColour),
                    $('<td>').text(game.awayteamGoals).attr('class', atColour),
                    $('<td>').text(game.awayteam).attr('class', atColour),
                    $('<td>').text(game.hometeamresult),
                    $('<td>').text(game.awayteamresult),
                    // $('<td>').text(game.correctScore),
                    $('<td>').text(game.correctResult),
                    $('<td>').text(game.overOrUnder)
                );
                table.append(tableRow);

                if (current_gameweek === 0 && game.hometeamresult == '-') {
                    current_gameweek = fs[i].gameweek;
                }
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
                    // $('<td>').text(TotalCorrectScore + '/' + fs[i].matches.length),
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
                    // $('<td>').text((TotalCorrectScore / fs[i].matches.length).toFixed(config.DecimalPlaces)),
                    $('<td>').text((TotalCorrectResult / fs[i].matches.length).toFixed(config.DecimalPlaces)),
                    $('<td>').text((TotalCorrectOverOrUnder / fs[i].matches.length).toFixed(config.DecimalPlaces))
                )
            );

            output.append(table);
        }
        $('#js-output').append('<p></p>').text('Fixtures updated ' + makePrettyDate(fs[0].lastrun));
        $('#js-output').append(output);

        $('.js-current-gameweek').attr('href', '#gameweek-' + current_gameweek);

    }

    function makePrettyDate(dStr) {
        var LastUpdated = new Date(dStr);
        return LastUpdated.toLocaleDateString() + ' ' + LastUpdated.toLocaleTimeString();
    }


    fetchGoalStats(processResults); // Run main program
});

