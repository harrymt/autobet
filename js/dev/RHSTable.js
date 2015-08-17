
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


    // Get Fixtures
    var url = "https://www.kimonolabs.com/api/5ngo4jjk?apikey=RbOBR2dkBMXKj1pxkxWWUYEJperNuBsv";
    $.ajax({
        url: url,
        crossDomain: true,
        dataType: 'jsonp',
        success: function(response) {
            console.log(response);
            console.log("Found " + response.results.match.length + " matches");
            var gameweek = 1;
            var output = $('<div></div>');
            var table = $('<table>').append(
                $('<tr>').append(
                    $("<th>").text('Date'),
                    $("<th>").text('Home'),
                    $("<th>").text('Odds'),
                    $("<th>").text('Away'),
                    $("<th>").text('Odds'),
                    $("<th>").text('Home Result'),
                    $("<th>").text('Away Result'),
                    $("<th>").text('Correct Score'),
                    $("<th>").text('Correct Result'),
                    $("<th>").text('Over/Under')
                )
            );
            for(i = 0; i < response.results.match.length; i++) {
                if(i % 10 === 0 && i !== 0) {
                    output.append($('<h1></h1>').text("Game Week " + gameweek++));
                    output.append(table);
                    table = $('<table>').append(
                        $('<tr>').append(
                            $("<th>").text('Date'),
                            $("<th>").text('Home'),
                            $("<th>").text('Odds'),
                            $("<th>").text('Away'),
                            $("<th>").text('Odds'),
                            $("<th>").text('Home Result'),
                            $("<th>").text('Away Result'),
                            $("<th>").text('Correct Score'),
                            $("<th>").text('Correct Result'),
                            $("<th>").text('Over/Under')
                        )
                    );
                }

                var tableRow = $('<tr></tr>');
                tableRow.append($('<td>').text(response.results.match[i].date));
                tableRow.append($('<td>').text(response.results.match[i].hometeam));
                tableRow.append($('<td>').text('0.0')); //response.results.match[i].homeOdds.toFixed(2)));
                tableRow.append($('<td>').text(response.results.match[i].awayteam));
                tableRow.append($('<td>').text('0.0')); //response.results.match[i].awayOdds.toFixed(2)));

                if (response.results.match[i].result != "v") {
                    tableRow.append($('<td>').text(response.results.match[i].result.split(' - ')[0]));
                    tableRow.append($('<td>').text(response.results.match[i].result.split(' - ')[1]));
                } else {
                    tableRow.append($('<td>').text("-"));
                    tableRow.append($('<td>').text("-"));
                }

                tableRow.append($('<td>').text('N')); //response.results.match[i].correctScore));
                tableRow.append($('<td>').text('N')); //response.results.match[i].correctResult));
                tableRow.append($('<td>').text('N')); //response.results.match[i].overOrUnder));
                table.append(tableRow);
            }

            $('#js-output').append(output);
        }
    });
}
