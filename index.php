<html lang="en">
    <head>
        <title>Chaturbate Chat Hearts</title>
        <script src="jquery.min.js"></script><!-- jQuery -->
        <link rel="stylesheet" type="text/css" href="index.css" /><!-- The main stylesheet -->
    </head>
    <body>
        <!-- Check that the room variable is specified... -->
        <?php if ( isset( $_GET['room'] ) ) : ?>

            <input type="hidden" id="room" value="<?php echo $_GET['room']; ?> "/>
            <div id="screen">
                <div id="bounce-box"></div>
            </div>
            <button id="test-tip">Test Tip</button><!-- For testing purposes only -->
            <script src="index.js"></script><!-- The main script  -->
        <?php else : ?>
            <h3>Sorry you must specify a room name, AKA your Chaturbate Username...</h3><!-- Show Error Message -->
        <?php endif; ?>
    </body>
</html>