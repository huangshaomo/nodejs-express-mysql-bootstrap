buffer-type
=======

[![Build Status](https://secure.travis-ci.org/node-modules/buffer-type.png)](http://travis-ci.org/node-modules/buffer-type)

[![Coverage Status](https://coveralls.io/repos/node-modules/buffer-type/badge.png)](https://coveralls.io/r/node-modules/buffer-type)

[![NPM](https://nodei.co/npm/buffer-type.png?downloads=true&stars=true)](https://nodei.co/npm/buffer-type/)

![logo](https://raw.github.com/node-modules/buffer-type/master/logo.png)

Detect content-type from Buffer data.

## Install

```bash
$ npm install buffer-type
```

## Usage

```js
var bt = require('buffer-type');
var fs = require('fs');

var info = bt(fs.readFileSync(__dirname + '/logo.png'));
console.log(info);
// {
//   type: 'image/png',
//    extension: '.png',
//    width: 618,
//    height: 96,
//    bit: 8, // bit depth
//    color: 6,
//    compression: 0,
//    filter: 0,
//    interlace: 0
// }
```

## References

* http://www.onicos.com/staff/iz/formats/
* http://www.fastgraph.com/help/image_file_header_formats.html
* http://en.wikipedia.org/wiki/Portable_Network_Graphics
* http://en.wikipedia.org/wiki/Image_file_format

## TODO

* Image
  * [√] .png
  * [√] .jpg
  * [√] .bmp
  * [√] .gif
  * [√] .webp
  * [ ] .svg
  * [ ] .tif
  * [ ] .psd
* Tar
  * [ ] .tar
  * [ ] .gzip
  * [ ] .zip
  * [ ] .rar
* PE file
  * [ ] .exe
  * [ ] .msi
  * [ ] .apk
  * [ ] .ipa
* Text
  * [ ] .xml
  * [ ] .html
  * [ ] .json
* Media
  * [ ] .mp3
  * [ ] .mp4
  * [ ] .avi

## Authors

```bash
$ git summary

 project  : buffer-type
 repo age : 8 hours
 active   : 2 days
 commits  : 5
 files    : 17
 authors  :
     5  fengmk2                 100.0%
```

## License

(The MIT License)

Copyright (c) 2013 fengmk2 &lt;fengmk2@gmail.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
