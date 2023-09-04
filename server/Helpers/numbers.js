const between = (val, bottom, top, equals) => equals === true ? val >= bottom && val <= top : val > bottom && val < top

const isNum = (v) => !isNaN(v)

const formatNumber = function(num, decimalLength, wholeLength, thousandDivider, decimalDivider) {
    const re = '\\d(?=(\\d{' + (wholeLength || 3) + '})+' + (decimalLength > 0 ? '\\D' : '$') + ')',
        _num = num.toFixed(Math.max(0, ~~decimalLength));

    return (decimalDivider ? _num.replace('.', decimalDivider) : _num).replace(new RegExp(re, 'g'), '$&' + (thousandDivider || ','));
};


export {
    between,
    isNum,
    formatNumber
}
