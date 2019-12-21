export function nFormatter(num) {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'G';
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return num;
}

export function dataURItoFile(dataURI) {
  // Format of a base64-encoded URL:
  // data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAYAAAAEOCAIAAAAPH1dAAAAK

  var BASE64_MARKER = ';base64,';
  var mime = dataURI.split(BASE64_MARKER)[0].split(':')[1];
  var filename =
    'dataURI-file-' + new Date().getTime() + '.' + mime.split('/')[1];
  var bytes = atob(dataURI.split(BASE64_MARKER)[1]);
  var writer = new Uint8Array(new ArrayBuffer(bytes.length));

  for (var i = 0; i < bytes.length; i++) {
    writer[i] = bytes.charCodeAt(i);
  }

  return new File([writer.buffer], filename, { type: mime });
}
