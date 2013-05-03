<?php
// Report all errors except E_NOTICE
// This is the default value set in php.ini
ini_set('error_reporting', E_ALL);

// prevent calling this page without post data
if( !$_POST ) {
    exit('death');
}

function timestamp() {
    $now = strtotime('now');
    $format = 'YmdGis';
    $nice = date($format, $now);
    return $nice;
}

// assume post data is a list of urlencoded svg's
// should really have some validation
require 'svg.php';
require 'iconcss.php';

// set up zip file
$zip = new ZipArchive();
$folder = 'tmp/';
$zipfilename = timestamp() . '.zip';
if ( $zip->open( $folder . $zipfilename, ZIPARCHIVE::CREATE )!==TRUE ) {
    exit("cannot open <$zipfilename>\n");
}
$zip->addEmptyDir('ie');
$zip->addEmptyDir('src');

// set up generated files
$csspng = new iconcss('png', 'base64');
$cssie7 = new iconcss('ie7', 'base64');
$csssvg = new iconcss('svg', $_POST['encoding']);
$html = '';

$totalSVG = count( $_POST['svg_data'] );
$svg_data = $_POST['svg_data'];
$svg_name = $_POST['svg_name'];

for( $i=0; $i < $totalSVG; $i++ ) {
    
    $svgdata = urldecode( $svg_data[$i] );
    $svgname = $svg_name[$i];
    
    $svg = new svg( $svgdata );
    $svg->clean();
    $zip->addFromString( 'ie/' . $svgname . '.png', $svg->toPng() );
    $zip->addFromString( 'src/' . $svgname . '.svg', (string)$svg );
    
    $csspng->addIcon( $svgname, $svg );
    $csssvg->addIcon( $svgname, $svg );
    $cssie7->addIcon( $svgname, clone $svg );
    
    $html .= "<div class='icon $svgname'>&nbsp;</div>";
}

$html = '<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <title>SVG Test Sheet</title>
    
    <!-- Nice svg icons -->
    <link rel="stylesheet" type="text/css" href="svg-icons.css" />
    
    <!-- ie8 doesnt support svg so give em some pngs
         These are base64 encoded pngs allowing them to be self contained in one file
         effectivly this is like a sprite sheet (only one resouce request from the browser) -->
    <!--[if IE 8]>
            <link rel="stylesheet" type="text/css" href="svg-png-icons.css" />
    <![endif]-->
    
    <!-- ie7 doesnt support data uri so we need to link to the external files
         & wrap em in the ie Alpha Loader for support in ie6 -->
    <!--[if lt IE 7]>
            <link rel="stylesheet" type="text/css" href="svg-png-ie7-icons.css" />
    <![endif]-->
    
    <style>
    .icon {width: 100px; height: 100px}
    </style>
</head>
<body>
    ' . $html . '
</body>
</html>';

$zip->addFromString( 'svg-icons.css', $csssvg->get() );
$zip->addFromString( 'svg-png-icons.css', $csspng->get() );
$zip->addFromString( 'svg-png-ie7-icons.css', $cssie7->get() );
$zip->addFromString( 'test.html', $html );
$zip->close();

// prompt download
header('Content-Type: application/zip');
header("Content-disposition: attachment; filename=$zipfilename");
header('Content-Length: ' . filesize($folder . $zipfilename));
readfile($folder . $zipfilename);