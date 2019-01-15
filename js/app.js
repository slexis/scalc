var core = nerdamer.getCore();
var _ = core.PARSER;
var Math2 = core.Math2;
var MQ = MathQuill.getInterface(2);
var field = MQ.MathField(input);
var mb = false;
var ors = '';

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
  let res = nerdamer(angle_btn.textContent === 'DEG' ? IV.replace(/([^a])(cos|sin|tan)\(([^\)]*)\)/g, '$1$2((pi/180)*$3)').replace(/(acos|asin|atan)/g, '(180/pi)*$1') : IV).latex();
  if (/sqrt|frac/.test(res[1]) && res[1] !== 'big') {
    if (!/[a-z]|!/.test(IV) && /\/|`|\./.test(IV)) {
      MQ.StaticMath(mixed).latex(nerdamer(res[0]).text('mixed'));
      MQ.StaticMath(recurring).latex(nerdamer(res[0]).text('recurring'));
    } else {
      $('#mixed, #recurring').html('');
    }
    mb = true;
    MQ.StaticMath(fraction).latex(res[1]);
  } else {
    mb = false;
  }
  let fix = fix_input.value;
  if (fix !== '') {
    res[0] = nerdamer.round(res[0], fix).text('decimal');
  }
  if (!isNaN(res[0])) {
    ors = res[0];
    res[0] = res[0].replace(/\d{1,3}(?=(\d{3})+(?!\d))/g, '$&\\quad');
  }
  MQ.StaticMath(output).latex(__exp_(res[0].replace(/\*/g, '')));
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
  let t = $(this).text();
  if (t === 'DEG' || t === 'RAD') {
    $(this).text(t === 'DEG' ? 'RAD' : 'DEG');
  } else {
    let meta = $('#func').is(':hidden') ? $(this).find('.cmd').text() : '\\' + t;
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
        MQ.StaticMath(output).latex(nerdamer.pfactor(ors).toTeX().replace(/\\right\)\\left\(/g, '\\times').replace(/\\left\(|\\right\)/g, ''));
        break;
      default:
        field.cmd(meta);
        field.click();
    }
  }
});