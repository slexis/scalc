var core = nerdamer.getCore();
var _ = core.PARSER;
var Math2 = core.Math2;
var MQ = MathQuill.getInterface(2);
var field = MQ.MathField(input);
var mb = false;

function nCr(n, k) {
  return _.parse(Math2.factorial(n) / (Math2.factorial(k) * Math2.factorial(n - k)))
}

function nPr(n, k) {
  return _.parse(Math2.factorial(n) / Math2.factorial(n - k))
}

function __exp_(str) {
  return /e\+|e-/.test(str) ? `${str.replace(/e\+|e-/g, '\\times10^{')}}` : str;
}

function cacl(z) {
  let IV = field.text().replace(/\|([^;]*)\|/g, 'abs($1)');
  let option = angle_select.value;
  let res = nerdamer(option === 'D' ? IV.replace(/([^a])(cos|sin|tan|sec|csc|cot|cosh|sinh|tanh|sech|csch|coth)\(([^\)]*)\)/g, '$1$2((pi/180)*$3)').replace(/(acos|asin|atan|asec|acsc|acot|acosh|asinh|atanh|asech|acsch|acoth)/g, '(180/pi)*$1') : option === 'G' ? IV.replace(/([^a])(cos|sin|tan|sec|csc|cot|cosh|sinh|tanh|sech|csch|coth)\(([^\)]*)\)/g, '$1$2((pi/200)*$3)').replace(/(acos|asin|atan|asec|acsc|acot|acosh|asinh|atanh|asech|acsch|acoth)/g, '(200/pi)*$1') : IV).text();
  if (!/[a-z]|!/.test(IV) && IV.includes('/')) {
    MQ.StaticMath(mixed).latex(nerdamer(res).text('mixed'));
    MQ.StaticMath(recurring).latex(nerdamer(res).text('recurring'));
    MQ.StaticMath(fraction).latex(nerdamer(res).toTeX());
    mb = true;
  } else {
    mb = false;
  }
  let fix = fix_input.value;
  if (fix !== '') {
    res = nerdamer.round(res, fix).text('decimal');
  }
  if (!isNaN(res)) {
    res = res.replace(/\d{1,3}(?=(\d{3})+(?!\d))/g, '$&\\quad');
  }
  MQ.StaticMath(output).latex(__exp_(res.replace(/\*/g, '')));
}

nerdamer.register([{
  name: 'nCr',
  numargs: 2,
  visible: !0,
  build: function() {
    return nCr
  }
}, {
  name: 'nPr',
  numargs: 2,
  visible: !0,
  build: function() {
    return nPr
  }
}]);
$('#func').hide();
$('#tabs .col-50').click(function() {
  $('#tabs .col-50').removeClass('active-tab');
  $(this).addClass('active-tab');
  $('.content').hide();
  $(`#${$(this).text()}`).fadeIn();
});

$('#output').click(function() {
  if (mb === true) {
    $('#other_res').fadeIn();
  }
});

$(window).click(function(e) {
  if (e.target == other_res) {
    $('#other_res').fadeOut();
  }
})

$('button').click(function() {
  let meta = $('#func').is(':hidden') ? $(this).find('.cmd').text() : '\\' + $(this).text();
  switch (meta) {
    case '←':
      field.keystroke('Left');
      break;
    case '→':
      field.keystroke('Right');
      break;
    case '=':
      cacl(meta);
      break;
    case 'AC':
      field.latex('');
      field.click();
      $('#output').html('<span class="mq-math-mode"><span class="mq-root-block">0</span></span>')
      break;
    case 'DEL':
      field.keystroke('Backspace');
      break;
    case '\\FACT':
      let IV = field.text();
      if (!isNaN(IV)) {
        MQ.StaticMath(output).latex(nerdamer.pfactor(IV).toTeX().replace(/\\right\)\\left\(/g, '\\times').replace(/\\left\(|\\right\)/g, ''));
      }
      break;
    default:
      field.cmd(meta);
      field.click();
  }
});