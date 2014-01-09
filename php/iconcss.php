<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Creates a new css file
 *
 * @author alexis
 */
class iconcss {
    
    private $_img_format = null;// png or svg
    private $_img_encode = null;// utf8, urlencoded, base64
    
    private $_svgs = array();
    
    public function __construct( $format, $encode ) {
        $this->_img_format = $format;
        $this->_img_encode = $encode;
    }
    
    public function addIcon( $name, svg $icon ) {
        if( $this->_img_format == 'svg' ) {
            $this->_svgs[$name] = (string)$icon;
        } else { // assume png
            $this->_svgs[$name] = $icon->toPng();
        }
    }
    
    public function get() {
        // encode data
        $encoding = '';
        if( $this->_img_encode == 'base64' ) {
            array_walk( $this->_svgs, function( &$n ) {
                $n = base64_encode($n);
            });
            $encoding = ';base64';
        } elseif ( $this->_img_encode == 'utf8' ) {
            $encoding = ';utf8';
        } elseif ( $this->_img_encode == 'url' ) {
            array_walk( $this->_svgs, function( &$n ) {
                $n = rawurlencode($n);
            });
        }
        // mime type
        $mime = '';
        if( $this->_img_format == 'png' ) {
            $mime = 'png';
        } elseif( $this->_img_format == 'svg' ) {
            $mime = 'svg+xml';
        }
        
        $output = '';
        if( $this->_img_format == 'ie7' )
            foreach( $this->_svgs as $name => $data)
                $output .= PHP_EOL . ".$name {
                    filter: progid:DXImageTransform.Microsoft.AlphaImageLoader(src='ie/$name.png',sizingMethod='crop');
                    -ms-filter: \"progid:DXImageTransform.Microsoft.AlphaImageLoader(src='ie/$name.png',sizingMethod='crop')\";;
                }" . PHP_EOL;
        else
            foreach( $this->_svgs as $name => $data)
                $output .= PHP_EOL . ".$name {background: url('data:image/$mime$encoding,$data');}" . PHP_EOL;
        
        return $output;
    }

}
