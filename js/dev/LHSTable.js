
    var xx;

$(function() {
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

    var table = $('<table>').append(tableHeader);

    // http://www.soccerstats.com/team_trends.asp?league=england&pmtype=average
    var url = "https://api.import.io/store/data/4d2918a1-7edf-4ddb-8ad2-bf879b0483b5/_query?input/webpage/url=http%3A%2F%2Fwww.soccerstats.com%2Fteam_trends.asp%3Fleague%3Dengland%26pmtype%3Daverage&_user=24f4e2a3-0b63-4a25-bd86-ee8bc4b28225&_apikey=24f4e2a30b634a25bd86ee8bc4b28225f6f10355b63ffc38bf842e973031e321fe888781eacb90809cdae1358dc9df612d1988b05ceca52c5e73bb19329ee23bdbb4dde347168aea8123b8e69f752817";
    $.getJSON(url , function( data ) {
        console.log("Data loaded.");
        console.log(data);
        console.log("Found " + data.results.length + " results");

        for(i = 0; i < data.results.length; i++){
            var tableRow = $('<tr></tr>').append(
                $('<td>').text(data.results[i]['link/_text']),
                $('<td>').text(data.results[i]['value_1']),
                $('<td>').text(data.results[i]['value_2']),
                $('<td>').text(data.results[i]['value_3']),
                $('<td>').text(data.results[i]['value_4'])
            );
            table.append(tableRow);
        }
    });


    console.log(table.html());
    $('#js-LHSoutput').append(table);
});


//
// Defines the RHS table match
//
var RHSmatch = {
    homeTeam: '', homeOdds: '',
    awayTeam: 0.0, awayOdds: 0.0,
    correctScore: false, correctResult: false, overOrUnder: false,
};
