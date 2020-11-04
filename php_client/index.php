<?php

use Elasticsearch\ClientBuilder;

require 'vendor/autoload.php';

$hosts = [
  'http://127.0.0.1:9201'  // adresa na ElasticSearch
];

$clientBuilder = ClientBuilder::create();   // Vytvorenie noveho ClientBuilder-a
$clientBuilder->setHosts($hosts);           // Nastavenie hostu
$client = $clientBuilder->build();

$name = 'Laser';

$params = [
  'index' => 'produkty',
  'body'  => [
    'query' => [
      'bool' => [
        'should' => [
          ['wildcard' => ['Nazov' => '*' . $name . '*']]
        ]
      ]
    ]
  ]
];

$results = $client->search($params);

// print_r($results);

// echo "</br> </br>";

foreach ($results['hits']['hits'] as $result => $value) {
  print_r($value['_source']);
}
