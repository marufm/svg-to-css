
/**
 * Useful function to serialize form data for ajax requests
 */
/*$(function() {
    
    $.fn.serializeObject = function() {
        var o = {};
        var a = this.serializeArray();
        $.each(a, function() {
            if (o[this.name] !== undefined) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    };
    
});
*/
/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

$('document').ready(function(){

     svgconverter.init(); 
});

var svgconverter = {

    svgs: {
        svg_ids: [],
        svg_data: [],
        add_svg: function(){

        }
    },
    
    init: function() {
        

            // Check for the various File API support.
            if (window.File && window.FileReader && window.FileList && window.Blob) {
                // Great success! All the File APIs are supported.
            } else {
                alert('The File APIs are not fully supported in this browser.');
            }
            
            jQuery.event.props.push('dataTransfer');     
                        
            // listen to body grag & drop

            var bodyelement = $('body');

            bodyelement.bind('dragover', function(thisEvent) {   // using dragover instead of dragenter as it wasn't firing and causing erros
                thisEvent.stopPropagation();
                thisEvent.preventDefault();
                            
                thisEvent.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
                            
                $(this).addClass('over');
                            
                return false;
            });

            bodyelement.bind('dragleave', function() {
                $(this).removeClass('over');
                return false;
            });

            bodyelement.bind('drop', function(thisEvent) {
                thisEvent.stopPropagation();
                thisEvent.preventDefault();
                $(this).removeClass('over');
                // removes old svgs
                //$('#data').html(' ');
                var files = thisEvent.dataTransfer.files; // FileList object
                // Loop through the FileList and render image files as thumbnails.
                for (var i = 0, f; f = files[i]; i++) {

                    if (!f.type.match('image/svg')) {
                        continue;
                    }

                    var reader = new FileReader();
                    // Closure to capture the file information.
                    reader.onload = (function(theFile) {
                        return function(e) {
                            var id = theFile.name.substr(0, theFile.name.lastIndexOf('.'));
                            svgconverter.make_svg_element(e.target.result, id);
                            console.log('here');
                        };
                    })(f);
                    // Read in the image file as a data URL.
                    reader.readAsText(f);
                }



            });
            
            $( "#options-form" ).on( "submit", function( event ) {
                event.preventDefault();
                  //console.log( $( this ).serializeArray() );

                var optionfields =  $( this ).serializeArray();

                var encoding_to_use = "",
                    format_to_use = "";
                
                jQuery.each( optionfields, function( i, field ) {
                    if(field.name === 'encoding'){
                        encoding_to_use = field.value;
                    }
                    if(field.name === 'format'){
                        format_to_use = field.value;
                    }
                });

                switch (encoding_to_use){
                    case "utf8":
                        console.log('Making utf8 encoded code');
                        break;
                    case "uri":
                        console.log('Making uri encoded code');
                        break;
                    case "b64":
                        console.log('Making base64 encoded code');
                        break;
                }

                switch (format_to_use){
                    case "css":
                        console.log('Making utf8 encoded code');
                        break;
                    case "scss":
                        console.log('Making uri encoded code');
                        break;
                }

            });
        
    },
    
    make_svg_element: function( svg_data, svg_name ) {
        
        // Create Dom Element Variable
        var dom_element = $('<div />', {id: svg_name,});
        dom_element.data("raw_svg_data", svg_data);   // add svg data to dom element
        dom_element.data("file_name", svg_name);    // add svg name to dom element



        // var dom_element = $('<div />', {id: svg_name,});
        post_svg_data = encodeURIComponent(svg_data);
        post_svg_data = post_svg_data.replace(/\(/g,'%28').replace(/\)/g,'%29');
        

        // check to see if this svg already exists by doing a dom search
        // length should be greather than 0;
        var element = $('#' + svg_name);
        if( element.length == 0 ) {
            
            var icon = $('<div />', {class: "svg-icon",});
            icon.css(svgconverter.create_css_str(post_svg_data));
            var button = $('<a title="Remove Icon" class="remove-icon" href="#!"></a>').click(function(){
                $(this).parent().parent().remove();
            })
            var fname = $('<div class="filename"><p>' + svg_name + '</p></div>');
            icon.appendTo(dom_element);
            fname.appendTo(dom_element);
            button.appendTo(dom_element);
            dom_element.appendTo('#data');
            //svgconverter.createIconDom(data, id);
        } else {
            $( '#' + svg_name + '.svg-icon').css( svgconverter.create_css_str( post_svg_data ) );
        }
    },

    createIconDom: function( data, id ) {
        var iconWrapper = $('<div id="' + id + '" class="icon-info"/>');
        
       
       
        //var input_svg = $('<input type="hidden" name="svg_data[]" value="' + data + '" />');
        // var input_name = $('<input type="hidden" name="svg_name[]" value="' + id + '" />');
        icon.append(button);
        icon.append(fname);

        iconWrapper.append(icon);
        $('#data').append(iconWrapper);

        // var svgc_string = '<div class="svg-icon-tile"><div class="svg-icon-filename">' + id + '</div><div class="svg-icon ' + id + '"></div></div>';
        // var svgc_html = $('<div />').text(svgc_string).html();
        // var svgc_css = '.svg-icon.' + id + '{ \n background-image:url("data:image/svg+xml,' + data + '"); \n .no-svg & { background-image:url(../images/' + id +'.png);} \n}';

        

        // $('#digityle-html').append(svgc_html + '\n');
        // $('#digityle-css').append(svgc_css + '\n');

    },
    
    updateDomIcon: function( data, id ) {
        $( '#' + id + ' .svg-icon' ).css( this.create_css_str( data ) );
        $( '#' + id + ' input' ).attr( 'value', data );
    },
    
    create_css_str: function( data ) {
        return {'background-image' : 'url("data:image/svg+xml,' + data + '")'};
    },

    spitOutCss: function (){

    },

    getCssOptions: function(){

    }
};