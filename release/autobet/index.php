<!doctype>
<html>
  <head>
    <meta charset="utf-8">
    <title>test</title>
    <!-- All styles -->
    <link rel="stylesheet" href="css/build/main.css">
  </head>
<body>
  <div class='phpSetup'>
    <?php include 'phpsetup.php'; ?>
    <?php include 'scrapeTools.php'; ?>
  </div>

  <div>
    <h3>PHP START</h3>
    <?php include 'retrieve.php'; ?>
    <h3>PHP END</h3>
  </div>


  <p>Data extracted <a href='http://odds.football-data.co.uk/football/england/premier-league/' target="_blank">from this site</a></p>

  <div id="data"></div>
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
