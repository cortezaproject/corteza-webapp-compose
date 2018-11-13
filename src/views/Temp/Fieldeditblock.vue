<template>
   <div class="vue-grid-layout" style="height: 890px;">
      <div class="vue-grid-item cssTransforms" style="transform: translate3d(10px, 10px, 0px); width: 594px; height: 350px; position: absolute;">
         <div>
           <!-- start CRM page block -->
            <div class="gridblock_contents block_edit_fields">
               <div class="blockname">Blockname</div>
               <div class="block_header">Block header text</div>
               <div class="form_row">
                  <label class="form_label" for="first_name">First Name</label><br>
                  <div class="form_value_viewing_mode">
                    <input id="first_name" class="form_input" name="first_name" value="John" type="text">
                  </div>
               </div>
               <div class="form_row">
                  <label class="form_label" for="last_name">Last Name</label><br>
                  <div class="form_value_viewing_mode">
                    <textarea id="last_name" class="form_input" name="last_name" type="text">Doe</textarea>
                  </div>
               </div>
               <div class="form_row">
                  <label class="form_label" for="title">Title</label><br>
                  <div class="form_value_viewing_mode">
                    <select id="title" class="form_input" name="title">
                      <option value="CEO" selected="selected">CEO</option>
                      <option value="Senior developer">Senior developer</option>
                      <option value="Another option with a long value">Another option with a long value</option>
                    </select>
                  </div>
               </div>
               <div class="form_row">
                  <label class="form_label" for="email">Email</label><br>
                  <div class="form_value_viewing_mode">
                    <input id="email" class="form_input" name="email" value="test@email.com" type="text">
                  </div>
               </div>
               <div class="form_row">
                  <label class="form_label">Phone</label><br>
                  <div class="form_value_viewing_mode">
                    <div class="form_radio_checkbox_row">
                      <input type="radio" class="form_input" checked="checked" name="phone" id="phone_option1" value="555-555-5555"/>
                      <label for="phone_option1">555-555-5555</label>
                    <div class="form_radio_checkbox_row">
                    </div>
                      <input type="radio" class="form_input" name="phone" id="phone_option2" value="555-666-6666"/>
                      <label for="phone_option2">555-555-6666</label>
                    <div class="form_radio_checkbox_row">
                    </div>
                      <input type="radio" class="form_input" name="phone" id="phone_option3" value="Other radiobutton option"/>
                      <label for="phone_option3">Other radiobutton option</label>
                    </div>
                  </div>
               </div>
               <div class="form_row">
                  <label class="form_label" for="fax">Fax</label><br>
                  <div class="form_value_viewing_mode">
                    <div class="form_radio_checkbox_row">
                      <input type="checkbox" class="form_input" checked="checked" name="fax" id="fax_option1" value="555-555-5555"/>
                      <label for="fax_option1">555-555-5555</label>
                    <div class="form_radio_checkbox_row">
                    </div>
                      <input type="checkbox" class="form_input" name="fax" id="fax_option2" value="555-666-6666"/>
                      <label for="fax_option2">555-555-6666</label>
                    <div class="form_radio_checkbox_row">
                    </div>
                      <input type="checkbox" class="form_input" name="fax" id="fax_option3" value="Other checkbox option"/>
                      <label for="fax_option3">Other checkbox option</label>
                    </div>
                  </div>
               </div>
               <div class="block_footer">Block footer text</div>
            </div>
           <!-- end CRM page block -->
         </div>
      </div>
   </div>
</template>
