
$(function() {
    scrapeData();

    var match = { game: '', odds: '' }; // Define a match object

    // Get matches
    match.game = 'Swansea v United'; match.odds = '1.2';
    var matches = [match];


    // Print matches
    printTable(matches);
});


//
// Prints matches to output table.
//
function printTable (output) {
    var tableRow = $('<tr></tr>'); // addClass('');
    for(i = 0; i < output.length; i++){
        var outputGame = $('<td></td>').text(output[i].game);
        var outputOdds = $('<td></td>').text(output[i].odds);
        tableRow.append(outputGame);
        tableRow.append(outputOdds);

        var outputBetLink = $('<td></td>').append('<a href=#>Bet Now</a>');
        tableRow.append(outputBetLink);
    }

    $('#js-output').after(tableRow);

}
