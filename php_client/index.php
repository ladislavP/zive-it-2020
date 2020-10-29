<?php

use Elasticsearch\ClientBuilder;
require 'vendor/autoload.php';

$hosts = [
  'http://127.0.0.1:9201'  // adresa na ElasticSearch
];

$clientBuilder = ClientBuilder::create();   // Vytvorenie noveho ClientBuilder-a
$clientBuilder->setHosts($hosts);           // Nastavenie hostu
$client = $clientBuilder->build();

// $params = [
//     'index' => 'my_index',
//     'id'    => 'my_id'
// ];

// $response = $client->get($params);
// print_r($response);

?>