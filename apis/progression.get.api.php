<?php

use DynamicSuite\API\Response;

try {

    $ranks_url = 'https://raider.io/api/v1/guilds/profile?region=us&' .
        'realm=Stormreaver&name=Baddies&fields=raid_rankings';

    $progression_url = 'https://raider.io/api/v1/guilds/profile?region=us&' .
        'realm=Stormreaver&name=Baddies&fields=raid_progression';


    $response['ranks'] = json_decode(file_get_contents($ranks_url), true)['raid_rankings'];
    $response['progression'] = json_decode(file_get_contents($progression_url), true)['raid_progression'];

    return new Response('OK', 'Raid information retrieved', $response);

} catch (Exception $e) {

    return new Response('ERROR', 'Error retrieving guild raid information');

}