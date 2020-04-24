<?php
$sql_args = [
	'server'   => 'localhost',
	'user'     => 'chaturbate',
	'pass'     => 'xf21l2p5S7',
	'database' => 'chaturbate',
];

//region SQL

/**
 * Reads the pending rows from the database, marks them as not pending, and exports them as a json.
 * Used by index.php
 *
 * @param string $room The room name AKA the user's Chaturbate username
 *
 * todo: Change to PDO
 */
function get_rows( $room ) {
	global $sql_args;
	try {
		$conn = new mysqli( $sql_args['server'], $sql_args['user'], $sql_args['pass'], $sql_args['database'] );
		if ( $conn->connect_error ) {
			die('Failed to open the database: ' . $conn->connect_error);
		}
		$room = $conn->real_escape_string( $room );
		$query1 = "SELECT  id, user, tip FROM messages_old WHERE pending = '1' AND room = '$room'";
		$query2 = "UPDATE messages_old SET pending = 0 WHERE ID in (%s)";

		$result = $conn->query( sprintf($query1, $room));
		if ( $result->num_rows > 0 ) {
			$data = $result->fetch_all(MYSQLI_ASSOC );
			$result->free_result();

			$ids = array_map(function($value){
				return $value['id'];
			}, $data);

			mysqli_query( $conn, sprintf($query2, implode(',', $ids)) );
			$conn->close();

			header('Content-Type: application/json');
			die(json_encode($data));
		}
	} catch (Exception $ex) {
		die( 'Error: ' . $ex->getMessage()  );
	}
	header('Content-Type: application/json');
	die('[]');
}

/**
 * Inserts the messages from the Chrome Extension into the database, if there is a tip, set
 * pending to true. Pending is only true for tips as they are what will be read by index.php
 * and displayed as notifications (hearts)
 *
 * @param array $data
 * * @var string action   Which action to preform
 * * @var string room     The room aka Chaturbate Username
 * * @var string user     The user sending the message / tip
 * * @var string userType The type of user sending the message (Tips will always be Other)
 * * @var string message  The Message sent.
 * * @var int tip      The tip amount sent
 *
 * todo: change to PDO
 */
function insert_row( $data ) {

	global $sql_args;


	try {
		$conn = new mysqli( $sql_args['server'], $sql_args['user'], $sql_args['pass'], $sql_args['database'] );
		if ( $conn->connect_error ) {
			die('Failed to insert into database: ' . $conn->connect_error);
		}
		if ( $sql = $conn->prepare("INSERT INTO messages_old (room, action, user, user_type, message, tip, pending) values ( ?,?,?,?,?,?,? )") ) {
			$tip = $data['tip'] ? 1 :0;
			$sql->bind_param('sssssii', $data['room'], $data['action'], $data['user'], $data['userType'], $data['message'], $data['tip'], $tip);
			$sql->execute();
			$sql->close();
		}
		$conn->close();
	} catch(PDOException $e) {
		die( 'Error: ' . $e->getMessage() );
	}
	die('SUCCESS');

}

//endregion

/**
 * Combine user attributes with known attributes and fill in defaults when needed.
 *
 * @param array $pairs Entire list of supported attributes and their defaults.
 * @param array $atts User defined attributes
 *
 * @return array Combined attribute list.
 */
function shortcode_atts( $pairs, $atts) {
	$atts = (array) $atts;
	$out  = array();
	foreach ( $pairs as $name => $default ) {
		if ( array_key_exists( $name, $atts ) ) {
			$out[ $name ] = $atts[ $name ];
		} else {
			$out[ $name ] = $default;
		}
	}
	return $out;
}

/**
 * Populate the data variable with the post vars, and filter it.
 *
 * @var $data
 */
$data = shortcode_atts([
			'action' => false,
			'room' => false,
			'user' => false,
			'userType' => false,
			'message' => false,
			'tip'     => 0
], $_POST );

/** Ensure that tip is an integer */
$data['tip'] = ($data['tip'] != 'false') ? $data['tip'] : 0;

/** If Retrieving Data print the json */
if ( $data['action'] === 'get' && $data['room'] ) {
	get_rows( $data['room'] );
/** If adding data, send to database, must have message or tip. */
}elseif ( $data['action'] && $data['action'] !== 'get' && ( $data['message'] || $data['tip'] ) ) {
	insert_row( $data );
}

