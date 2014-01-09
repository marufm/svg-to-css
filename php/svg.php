<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of svg
 *
 * @author alexis
 */
class svg {
    
    public $format = 'urlencode';
    
    private $_svg = null;
    private $_cleansvg = null;
    
    private $_png = null;
    
//    private $_name = null;

    /**
     * 
     * @param XML $svgxml
     */
    public function __construct( $svgxml ) {
        $this->_svg = $svgxml;
    }
    
    function toPng() {
        // if we've already generated the png just return it
        if( $this->_png != null )
            return $this->_png;
        
        // make a new png
        $im = new Imagick();
        $im->setBackgroundColor( new ImagickPixel( 'transparent' ) );
        $im->readImageBlob( $this->_svg );
        $im->setImageFormat( "png32" );
        $im->setcompressionquality( 100 );
        $this->_png = $im->getimageblob();
        return $this->_png;
    }

    function clean() {
        // strip comments
        $dom = new DOMDocument();
        $dom->preserveWhiteSpace = false;
        $dom->loadXML( $this->_svg );
        $xpath = new DOMXPath( $dom );
        foreach ($xpath->query('//comment()') as $comment) {
            $comment->parentNode->removeChild($comment);
        }
        // remove xml header
        $svgnode = $dom->getElementsByTagName('svg');
        $this->_cleansvg = $dom->saveXml( $svgnode->item(0) );
        $this->_svg = $dom->saveXml();
    }
    
    function validate() {
        // ensure this svg is valid (contains <xml> head)
    }
    
    public function get_svg() {
        return $this->_cleansvg;
    }
    
    function __toString() {
        return $this->_cleansvg;
    }
    
}

