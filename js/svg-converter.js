

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

                var optionsDiv = $('#format-shell');
                var outputDiv = $('#outputs-shell');
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
                        };
                    })(f);
                    // Read in the image file as a data URL.
                    reader.readAsText(f);

                    if(i == 0){
                        outputDiv.addClass('shown');
                        optionsDiv.addClass('shown');
                        $('body').addClass('iconed');
                    }
                }



            });

            
            $( "#options-form" ).on( "submit", function( event ) {
                event.preventDefault();
                  //console.log( $( this ).serializeArray() );

                var optionfields =  $( this ).serializeArray();
                
                var format, encoding;
                jQuery.each( optionfields, function( i, field ) {
                    if(field.name === 'encoding'){
                        encoding = field.value;
                    }
                    if(field.name === 'format'){
                        format = field.value;
                    }
                });

                svgconverter.spitOutCss(encoding, format);

            });

            $( "#btn_toggle_bgc" ).on("click", function(event){ 
                event.preventDefault();
                $('body').toggleClass('inverted-colour');
            });
        
    },
    
    make_svg_element: function( svg_data, svg_name ) {
        
        // Create Dom Element Variable
        var dom_element = $('<div />', {id: svg_name,class: 'svg-icon-shell'});
        dom_element.data("raw_svg_data", svg_data);   // add svg data to dom element
        dom_element.data("file_name", svg_name);    // add svg name to dom element
        
        

        // check to see if this svg already exists by doing a dom search
        // length should be greather than 0;
        var element_check = $('#' + svg_name);
        if( element_check.length == 0 ) {
            var shell = $('<div />', {class: "content-shell",});
            var icon = $('<div />', {class: "svg-icon",});
            //icon.css(svgconverter.create_css_str(post_svg_data));
            var button = $('<a title="Remove Icon" class="remove-icon" href="#!">Remove</a>').click(function(){
                $(this).parent().parent().parent().remove();
            })
            var fname = $('<div class="filename"><p>' + svg_name + '</p></div>');
            var make_str = svgconverter.create_css_str(svg_data,"<uri></uri>");
            //icon.css(svgconverter.create_css_str(svg_data, "uri", "object"));
            icon.append(svg_data);
            icon.appendTo(shell);
            button.appendTo(fname);
            fname.appendTo(shell);
            shell.appendTo(dom_element);
            
            dom_element.appendTo('#data');
        } else {
            //$( '#' + svg_name + '.svg-icon-shell').css( svgconverter.create_css_str( svg_data, "uri", "object") );
            var ele =  $( '#' + svg_name + '.svg-icon');
            ele.html( svg_data );
            ele.data("raw_svg_data", svg_data);
        }
    },
    
    create_css_str: function( data , encoding, type) {

        var css_str;

        if(encoding == "uri"){
            
            css_str = 'url("data:image/svg+xml,' + svgconverter.create_escaped_data(data, "uri") + '")';
            
        }else if(encoding == "b64"){
            css_str = 'url("data:image/svg+xml;base64,' + svgconverter.create_escaped_data(data, "uri") + '")';
        }
        
        if(type == "object"){
            return {'background-image' : css_str};
        }else{
            return "background-image: " + css_str + ';'
        }
        
    },

    create_escaped_data: function (raw_data, encoding_to_use){
        var data_string,
            processed_svg_data;

        if(encoding_to_use == "uri"){
                processed_svg_data = encodeURIComponent(raw_data);
                processed_svg_data = processed_svg_data .replace(/\(/g,'%28').replace(/\)/g,'%29');
        }else if(encoding_to_use == "b64"){
                processed_svg_data = btoa(raw_data);
        }

        return processed_svg_data;
    },

    spitOutCss: function (encoding, format){

        var encoding_to_use, format_to_use;

        var output_text_area = $('#output');
        output_text_area.val("");

        var svgs = $('#data > .svg-icon-shell').each(function(index){
            var raw_svg_data = $(this).data('raw_svg_data'),
                svg_name = $(this).data('file_name'),
                processed_svg_data,
                final_string;

            processed_svg_data = svgconverter.create_escaped_data(raw_svg_data, encoding);

            switch (format){
                case "css":
                    final_string = '.' + svg_name + '{background-image:url("data:image/svg+xml,' + processed_svg_data + '");}\n';
                    final_string += '.no-svg .' + svg_name + '{background-image:url(../PNG_DIRECTORY/'+ svg_name +'.png)}'; 
                    break;
                case "scss":
                    final_string = '.' + svg_name + '{background-image:url("data:image/svg+xml,' + processed_svg_data + '");}';
                    break;
                case "less":
                    final_string = '.' + svg_name + '{background-image:url("data:image/svg+xml,' + processed_svg_data + '");}';
                    break;
            }

            output_text_area.val( output_text_area.val() + '\n\n' + final_string);
        });


    },

    getCssOptions: function(){

    }
};