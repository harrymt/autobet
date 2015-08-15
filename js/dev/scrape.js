
function scrapeData() {
  var rootURL = "http://odds.football-data.co.uk/football/england/premier-league/";

  // Get match URL
  var match = "round-16/burnley-v-southampton/";
  var url = rootURL + match + "match-result/all-odds";
  console.log("Betting URL " + url);

  $("#data").load(url + " .allOdds > .contents", function( response, status, xhr ) {
    console.log("Data loaded.");
    displayOdds(scrapeOdds());
  });
}

function displayOdds(odds) {
  var i = 0;

  if (odds.length == 1) {
    $(".intro").append("No Bets found");
  }
  var o = "<pre class='prettyprint'>" + JSON.stringify(odds, null, 4) + "</pre>";
  $('.intro').append(o);
}

// Things we return
var betting = {
  url: "",
  company: "",
  odds: ""
};
var teamOdds = {
  betting: [],
  team: ""
};


// Runs at certain intervals
function scrapeOdds() {
  var scrapedBettingData = []; // teamOdds
  var bettingArr = []; // betting
  var counter = 0;
  var tempTeamName = "";
  $('.contents > tr').find('td:nth-child(n+2)').each(function () {
    var bettingURL = "";
    var bettingCompany = $(this).prop('title');
    var bettingOdds = $(this).text().replace(/\s+/g, '');

    // Get link to Betting page
    if ($(this).attr("onclick") !== undefined) {
      var a = $(this).attr("onclick");
      a = a.slice(1, a.length - 15); // Remove the return false; from onclick attribute
      bettingURL = MakeBettingURL(a.slice(a.indexOf('(') + 1, a.length - 1).split(','));
    }
    if (bettingCompany === "" && bettingURL === "" && bettingOdds !== undefined) {
      if (counter === 0) {
        tempTeamName = bettingOdds;
        counter++;
      } else {
        // Team name
        // console.log("New Team Name : " + bettingOdds);
        scrapedBettingData.push({
          team: tempTeamName,
          betting: bettingArr
        });
        tempTeamName = bettingOdds;
        bettingArr = [];
      }
    } else {
      // Odds
      //console.log(bettingCompany + " " + bettingOdds + " " + bettingURL);
      bettingArr.push({
        url: bettingURL,
        company: bettingCompany,
        odds: bettingOdds
      });
    }
  });

  // Push final team
  scrapedBettingData.push({
    team: tempTeamName,
    betting: bettingArr
  });

  return scrapedBettingData;
}

// [source, id, numerator, denominator, toolbars, bookmakerId]
function MakeBettingURL(arr) {
  return "http://odds.football-data.co.uk/Clickthrough/?source=" + arr[0] + "&id=" + arr[1] + "&numerator=" + arr[2] + "&denominator=" + arr[3] + "&toolbars=" + arr[4] + "&bookmakerId=" + arr[5];
}
