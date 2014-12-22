<!doctype>
<html>
  <head>
    <meta charset="utf-8">
    <title>test</title>
    <!-- All styles -->
    <link rel="stylesheet" href="css/build/main.css">
  </head>
<body>

  <div>
<!--     <h3>PHP START</h3>
    < ?php include 'retrieve.php'; ? >
    <h3>PHP END</h3> -->
  </div>

  <h2>WARNING Cross origin resource sharing will need to be enabled to use this</h2>
  <h3>Get <a target="_blank" href="https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi?hl=en">a chrome extension</a> as a work around </h3>
  <p>Data extracted <a href='http://odds.football-data.co.uk/football/england/premier-league/' target="_blank">from this site</a></p>

  <div id="data"></div>

  <div class='link altMatchURL'>round-16/chelsea-v-hull-city</div>
  <div class='link altMatchURL'>round-16/leicester-city-v-manchester-city</div>
  <div class='link altMatchURL'>round-16/crystal-palace-v-stoke-city</div>
  <div class='link altMatchURL'>round-17/newcastle-united-v-sunderland</div>

  <input class='textbox' id='matchURL' type="text" name="url" value="round-16/burnley-v-southampton" placeholder="match url">
  <input class="button" type="button" name="showOdds" value="Show Odds" onclick='scrapeData();'>
  <div id="console"></div>
  <div id="odds"></div>

  <!-- Jquery -->
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.6.3/jquery.min.js"></script>
  <!-- All JS files -->
  <script src="js/build/main.js"></script>
</body>
</html>
