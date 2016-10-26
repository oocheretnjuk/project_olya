var validation = (function(){
  var init = function(){
    _addListeners();
  },
  validate = function(form){
    var el = form.find('input, textarea').not('input[type="hidden"]'),
      valid = true;

    $.each(el, function(i,el){
      var $el = $(el),
      value = $el.val();
      if (!value.length){
        _addError($el)
        valid = false;
      }
    });
    return valid;
  },
  _addListeners = function(){
    $('form').on('keydown', '.has-error', _deleteError);
    $('form').on('click', '.has-error', _deleteError);
    $('form').on('reset', _clearForm);

  },
  _deleteError = function(){
    $(this).removeClass('has-error');
  },
  _addError = function(el){
    el.addClass('has-error');
    _addTip(el);
  },
  _clearForm = function(e){
    var $form = $(this);
    $form.find('input, textarea').not('input[type="hidden"]').trigger('hideTip');
    $form.find('.has-error').removeClass('has-error');
  },
  _addTip = function(el){
    position = {
      my: 'top right',
      at: 'bottom right'
    }
    el.qtip({
      content : {
        text : function(){
          return "Поле обов'язкове для заповнення!!!";
        }
      },
      show: {
        event: 'show'
      },
      hide: {
        event: "keydown click hideTip"
      },
      position: position,
      style: {
        classes: 'qtip-my qtip-rounded',
        tip: {
          height: 10,
          width: 10,
        }
      }
    }).trigger('show');
  };

  return {
    init: init,
    validate : validate
  };
}());

validation.init();

(function(){
  $('.submitForm').on('click',function(){
    var $form = $(this).closest('.form_contains').find('form');
    if (!validation.validate($form)) {
      return false;
    }
    if ($form.find('input[type="checkbox"]').length){
      if (!$form.find('input[type="checkbox"]:checked').length){
        $('.popUpText').text('Роботам тут не місце');
        $('.indexPopUp').css('display','block');
        return false;
      }
    }
    if ($form.find('input[type="radio"]').length){
      if (!($form.find('input[type="radio"]:checked').val() === "yes")){
        $('.popUpText').text('Вам необхідно бути впевненим');
        $('.indexPopUp').css('display','block');
        return false;
      }
    }
    if($form.attr('id')==='mail'){
      var xhr = new XMLHttpRequest();
      xhr.open("POST","/saveMail");
      var data = {
        name: $form.find("[name='name']").val(),
        mail: $form.find("[name='mail']").val(),
        message: $form.find("[name='message']").val()
      };
      $form[0].reset();
      xhr.setRequestHeader('Content-type', 'application/json');
      xhr.send(JSON.stringify(data));
      xhr.onload = function(){
        var response = JSON.parse(xhr.responseText);
        if(response.status==='sent'){
          alert('Повідомлення було надіслано успішно');
          for (var i=0;i<response.DBcontent.length;i++){
            console.log(response.DBcontent[i]);
          };
        }else if(response.status==='error'){
          alert('Під час відправлення сталася помілка: '+response.error);
        }else{
          alert('UNKNOWN ERROR!!!');
        }
      }
    }else if ($form.attr('id')==='autorization') {
      var xhr = new XMLHttpRequest();
      xhr.open("POST","/autorization");
      var data = {
        name: $form.find("[name='name']").val(),
        password: $form.find("[name='password']").val(),
      };
      $form[0].reset();
      xhr.setRequestHeader('Content-type', 'application/json');
      xhr.send(JSON.stringify(data));
      xhr.onload = function(){
        var response = JSON.parse(xhr.responseText);
        console.log(response);
        if(response.status==='ok'){
          alert('Авторизація успішна');
        }else if(response.status==='wrong'){
          $('.popUpText').text('Логін та/або пароль не вірний');
          $('.indexPopUp').css('display','block');
        }else{
          alert('UNKNOWN ERROR!!!');
        }
      }
    }
  });
})();