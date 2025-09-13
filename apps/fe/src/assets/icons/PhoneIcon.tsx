import React from 'react';

export function PhoneIcon({ color = '' }) {
  if (color === 'white')
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
      >
        <rect width="20" height="20" fill="url(#pattern0_1588_480)" />
        <defs>
          <pattern
            id="pattern0_1588_480"
            patternContentUnits="objectBoundingBox"
            width="1"
            height="1"
          >
            <use xlinkHref="#image0_1588_480" transform="scale(0.0166667)" />
          </pattern>
          <image
            id="image0_1588_480"
            width="60"
            height="60"
            preserveAspectRatio="none"
            xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAACXBIWXMAAAsTAAALEwEAmpwYAAACv0lEQVR4nO2aXYhNURTHl/EZSfnIm8/wIF/lxYtSXhSelDcJD56EFGXKZOSdPAmFUpo8eSDy5AEJUaMUQxPdpjvde9b/v+eWwSxtc6duU9Pse+7MOPvM+dV6PHV+rX32WXutLVJQUFBQkDNIbgJwl2QZQB/J05JHzGwGgAsAfpG0xgBwQPImS/LWaNEG4V4zmy95gWTHWLINcVHygKruBTA0njCAWrVaXS0xY2azSX4NyO5IPJCYIXmwCdmR2C2xAuB+CuFuvzIkRkj2pBD2cVJiBMDPlMJVAMtkGgkbyesSGwB60woD+ENys8QEgCctZNhHp8QEgPMtCp+SmHDObW1Btl9Vl0hsAHib8hs+LjEC4FgK2TdmNlMirqd7mpAdUtUdEjOqeqSJDHdJ7JhZG8mXgcInJA8457YB+B0gfEPyAsnOgG94EMBOyQNmNitwafcnSbJG8oCqriOpAZl+VyqVFkgeUNV99cPBeNJPzWyuTKNOpgG453d5ycmvqitQ+qrkATObA+BZoPS1XGS6UqksAvChieUdZ4OvkVqttgLAt0DpRyG7N4ClzrkzJC8757ZI1kiSZC2AH4HS78eaUvhl75w75KeTjQcSAHdILpcsoarrAZQCa+5+krsanx8YGNg+TmHju6Fn/d4hGZsf9wVmetDX3r4V5Mc0ITOsenRnasKhqhsAfA98+VbiYWZK2Gq1uorkl8mW9r1zAFfK5fLCLOzeK0l+nIJM/xvKZ+ImQpIki0k+nwrpzLSGzWxeaBk6AZkuSYZq744mduK0UZYsoar7Q87TLWT4tmS0ifBqEmT9f32jZLjffSmwMRgq3C4xdENJvpgA4Zv+PpnEgJm1qerhNFcs6geL9mhkRy9zAEcBvA4U/uyc2yN5gMOHkHMAHtfvilU4zCffSPBVlW8b/+/3LCgoKCgoKJAg/gKzhzgyGi4i7wAAAABJRU5ErkJggg=="
          />
        </defs>
      </svg>
    );
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width="22"
      height="21"
      viewBox="0 0 22 21"
      fill="none"
    >
      <rect opacity="0.5" width="21" height="21" fill="url(#pattern0_80_67)" />
      <defs>
        <pattern
          id="pattern0_80_67"
          patternContentUnits="objectBoundingBox"
          width="1"
          height="1"
        >
          <use
            xlinkHref="#image0_80_67"
            transform="matrix(0.0106061 0 0 0.0111111 0.0227273 0)"
          />
        </pattern>
        <image
          id="image0_80_67"
          width="90"
          height="90"
          preserveAspectRatio="none"
          xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAYAAAA4qEECAAAACXBIWXMAAAsTAAALEwEAmpwYAAADnklEQVR4nO2cW4hNURiAPwy55hYZ8eCalIyXSW6l5BJJKTE1pEhuefDkRZQXyYQ8SblGLnkgohRFhgfk8qBchyZymeQ+LrO0ml+DmWPW2Wtve591/q/+x7PPWt/ZZ629//WvBYqiKIqiKIqiKEVEe6ASOAu8At4AB4EBaTcsJKYCDwHTQjwB+qbdwEKnLVAFNOSQbCQOp93QQqYDcLwVwUbC/hAT025wIdIOOOIo2UjcAUrSbnihsTlPyUZiedoNLyRmOozJueI10CvtDhQCnYFHESUbiZ1pd6IQWOcp2QDfgVFpdyTrTxm1MYg2wIW0O5NlpsUk2UjMS7tDWWVbzKJrZMxX/uJSzKINsFEtN+d5AqI/A4NU9p98SUC0kdd45Tc+JSTayESrCK8TFH1X8yBNXEtQtAGW6C3dyIGERZ9X0Y2sTFj0DRXdyPCERe9S0U34Zu5MjvgGjFTRTWxISHSVSv6TgZLmjFPyC6C7im7O6ZhFV6rklhkXo+TLQBsVnZtzMUj+DpSp5H8zNgbRu1WyG4c8RY9X0W6UAm89RA9S0e6s9hA9W0XnVxoWNat3RT6vODIEeBdR9ma1nB9LPYaQxSo7P456LNCWq2x3egOPI8p+Jk8xiiOjgY8RZd8Geqppdyo8xutqoIvKdmerh+xTuiLuTolsgzMRY59m9dzpJguuUWXvUNnulHo8iRgpcbAbRRUHhgIvPcdsLe91ZIJn7Z4tGe6ht7UbM4B6D9m3gP4RZds9M3ukxu+CpAyC3vM4B/jqIbs2z9d1+y/YLnUjf1/rnvz4wTI3R8ddw9ZpL2rlO+yC70IpZXCZAwYTKIuAHx6yjdypLeWzx8jqej7XqpfrdSVAlsUgu1qGo2HAZGCvZ4FPTai7xSo8h5Gk4qIkyIJinucEmVTYf9t+oA8BMUsWAEwGow5YE9L65vSENyT5xk1gEgG9Qb7JgNRc0SDHFgVxRtQIz0TU/4iaUE4/KwWuZ0Boa5nFYPLZZzMgNFfYs/2CocRzWSzJsBtcg2M+8CEDcn8Pu/MhSMoyNkkuIPAinRMZkHw/9Hz2L2wK9H2Kz9L2LNaiYRhwNQXRWyhC2gGrPHce5BPH5ODboqWfZNqinjDpEnZu6Jh2R7NCOXAmgTF5U7Hfyf/anncyhu3U9vBxPYbIAZv4WQ88yFPwU2At0MnlS5TmFVMrZCyvlhXyOomnUu9hX/enaBmaoiiKoiiKoiiKoigKLfITfKfz4+dwKvgAAAAASUVORK5CYII="
        />
      </defs>
    </svg>
  );
}

export default PhoneIcon;
