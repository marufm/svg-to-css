
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
    
    init: function() {
        $(document).ready(function() {

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
                            svgconverter.addInfo(e.target.result, id);
                        };
                    })(f);
                    // Read in the image file as a data URL.
                    reader.readAsText(f);
                }
            });
            
        });
    },
    
    addInfo: function( data, id ) {
        data = encodeURIComponent(data);
        data = data.replace(/\(/g,'%28').replace(/\)/g,'%29');
        var element = $('#' + id);
        if( element.length == 0 ) {
            svgconverter.createIconDom(data, id);
        } else {
            svgconverter.updateDomIcon(data, id);
        }
    },
    
    createIconDom: function( data, id ) {
        var iconWrapper = $('<div id="' + id + '" class="icon-info g-block"/>');
        var icon = $('<div class="svg-icon"/>');
        icon.css(svgconverter.create_css_str(data));
        var button = $('<a title="Remove Icon" class="remove-icon" href="#!"></a>').click(function(){
            $(this).parent().parent().remove();
        })
        var fname = $('<div class="filename"><p>' + id + '</p></div>');
        var input_svg = $('<input type="hidden" name="svg_data[]" value="' + data + '" />');
        var input_name = $('<input type="hidden" name="svg_name[]" value="' + id + '" />');
        icon.append(button)
        icon.append(fname);
        icon.append(input_svg)
        icon.append(input_name)

        iconWrapper.append(icon);
        $('#data').append(iconWrapper);

        var svgconverterodestring = '<div class="svg-icon-tile"><div class="svg-icon-filename">' + id + '</div><div class="svg-icon ' + id + '"></div></div>';
        var svgconverterodehtml = $('<div />').text(svgconverterodestring).html();
        var svgconverterodecss = '.svg-icon.' + id + '{ \n background-image:url("data:image/svg+xml,' + data + '"); \n .no-svg & { background-image:url(../images/' + id +'.png);} \n}';

        console.log(svgconverterodecss);

        // $('#digityle-html').append(svgconverterodehtml + '\n');
        // $('#digityle-css').append(svgconverterodecss + '\n');

    },
    
    updateDomIcon: function( data, id ) {
        $( '#' + id + ' .svg-icon' ).css( this.create_css_str( data ) );
        $( '#' + id + ' input' ).attr( 'value', data );
    },
    
    create_css_str: function( data ) {
        return {'background-image' : 'url("data:image/svg+xml,' + data + '")'};
    },
};