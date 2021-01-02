/*
* 根据时间戳及格式展示当前时间
* @param val  时间戳
* @param type 时间格式
* */
export function toDate(val, type) {
  if (val === 0 || val === null) {
    return ''
  }
  let time = new Date(val)
    , year = time.getFullYear()
    , month = Appendzero(time.getMonth() + 1)
    , date = Appendzero(time.getDate())
    , hour = Appendzero(time.getHours())
    , min = Appendzero(time.getMinutes())
    , sec = Appendzero(time.getSeconds());
  type = type || 'ymd';
  switch (type) {
    case 'ymd':
      return year + '-' + month + '-' + date;
      break;
    case 'ymdc':
      return year + '年' + month + '月' + date+ '日';
      break;
    case 'ymdhm':
      return year + '-' + month + '-' + date + ' ' + hour + ':' + min;
      break;
    case 'ymdhms':
      return year + '-' + month + '-' + date + ' ' + hour + ':' + min + ':' + sec;
      break;
  }
}
/*超出个数进行裁剪隐藏*/
export function contentCut(value, max) {
  if (!value) return '';
  max = parseInt(max, 10);
  if (!max) return value;
  if (value.length <= max) return value;
  value = value.substr(0, max) + '...';
  return value;
}

/*
* 获取日期不足两位补 0
* */
export function Appendzero(obj) {
  if (Number(obj) < 10){
    return "0" + obj
  }else {
    return obj
  }
}

export function  GMTToStr (time){
  let date = new Date(time);
  let str=date.getFullYear() + '-' +
    (date.getMonth() + 1) + '-' +
    date.getDate() + ' ' +
    date.getHours() + ':' +
    date.getMinutes() + ':' +
    date.getSeconds();
  return str
}

export function StrToGMT(time){
  let GMT = new Date(time);
  return GMT
}
