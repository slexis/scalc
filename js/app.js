var field = MathQuill.getInterface(2).MathField(input);
var res;

function calc() {
  let IV = field.text().replace(/\|([^;]*)\|/g, 'abs($1)').replace(/log/g, 'log10').replace(/ln/g, 'log');
  res = math.eval(angle_btn.textContent === 'DEG' ? IV.replace(/([^a])(cos|sin|tan)\(([^\)]*)\)/g, '$1$2((pi/180)*$3)').replace(/(acos|asin|atan)/g, '(180/pi)*$1') : IV);
  let fix = fix_input.value;
  output.innerHTML = (fix !== '' ? res.toFixed(parseInt(fix)) : res.toString().replace(/\d{1,3}(?=(\d{3})+(?!\d))/g, '$& ')).replace('-', '−');
}

$('button').click(function() {
  let t = $(this).text();
  if (t === 'DEG' || t === 'RAD') {
    $(this).text(t === 'DEG' ? 'RAD' : 'DEG');
    calc();
  } else {
    let meta = $(this).hasClass('func') ? '\\' + t : t;
    switch (meta) {
      case '←':
        field.keystroke('Left');
        break;
      case '→':
        field.keystroke('Right');
        break;
      case 'AC':
        field.latex('');
        field.click();
        $('#output').html('0')
        break;
      case 'DEL':
        field.keystroke('Backspace');
        break;
      default:
        field.cmd(meta);
        field.click();
        calc();
    }
  }
});

$('#fix_input').on('input', function() {
  output.innerHTML = res.toFixed(parseInt($(this).val()))
});

const hgt = $(window).innerHeight() - $('.row').innerHeight();

$('#input').css({'height': `${35 * hgt / 100}px`});
$('#output').css({'height': `${25 * hgt / 100}px`});