module.exports = {
  devServer: {
    proxy: {
      '/shdr': {
        target: 'https://secure.parksandresorts.wdpromedia.com',
        changeOrigin: true,
        pathRewrite: { '^/shdr': '' },
        onProxyReq(proxyReq) {
          // 在代理服务器这一层自动加上 Header
        }
      },
      '/tkydl': {
        target: 'https://contents-portal.tokyodisneyresort.jp',
        changeOrigin: true,
        pathRewrite: { '^/tkydl': '' },
        onProxyReq(proxyReq) {
          // 在代理服务器这一层自动加上 Header
          proxyReq.setHeader('Cookie', 'CloudFront-Signature=Pw4XeQZ~DNTK65bYShZh~GN10DFexR2C2C0O-2wnuh5Zq~lFLml1kMbDEe~fVhydaz-CgwapSZcD6kHRjLDkVQqvaIW~hZd2mGbc~IyVDpfzbSPj~k~BHXU4oJVNebpkO~n8u-ZVlyRhDkNUGweaYOsUhAPFXfzeTbqOv02lOLTI220zj85xY0YFZYU4lLyGgh1KaLtCJHo6xPX3ST7REEqR71~3u9WErHhXcJbRsc3z1di0am3Pt4wPAb-lqFEa53ddbgt0zkYMF-VYcckN8MhFEJat13MhTbo9nZHTM1yOBOjHE0~UkcxoIB2OyPdHkELT1tZjmyRtPfnXvvylkQ__;CloudFront-Key-Pair-Id=APKAIJUGP2GGEWDAPMTQ;CloudFront-Policy=eyJTdGF0ZW1lbnQiOiBbeyJSZXNvdXJjZSI6Imh0dHBzOi8vY29udGVudHMtcG9ydGFsLnRva3lvZGlzbmV5cmVzb3J0LmpwLyoiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3NzA2Mjc5Nzh9LCJJcEFkZHJlc3MiOnsiQVdTOlNvdXJjZUlwIjoiMC4wLjAuMC8wIn19fV19');
        }
      },
      '/usj': {
        target: 'https://mobile-service.usj.co.jp',
        changeOrigin: true,
        pathRewrite: { '^/usj': '' },
        onProxyReq(proxyReq) {
          // 在代理服务器这一层自动加上 Header
          proxyReq.setHeader('Cookie', '_gcl_au=1.1.2068732849.1765989082; _ga=GA1.1.253477250.1765989082; _yjsu_yjad=1765989081.5e4c1885-6175-4512-8df0-4f909a8ab7a7; _rt.uid=d3629b00-db65-11f0-5306-829a8782171c; Apache=ff5a68d3.64628600e1cc9; _tt_enable_cookie=1; _ttp=01KCPJNJNN1XNVWCWNAGFR56GX_.tt.2; ak_bmsc=C9570F72622D8107311E5C74823A7865~000000000000000000000000000000~YAAQVmYzuBskfrKbAQAAHST+tB7PlWMohDGcBds1QzKXe88ODxOpt0IIM2pS4LctdBAZQt4CUtJla5Y7NC5cNGl3/5jBYx+ic22lRUxdsSSai3yhfI0DwETrvP0KylbQhgultBN8KPkVigcN+GtEJXY68LsIamuh80vh6yCqQNstVg28b0i88RD3RMv/g6pLdWbBo1wIzdkTDaN7VfIEYjXSAG89jNk+4fOGzokuPHxYy7Rzb93F9h2PBnfJIewuLq7PFKUnPh+HfearXVh9LfQ9R/+AGXjWE1wrQRZTwlS3BcmMvTRhay2vYwIrYGB/0xt8jznnSRPvzDxx/AFHW2RjLSnf7qY1sx1mgbmjgT5LQzc3RZmodas+2yQX7KblV1gqZMEpfrCVhMfKplHyOuwOCiMMKzJRyhLkuhX5bVneXlpV+i3/+5T6Yf0kvwv17eBHkQ==; _rt.xd=ce02b143; cto_bundle=ZYwoiV83b3RIRWpSYTFhZktzUWFxZ0xPQzRmdVloRnVKQUVZbDdjb2R1ZTAlMkZhMEFKdDAybE0xQjklMkZNTGk1Y0l4TDAlMkIxbTZHQ0tMd0p2M0dKaURsY0VPTjZNaVc3amNOJTJGWkNhOHlxMWtaMVlvdU1VRWE2cGNkZHZSQkFtQnB3ckxsSFdFcDUwZEJueGVFZnhJQjFNek9QaWpUQSUzRCUzRA; ttcsid=1768268325473::zi9fAaNLA1u-RMT3q5vX.2.1768268325803.0; ttcsid_CPSJFG3C77UF05LN0VVG=1768268325472::LRkCYq9Z-qDOtjNW_QPG.2.1768268325803.1; bm_sv=368B4A9CF59178E2006C80329E3FC77C~YAAQJQ7SF3TH0KubAQAAiWQBtR6EajPKEm8BVIlXztjI0q2jyfdBqPG2A2VobIpqe1N5LndS/emmxh5HyT27uIAXGA99a2JkGsDesaiGR+OZJAw/pL1wgox2aY+V3wUgSZgObkeNLjQUR8I4r7gPXJtWunAECeGjmYOcyjic/uO/yYL7Nbjj+lUj5A70hnu+Ge5uMjXtWlNTlYN8WbsWT8j6vwLeOyB+tETXnz/uL3me0cXII3oBEr1ooMXGNoC9~1; _ga_9L8SPCF27R=GS2.1.s1768268130$o3$g1$t1768268326$j57$l0$h0');
        }
      }
    }
  }
}