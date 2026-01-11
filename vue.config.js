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
      }
    }
  }
}