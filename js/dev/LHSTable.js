
var T = 19; // Teams in League - 1
var LAS = 1.49; // League Attack Strength
var LDS = 1.1; // League Defence Strength (Was 1.16)

$(function() {
    PrintOdds(); // From LHS Table
    PrintFixtures(); // From RHS Table
});

function PrintOdds() {
      var keyTable = $('<table>').append(
        $('<tr>').append(
            $('<th>').text("Teams in league - 1"),
            $('<th>').text("League Attack Strength"),
            $('<th>').text("League Defence Strength")
        ),
        $('<tr>').append(
            $('<td>').text(T),
            $('<td>').text(LAS),
            $('<td>').text(LDS)
        )
    );

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

    var table = $('<table>', { class: "sortable"}).append(tableHeader);

    // http://www.soccerstats.com/team_trends.asp?league=england&pmtype=average
    var url = "https://api.import.io/store/data/4d2918a1-7edf-4ddb-8ad2-bf879b0483b5/_query?input/webpage/url=http%3A%2F%2Fwww.soccerstats.com%2Fteam_trends.asp%3Fleague%3Dengland%26pmtype%3Daverage&_user=24f4e2a3-0b63-4a25-bd86-ee8bc4b28225&_apikey=24f4e2a30b634a25bd86ee8bc4b28225f6f10355b63ffc38bf842e973031e321fe888781eacb90809cdae1358dc9df612d1988b05ceca52c5e73bb19329ee23bdbb4dde347168aea8123b8e69f752817";
    $.getJSON(url , function( data ) {
        // End Loading spinner
        $('.js-loading-spinner').css('display', 'none');

        console.log("Data loaded.");
        console.log(data);
        console.log("Found " + data.results.length + " results");

        for(i = 0; i < data.results.length; i++) {
            var teamName = data.results[i]['link/_text'];
            var homeScored = data.results[i].value_1;
            var homeConceded = data.results[i].value_2;
            var awayScored = data.results[i].value_3;
            var awayConceded = data.results[i].value_4;

            var tableRow = $('<tr></tr>').append(
                $('<td>').text(teamName),
                $('<td>').text(homeScored),
                $('<td>').text(homeConceded),
                $('<td>').text(awayScored),
                $('<td>').text(awayConceded),
                $('<td>').text(getAttackStrength(homeScored).toFixed(2)),
                $('<td>').text(getDefenceStrength(homeConceded).toFixed(2)),
                $('<td>').text(getAttackStrength(awayScored).toFixed(2)),
                $('<td>').text(getDefenceStrength(awayConceded).toFixed(2))
            );
            table.append(tableRow);
        }
    });

    console.log(table.html());
    $('#js-LHSoutput').append(keyTable);
    $('#js-LHSoutput').append(table);
}

function getAttackStrength(goalsScored) {
    return (goalsScored / T) / LAS;
}

function getDefenceStrength(goalsConceded) {
    return (goalsConceded / T) / LDS;
}



//
// Defines the RHS table match
//
var RHSmatch = {
    homeTeam: '', homeOdds: '',
    awayTeam: 0.0, awayOdds: 0.0,
    correctScore: false, correctResult: false, overOrUnder: false,
};
