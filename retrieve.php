<?php

    // To convert fractional odds to decimal,
    // divide the first figure by the second figure
    // add 1.00 (so 11/4 = 2.75, then add 1.00 = 3.75).
    function fractionalOddsToDecimal($fractionalOdds) {
        $pieces = explode("/", $fractionalOdds);
        $decimalOdds = 1.00 + ($pieces[0] / $pieces[1]);
        return $decimalOdds;
    }

    $url = 'http://odds.football-data.co.uk/football/england/premier-league/round-18/chelsea-v-west-ham/match-result/all-odds';

    $scraped_page = curl($url);

    // Title
    echo "Title : " . scrape_between($scraped_page, "<title>", "</title>") . "<br>";

    $scraped_data = scrape_between($scraped_page, "<div id=\"oddsContainer\">", "<div id=\"floatArea\"></div>");


    // Find all odds in scraped_data
    // Loop around the results
    // Get the odds
    // Put them through fractional Odds to Decimal
    // Print out both
    // Get the betfair shop ... place to place the bet
    // print that out
    echo trim($scraped_data);
?>
