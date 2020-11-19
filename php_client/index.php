<?php

use Elasticsearch\ClientBuilder;

require 'vendor/autoload.php';

$hosts = [
  'http://127.0.0.1:9201'  // adresa na ElasticSearch
];

$clientBuilder = ClientBuilder::create();   // Vytvorenie noveho ClientBuilder-a
$clientBuilder->setHosts($hosts);           // Nastavenie hostu
$client = $clientBuilder->build();

$name = 'Laser';  // nazov
$value = '411';   // produktovy kod
$value_id = '180246'; // id

//$params = [
//  'index' => 'produkty',
//  'body'  => [
//    'query' => [
//      'bool' => [
//        'should' => [
//          ['wildcard' => ['Nazov' => '*' . $name . '*'] ]
//        ]
//      ]
//    ]
//  ]
//];

$params = [
    'index' => 'produkty',
    'body' => [
        'query' => [
            "bool" => [
                'should' => [
                    [
                        'match' => [
                            'Id' => [
                                'query' => $value_id,
                            ]
                        ]
                    ],
                    [
                        'match' => [
                            'Nazov' => [
                                'query' => $name,
                            ]
                        ]
                    ],
                    [
                        'match' => [
                            'Produktovy kod' => [
                                'query' => $value,
                            ]
                        ]
                    ]

                    /* [
                        'multi_match' => [
                            'query' => $query,
                            'fuzziness' => 'AUTO',
                            "prefix_length" => 0,
                            "max_expansions" => 100,
                            'fields' => ['product_number', 'product_name', 'producer_name'],
                        ]
                    ] */
                ]
            ]
        ]
    ]
];

$results = $client->search($params);

//print_r($results);

//echo '</pre>', $results, ' </pre>';

foreach ($results['hits']['hits'] as $result => $value) {
  print_r($value['_source']);
}
