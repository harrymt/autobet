
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
function PrintFixtures() {
    var heading = $('<h1></h1>').text("Game Week 1");
    var tableHeader = $('<tr>').append(
        $("<th>").text('Date'),
        $("<th>").text('Home'),
        $("<th>").text('Odds'),
        $("<th>").text('Away'),
        $("<th>").text('Odds'),
        $("<th>").text('Result'),
        $("<th>").text('Correct Score'),
        $("<th>").text('Correct Result'),
        $("<th>").text('Over/Under')
    );

    // 1. Get Fixtures
    var url = "https://www.kimonolabs.com/api/5ngo4jjk?apikey=RbOBR2dkBMXKj1pxkxWWUYEJperNuBsv";
    $.ajax({
        url: url,
        crossDomain: true,
        dataType: 'jsonp',
        success: function(response) {
            console.log("Data loaded.");
            console.log(response);
            console.log("Found " + response.results.match.length + " matches");

            var table = $('<table>').append(tableHeader);

            for(i = 0; i < response.results.match.length; i++) {
                var tableRow = $('<tr></tr>');
                tableRow.append($('<td>').text(response.results.match[i].date));
                tableRow.append($('<td>').text(response.results.match[i].hometeam));
                tableRow.append($('<td>').text('0.0')); //response.results.match[i].homeOdds.toFixed(2)));
                tableRow.append($('<td>').text(response.results.match[i].awayteam));
                tableRow.append($('<td>').text('0.0')); //response.results.match[i].awayOdds.toFixed(2)));
                tableRow.append($('<td>').text(response.results.match[i].result));
                tableRow.append($('<td>').text('N')); //response.results.match[i].correctScore));
                tableRow.append($('<td>').text('N')); //response.results.match[i].correctResult));
                tableRow.append($('<td>').text('N')); //response.results.match[i].overOrUnder));
                table.append(tableRow);
            }

            // console.log(table.html());
            $('#js-output').append(heading);
            $('#js-output').append(table);
        }
    });
}
