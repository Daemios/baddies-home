<?php

use DynamicSuite\API\Response;
use DynamicSuite\Database\Query;

try {

    $data = (new Query())
        ->select(['name', 'name'])
        ->where('name', 'LIKE', "%{$_POST['term']}%")
        ->from('wow_servers')
        ->limit(10)
        ->execute(false, PDO::FETCH_KEY_PAIR);

    return new Response('OK', 'Retrieved wow server list', $data);

} catch (Exception | PDOException $e) {

    error_log($e->getMessage());
    return new Response('ERROR', 'Error retrieving wow server list');

}