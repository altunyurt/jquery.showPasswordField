/*
 *  Original version
 *  @author Davin Granroth, http://blog.davingranroth.com/
 *  @date   Feb 12, 2010
 *  @requires   jquery.js
 *
 *  jquery.showPasswordCheckbox.js plugin
 *  http://www.alistapart.com/articles/the-problem-with-passwords/
 *  This is a jQuery implementation based on example 1 from this article.
 *  This script adds a "Show password" checkbox after password fields, and 
 *  when toggled, it shows the password in plain text.
 *
 *  Fields must have a name attribute and be of type="password".
 *  
 *
 *  @author Özgür Altunyurt http://github.com/altunyurt
 *  @date Jul 31, 2011
 *  
 *
 *  Added options. User can choose one of the options, hover or checkbox. 
 *  Checkbox behaves as before. Hover displays the cleartext value when password 
 *  field is hovered.
 *
 *  Removed arbitraryly used jQuery calls and replaced with relevant object names.
 *
 * Default value is checkbox
 *
 *  @example $("input#password").showPasswordField();
 *  @example $("input[type=password]").showPasswordField({option:'checkbox'});
 *  @example $("input[type=password]").showPasswordField({option:'hover'});
 *
 *
 */
jQuery.fn.showPasswordField = function(options) {
    var _options =  {
        type: 'checkbox' // checkbox or hover
    };
    if (_options)
        $.extend(_options, options);

    return this.each(function () {
        var _this = $(this);


        if((_this.attr("type") == "password") && (_this.attr("name") != "undefined")){
            var altPasswordFieldName = "alt_"+_this.attr("name");
            var showPasswordFieldName = "show_"+_this.attr("name");
            var altPasswordField = $("<input type=\"text\" id=\""+altPasswordFieldName+"\" name=\""+altPasswordFieldName+"\" />");
            
            // Markup for text password field
            _this.after(altPasswordField);

            if(_options.type == 'checkbox') {
            
                // Markup for showPassword checkbox
                var showPasswordField = $("<input type=\"checkbox\" id=\""+showPasswordFieldName+"\" /><label for=\""+showPasswordFieldName+"\">Show password</label>");
        
                // Insert the text password field and showPassword field and label
                altPasswordField.after(showPasswordField);
            }  else {
                altPasswordField.after('<label for="' + showPasswordFieldName +'">Hover password field to see it in cleartext </label>')
            }
            
            // Clone attributes from this to #altPassword. Do not include "id" and "type".
            // Otherwise, the altPassword field may not behave or look like the password field.
            var attributes = new Array("align","disabled","maxlength","readonly","size","class","dir","lang","style",
                "value","title","xml:lang","onblur","onchange","onclick","ondblclick","onfocus","onmousedown","onmousemove",
                "onmouseout","onmouseover","onmouseup","onkeydown","onkeypress","onkeyup","onselect");
            for(attribute in attributes){
                if(_this.attr(attributes[attribute]) != "undefined"){
                    altPasswordField.attr(
                        attributes[attribute], 
                        _this.attr(attributes[attribute])
                    );
                }
            }
            
            // Initially obscure the text field, until toggled on.
            // This must come after the attributes or an existing style attribute may override the hide.
            altPasswordField.hide();

            // Toggle the password and altPassword fields' visibility and values as needed
            var shufflePasswordFields = function(jqPassword) {
                if (_options.type == 'checkbox'){
                    showPasswordField.change(function(){
                        if(jqPassword.is(':visible')){
                            // hide password field and show text password field with correct value
                            jqPassword.hide();
                            altPasswordField.val(jqPassword.val()).show();
                        }else{
                            // hide altPassword field and show password field
                            altPasswordField.hide();
                            jqPassword.show();
                        }           
                    });
                } else {
                    altPasswordField.mouseleave(function(){
                        $(this).hide();
                        jqPassword.show().focus().val($(this).val());
                    });
                    jqPassword.hover(function(){
                        $(this).data('timeout', 
                            setTimeout(function(){
                                jqPassword.hide();
                                altPasswordField.show().focus().val(jqPassword.val());
                            }, 200));
                    },
                        function(){
                            clearTimeout($(this).data('timeout'))
                        }
                    );
                }
                // Keep password value in sync with altPassword value
                altPasswordField.change(function(){
                    jqPassword.val(altPasswordField.val());
                });
                
                return jqPassword;
            }
            
            return shufflePasswordFields(_this);
            
        }else{
            // Just return without change if the type is not "password"
            return this;
        }
    });
};
