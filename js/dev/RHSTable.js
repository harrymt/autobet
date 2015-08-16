
$(function() {
    var matches = GetMatches();

    // Print matches
    printTable(matches);
});

//
// Defines the RHS table match
//
var RHSmatch = {
    homeTeam: '', homeOdds: '',
    awayTeam: 0.0, awayOdds: 0.0,
    correctScore: false, correctResult: false, overOrUnder: false,
};

//
// Returns the matches with Odds this gameweek
//
function GetMatches() {
    var matches = []; // The output, an array of matches

    // Get data from LHS table
    var data = [];

    // Add the match information
    for (var i = 0; i < data.length; i++) {
        matches.push({
            homeTeam: 'Swansea', homeOdds: 1.0,
            awayTeam: 'United', awayOdds: 1.1,
            correctScore: false, correctResult: false, overOrUnder: false
        });
    }
    // console.log(matches);
    return matches;
}

//
// Prints matches to output table.
//
function printTable(matches) {
    var heading = $('<h1></h1>').text("Game Week 1");

    var tableHeader = $('<tr>').append(
        $("<th>").text('Home'),
        $("<th>").text('Odds'),
        $("<th>").text('Away'),
        $("<th>").text('Odds'),
        $("<th>").text('Correct Score'),
        $("<th>").text('Correct Result'),
        $("<th>").text('Over/Under')
    );

    var table = $('<table>').append(tableHeader);
    for(i = 0; i < matches.length; i++){
        var tableRow = $('<tr></tr>');
        tableRow.append($('<td>').text(matches[i].homeTeam));
        tableRow.append($('<td>').text(matches[i].homeOdds.toFixed(2)));
        tableRow.append($('<td>').text(matches[i].awayTeam));
        tableRow.append($('<td>').text(matches[i].awayOdds.toFixed(2)));
        tableRow.append($('<td>').text(matches[i].correctScore));
        tableRow.append($('<td>').text(matches[i].correctResult));
        tableRow.append($('<td>').text(matches[i].overOrUnder));
        table.append(tableRow);
    }
    // console.log(table.html());
    $('#js-output').append(heading);
    $('#js-output').append(table);
}
