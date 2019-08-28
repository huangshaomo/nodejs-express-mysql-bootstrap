/**!
 * buffer-type - lib/buffer-type.js
 *
 * Copyright(c) fengmk2 and other contributors.
 * MIT Licensed
 *
 * Authors:
 *   fengmk2 <fengmk2@gmail.com> (http://fengmk2.github.com)
 */

'use strict';

/**
 * Module dependencies.
 */

/**
 * @see http://www.onicos.com/staff/iz/formats/gif.html
 *
GIF format

Byte Order: Little-endian
GIF Header

Offset   Length   Contents
  0      3 bytes  "GIF" 0x47 0x49 0x46
  3      3 bytes  "87a" or "89a"  0x38 0x39|0x37 0x61
  6      2 bytes  <Logical Screen Width>
  8      2 bytes  <Logical Screen Height>
 10      1 byte   bit 0:    Global Color Table Flag (GCTF)
                  bit 1..3: Color Resolution
                  bit 4:    Sort Flag to Global Color Table
                  bit 5..7: Size of Global Color Table: 2^(1+n)
 11      1 byte   <Background Color Index>
 12      1 byte   <Pixel Aspect Ratio>
 13      ? bytes  <Global Color Table(0..255 x 3 bytes) if GCTF is one>
         ? bytes  <Blocks>
         1 bytes  <Trailer> (0x3b)
 *
 */
var gif = function (buf) {
  if (buf.length < 13 ||
      // "GIF" 0x47 0x49 0x46
      buf[0] !== 0x47 || buf[1] !== 0x49 || buf[2] !== 0x46 ||
      // "87a" or "89a"
      buf[3] !== 0x38 || (buf[4] !== 0x39 && buf[4] !== 0x37) || buf[5] !== 0x61) {
    return;
  }
  var width = buf.readUInt16LE(6);
  var height = buf.readUInt16LE(8);
  return {
    type: 'image/gif',
    extension: '.gif',
    width: width,
    height: height
  };
};

/**
 * @see http://en.wikipedia.org/wiki/Portable_Network_Graphics
 *
A PNG file starts with an 8-byte signature. The hexadecimal byte values are 89 50 4E 47 0D 0A 1A 0A; the decimal values are 137 80 78 71 13 10 26 10. Each of the header bytes is there for a specific reason:[7]
Bytes Purpose
89  Has the high bit set to detect transmission systems that do not support 8 bit data and to reduce the chance that a text file is mistakenly interpreted as a PNG, or vice versa.
50 4E 47  In ASCII, the letters PNG, allowing a person to identify the format easily if it is viewed in a text editor.
0D 0A A DOS-style line ending (CRLF) to detect DOS-Unix line ending conversion of the data.
1A  A byte that stops display of the file under DOS when the command type has been used—the end-of-file character
0A  A Unix-style line ending (LF) to detect Unix-DOS line ending conversion.
 *
 */
var png = function (buf) {
  if (buf.length < 16 ||
      buf[0] !== 0x89 ||
      // PNG
      buf[1] !== 0x50 || buf[2] !== 0x4E || buf[3] !== 0x47 ||
      // \r\n
      buf[4] !== 0x0D || buf[5] !== 0x0A ||
      buf[6] !== 0x1A || buf[7] !== 0x0A) {
    return;
  }
  // Length  Chunk type  Chunk data  CRC
  // 4 bytes 4 bytes Length bytes  4 bytes
  var length = buf.readUInt32BE(8);
  // var chunkType = buf.slice(12, 16).toString(); // should be 'IHDR'
  // console.log(length, chunkType, buf.slice(12, 16))
  var chunkData = buf.slice(16, 16 + length);
  // Width:              4 bytes   0
  // Height:             4 bytes   4
  // Bit depth:          1 byte    8
  // Color type:         1 byte    9
  // Compression method: 1 byte    10
  // Filter method:      1 byte    11
  // Interlace method:   1 byte    12
  var width = chunkData.readUInt32BE(0, true);
  var height = chunkData.readUInt32BE(4, true);
  return {
    type: 'image/png',
    extension: '.png',
    width: width,
    height: height,
    bit: chunkData.readUInt8(8, true),
    color: chunkData.readUInt8(9, true),
    compression: chunkData.readUInt8(10, true),
    filter: chunkData.readUInt8(11, true),
    interlace: chunkData.readUInt8(12, true),
  };
};

/**
 * @see http://www.onicos.com/staff/iz/formats/jpeg.html
 * @see http://blog.csdn.net/lpt19832003/article/details/1713718
 *
JPEG format

Byte Order: Big-endian
Offset   Length   Contents
  0      1 byte   0xff
  1      1 byte   0xd8 (SOI)
  2      1 byte   0xff
  3      1 byte   0xe0 (APP0)
  4      2 bytes  length of APP0 block
  6      5 bytes  "JFIF\0" 4a 46 49 46 00
 11      1 byte   <Major version>
 12      1 byte   Minor version
 13      1 byte   <Units for the X and Y densities>
                     units = 0:  no units, X and Y specify the pixel aspect ratio
                     units = 1:  X and Y are dots per inch
                     units = 2:  X and Y are dots per cm
 14      2 bytes  <Xdensity:   Horizontal pixel density>
 16      2 bytes  <Ydensity:   Vertical pixel density>
 18      1 byte   <Xthumbnail: Thumbnail horizontal pixel count>
 19      1 byte   <Ythumbnail: Thumbnail vertical pixel count>

                 ...

         1 byte  0xff
         1 byte  0xd9 (EOI) end-of-file
 *
 */

var jpeg = function (buf) {
  if (buf.length < 20 ||
      // 0xff 0xd8(SOI)
      buf[0] !== 0xff || buf[1] !== 0xd8 ||
      // 0xff 0xe0(APP0)
      buf[2] !== 0xff || buf[3] !== 0xe0 ||
      // length of APP0 block should be 16
      buf.readUInt16BE(4, true) !== 16 ||
      // 'JFIF\0' 4a 46 49 46 00
      buf[6] !== 0x4a || buf[7] !== 0x46 || buf[8] !== 0x49 || buf[9] !== 0x46 || buf[10] !== 0 ||
      // DQT offset 20, 0xffdb
      buf[20] !== 0xff || buf[21] !== 0xdb) {

    return;
  }
  // APP0
  var majorVersion = buf.readUInt8(11, true);
  var minorVersion = buf.readUInt8(12, true);
  // var units = buf.readUInt8(13, true);
  // var width = buf.readUInt16BE(14, true);
  // var height = buf.readUInt16BE(16, true);

  // DQT，Define Quantization Table，定义量化表
  // *  标记代码                          2字节            固定值0xFFDB
  // *  包含2个具体字段：
  //  ① 数据长度                  2字节            字段①和多个字段②的总长度
  //                                                        即不包括标记代码，但包括本字段
  //  ② 量化表        数据长度-2字节
  // a)         精度及量化表ID   1字节            高4位：精度，只有两个可选值
  //                                                              0：8位；1：16位
  //                                                低4位：量化表ID，取值范围为0～3
  // b)        表项       (64×(精度+1))字节              例如8位精度的量化表
  //                                                其表项长度为64×（0+1）=64字节
  // 本标记段中，字段②可以重复出现，表示多个量化表，但最多只能出现4次。

  // SOF0，Start of Frame，帧图像开始
  // u  标记代码                   2字节     固定值0xFFC0
  // u  包含9个具体字段：
  //   ① 数据长度           2字节     ①~⑥六个字段的总长度
  //                                               即不包括标记代码，但包括本字段
  //   ② 精度                 1字节     每个数据样本的位数
  //                                               通常是8位，一般软件都不支持 12位和16位
  //   ③ 图像高度           2字节     图像高度（单位：像素），如果不支持 DNL 就必须 >0
  //   ④ 图像宽度           2字节     图像宽度（单位：像素），如果不支持 DNL 就必须 >0
  //   ⑤ 颜色分量数        1字节     只有3个数值可选
  //                                               1：灰度图；3：YCrCb或YIQ；4：CMYK
  //                                               而JFIF中使用YCrCb，故这里颜色分量数恒为3
  //   ⑥颜色分量信息      颜色分量数×3字节（通常为9字节）
  // a)         颜色分量ID                 1字节
  // b)        水平/垂直采样因子      1字节            高4位：水平采样因子
  //                                                        低4位：垂直采样因子
  //                                                        （曾经看到某资料把这两者调转了）
  // c)        量化表                         1字节            当前分量使用的量化表的ID

  // 本标记段中，字段⑥应该重复出现，有多少个颜色分量（字段⑤），就出现多少次（一般为3次）。

  // find SOF0
  var offset = 20;
  var sof0 = null;
  while (offset < buf.length) {
    var flag = buf.slice(offset, offset + 2);
    var size = buf.readUInt16BE(offset + 2);
    if (flag[0] === 0xff && flag[1] === 0xc0) {
      sof0 = offset;
      break;
    }
    offset += 2 + size;
  }

  var r = {
    type: 'image/jpeg',
    extension: '.jpg',
  };

  if (sof0) {
    // If found out SOF0, we can detect width and height
    offset = sof0 + 2 + 2 + 1;
    r.height = buf.readUInt16BE(offset, true);
    r.width = buf.readUInt16BE(offset + 2, true);
  }

  return r;
};

/**
 * @see http://www.onicos.com/staff/iz/formats/bmp.html
 *
BMP - Microsoft Windows bitmap image file

Byte Order: Little-endian
 Offset   Length   Contents
  0      2 bytes  "BM" 0x42 0x4d
  2      4 bytes  Total size included "BM" magic (s)
  6      2 bytes  Reserved1 00
  8      2 bytes  Reserved2 00
 10      4 bytes  Offset bits
 14      4 bytes  Header size (n)
 18    n-4 bytes  Header (See bellow)
 14+n .. s-1      Image data

Header: n==12 (Old BMP image file format, Used OS/2)
Offset   Length   Contents
 18      2 bytes  Width
 20      2 bytes  Height
 22      2 bytes  Planes
 24      2 bytes  Bits per Pixel

Header: n>12 (Microsoft Windows BMP image file)
Offset   Length   Contents
 18      4 bytes  Width
 22      4 bytes  Height
 26      2 bytes  Planes
 28      2 bytes  Bits per Pixel
 30      4 bytes  Compression
 34      4 bytes  Image size
 38      4 bytes  X Pixels per meter
 42      4 bytes  Y Pixels per meter
 46      4 bytes  Number of Colors
 50      4 bytes  Colors Important
 54 (n-40) bytes  OS/2 new extentional fields??
 *
 */

var bmp = function (buf) {
  if (buf.length < 36 ||
      buf[0] !== 0x42 || buf[1] !== 0x4d) {
    return;
  }
  var headerSize = buf.readUInt32LE(14, true);
  var header = buf.slice(18, 18 + headerSize - 4);
  var width, height;
  if (headerSize === 12) {
    width = header.readUInt16LE(0, true);
    height = header.readUInt16LE(2, true);
  } else {
    width = header.readUInt32LE(0, true);
    height = header.readUInt32LE(4, true);
  }
  return {
    type: 'image/bmp',
    extension: '.bmp',
    width: width,
    height: height
  };
};

// webp format: https://developers.google.com/speed/webp/docs/riff_container
// WebP File Header
//  0                   1                   2                   3
//  0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
// +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
// |      'R'      |      'I'      |      'F'      |      'F'      |
// +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
// |                           File Size                           |
// +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
// |      'W'      |      'E'      |      'B'      |      'P'      |
// +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
//
// 'RIFF': 32 bits
//   The ASCII characters 'R' 'I' 'F' 'F'.
// File Size: 32 bits (uint32)
//   The size of the file in bytes starting at offset 8.
//   The maximum value of this field is 2^32 minus 10 bytes and
//     thus the size of the whole file is at most 4GiB minus 2 bytes.
// 'WEBP': 32 bits
//   The ASCII characters 'W' 'E' 'B' 'P'.
function webp(buf) {
  if (buf.length < 12) {
    return;
  }
  if (buf.slice(0, 4).toString() !== 'RIFF' || buf.slice(8, 12).toString() !== 'WEBP') {
    return;
  }

  // uint32: A 32-bit, little-endian, unsigned integer.
  // The file size in the header is the total size of the chunks that follow plus 4 bytes for the 'WEBP' FourCC.
  var size = buf.readUInt32LE(4);

  return {
    type: 'image/webp',
    extension: '.webp',
    size: size + 8
  };
}

var types = [gif, png, jpeg, bmp, webp];

function detect(buf) {
  if (!buf || !buf.length) {
    return;
  }

  for (var i = 0; i < types.length; i++) {
    var r = types[i](buf);
    if (r) {
      return r;
    }
  }
}

module.exports = detect;
