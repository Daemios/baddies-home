<?php

use DynamicSuite\API\Response;
use DynamicSuite\Database\Query;

try {

    $data = (new Query())
        ->select()
        ->where('type', '=', $_POST['type_id'])
        ->from('sale_pricing')
        ->execute();

    return new Response('OK', "Retrieved pricing data for type {$_POST['type_id']} sales", $data);

} catch (Exception | PDOException $e) {

    error_log($e->getMessage());
    return new Response('ERROR', 'Error retrieving wow server list');

}