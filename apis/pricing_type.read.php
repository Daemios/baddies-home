<?php

use DynamicSuite\API\Response;
use DynamicSuite\Database\Query;

try {

    $data = (new Query())
        ->select()
        ->from('sale_pricing_types')
        ->execute(false, PDO::FETCH_KEY_PAIR);

    return new Response('OK', "Retrieved pricing type data", $data);

} catch (Exception | PDOException $e) {

    error_log($e->getMessage());
    return new Response('ERROR', 'Error retrieving wow server list');

}