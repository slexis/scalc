var field = MathQuill.getInterface(2).MathField(input);

function calc() {
  console.log(field.text());
  let IV = field.text()
            .replace(/\|([^;]*)\|/g, 'abs($1)')
            .replace(/log/g, 'log10')
            .replace(/ln/g, 'log')
            .replace(/nthroot\((\d+),(\d+)\)/g, 'sqrt(($2)^(2/$1))');
  if (angle_btn.textContent === 'DEG') {
    IV = IV
          .replace(/([^a])(cos|sin|tan)\(([^\)]*)\)/g, '$1$2((pi/180)*$3)')
          .replace(/(acos|asin|atan)/g, '(180/pi)*$1')
  }
  let res = math.eval(IV);
  output.innerHTML = res.toString()
                      .replace(/\d{1,3}(?=(\d{3})+(?!\d))/g, '$& ')
                      .replace('-', '−');
}

$('button').click(function() {
  let t = $(this).text();
  if (t === 'DEG' || t === 'RAD') {
    $(this).text(t === 'DEG' ? 'RAD' : 'DEG');
    calc();
  } else {
    let meta = $(this).hasClass('func') ? '\\' + t : $(this).hasClass('sym') ? $(this).find('.text').text() : t;
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