
/**
 * Useful function to serialize form data for ajax requests
 */
$(function() {
    
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

/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

function domReadyFuncs(){
    $('#btn-tool-info').click(function(){
        $('#tool-info').show();
        $(this).hide();

        $('#btn-info-close').unbind().click(function(){
            $('#tool-info').hide();
            $('#btn-tool-info').show();
         });

    });
}

var svgc = {
    
    init: function() {
        $(document).ready(function() {

            domReadyFuncs();
            
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
                            svgc.addInfo(e.target.result, id);
                        };
                    })(f);
                    // Read in the image file as a data URL.
                    reader.readAsText(f);
                }

                // checking if anything (ie svgs) exist in the data div


                if ( $('#data').children().length < 1 && files.length > 0){
                    // Yes i know this is bad, just doing this for now,
                    // it'll take a bit of time to write something more robust
                    var div_drop_zone = $('#drop_zone');
                    var div_step_2 =  $('#step-2-info');
                    var div_package_opt = $('#package-options');
                    var btns_package = $('#package-options button, #package-options .button');
                    div_drop_zone.children('.state-1').hide();
                    div_drop_zone.children('.state-2').show();
                    div_step_2.children('.state-1').hide();
                    div_step_2.children('.state-2').show();
                    div_package_opt.children('.state-1').hide();
                    div_package_opt.children('.state-2').show();
                    btns_package.show();
                    div_package_opt.css({
                        // the block is 3 units tall
                        // so to the current height add height of a single block x 3
                        height:div_package_opt.outerHeight() + ((div_package_opt.outerHeight()/3) * 2)
                    });
                    $('#btn-get-code').unbind().bind('click', function(){
                        $('#digityle').show();
                        $('#data .remove-icon').hide();
                    })
                }
            });
            
        });
    },
    
    addInfo: function( data, id ) {
        data = encodeURIComponent(data);
        data = data.replace(/\(/g,'%28').replace(/\)/g,'%29');
        var element = $('#' + id);
        if( element.length == 0 ) {
            svgc.createDomIcon(data, id);
        } else {
            svgc.updateDomIcon(data, id);
        }
    },
    
    createDomIcon: function( data, id ) {
        var iconWrapper = $('<div id="' + id + '" class="icon-info g-block"/>');
        var icon = $('<div class="svg-icon"/>');
        icon.css(svgc.cssbg(data));
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

        var svgcodestring = '<div class="svg-icon-tile"><div class="svg-icon-filename">' + id + '</div><div class="svg-icon ' + id + '"></div></div>';
        var svgcodehtml = $('<div />').text(svgcodestring).html();
        var svgcodecss = '.svg-icon.' + id + '{ \n background-image:url("data:image/svg+xml,' + data + '"); \n .no-svg & { background-image:url(../images/' + id +'.png);} \n}';

        console.log(svgcodecss);

        $('#digityle-html').append(svgcodehtml + '\n');
        $('#digityle-css').append(svgcodecss + '\n');

    },
    
    updateDomIcon: function( data, id ) {
        $( '#' + id + ' .svg-icon' ).css( this.cssbg( data ) );
        $( '#' + id + ' input' ).attr( 'value', data );
    },
    
    cssbg: function( data ) {
        return {'background-image' : 'url("data:image/svg+xml,' + data + '")'};
    },
    
    getFromData: function() {
        return $('form#svg-data').serializeObject();
    },
    
    download: function() {
        // this needs to insert a hidden iframe with the post data to auto trigger download
        $.post( 'promotion/remove_skus', svgc.getFromData(), function( data ) {
        
        });
    }
    
};