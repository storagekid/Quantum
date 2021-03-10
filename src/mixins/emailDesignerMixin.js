export const EmailDesignerMixin = {
  data () {
    return {
    }
  },
  methods: {
    stylesCleaner (stylesToCheck) {
      var stylesToClean = [
        'border',
        'backgound',
        'font',
        'margin-top',
        'margin-right',
        'margin-bottom',
        'margin-left',
        'outline',
        'padding-top',
        'padding-right',
        'padding-bottom',
        'padding-left',
        'overflow'
      ]
      for (let style of stylesToClean) delete stylesToCheck[style]
      return stylesToCheck
    },
    stylesTagBuilder (styles = null) {
      let parsedStyles = {
        'align-content': '',
        'align-items': '',
        'align-self': '',
        'background-attachment': '',
        'background-blend-mode': '',
        'background-clip': '',
        'background-color': '',
        'background-image': '',
        'background-origin': '',
        'background-position': '',
        'background-repeat': '',
        'background-size': '',
        'border-bottom': '',
        'border-bottom-color': '',
        // 'border-bottom-left-radius': '',
        // 'border-bottom-right-radius': '',
        'border-bottom-style': '',
        'border-bottom-width': '',
        'border-collapse': '',
        'border-color': '',
        'border-left': '',
        'border-left-color': '',
        'border-left-style': '',
        'border-left-width': '',
        'border-radius': '',
        'border-right': '',
        'border-right-color': '',
        'border-right-style': '',
        'border-right-width': '',
        'border-spacing': '',
        'border-style': '',
        'border-top': '',
        'border-top-color': '',
        // 'border-top-left-radius': '',
        // 'border-top-right-radius': '',
        'border-top-style': '',
        'border-top-width': '',
        'border-width': '',
        bottom: '',
        'box-decoration-break': '',
        'box-shadow': '',
        'box-sizing': '',
        color: '',
        display: '',
        filter: '',
        float: '',
        'font-family': '',
        'font-feature-settings': '',
        'font-kerning': '',
        'font-language-override': '',
        'font-size': '',
        'font-size-adjust': '',
        'font-stretch': '',
        'font-style': '',
        'font-synthesis': '',
        'font-variant': '',
        'font-variant-alternates': '',
        'font-variant-caps': '',
        'font-variant-ligatures': '',
        'font-variant-numeric': '',
        'font-variant-position': '',
        'font-weight': '',
        height: '',
        hyphens: '',
        'image-rendering': '',
        'justify-content': '',
        left: '',
        'letter-spacing': '',
        'line-break': '',
        'line-height': '',
        'list-style': '',
        'list-style-image': '',
        'list-style-position': '',
        'list-style-type': '',
        margin: '',
        'max-height': '',
        'max-width': '',
        'min-height': '',
        'min-width': '',
        opacity: '',
        order: '',
        outline: '',
        'outline-color': '',
        'outline-offset': '',
        'outline-style': '',
        'outline-width': '',
        overflow: '',
        'overflow-wrap': '',
        'overflow-x': '',
        'overflow-y': '',
        'padding': '',
        'position': '',
        'right': '',
        'text-align': '',
        'text-align-last': '',
        'text-decoration': '',
        // 'text-decoration-color': '',
        // 'text-decoration-line': '',
        // 'text-decoration-style': '',
        'text-indent': '',
        'text-justify': '',
        'text-orientation': '',
        'text-overflow': '',
        'text-transform': '',
        'text-underline-position': '',
        'top': '',
        'vertical-align': '',
        'white-space': '',
        'width': '',
        'word-break': '',
        'word-spacing': '',
        'word-wrap': ''
      }
      // console.log('Styles tag Builder')
      if (styles) for (let style in styles) parsedStyles[style] = styles[style]
      return parsedStyles
      // var nodeStyles = node.style
      // if (styles) for (let style in styles) nodeStyles[style] = styles[style]
      // console.log(nodeStyles)
      // return nodeStyles
    },
    commentsObjectBuilder (userComments = null) {
      let comments = {
        before: [],
        inline: [],
        after: []
      }
      if (userComments) for (let comment in userComments) comments[comments] = userComments[comment]
      return comments
    },
    attributesObjectBuilder (tag, userAttributes = null) {
      let attributes = {}
      switch (tag) {
        case 'img':
          attributes = this.attributesImgBuilder()
          break
        case 'a':
          attributes = this.attributesABuilder()
          break
        case 'table':
          attributes = this.attributesTableBuilder()
          break
        case 'td':
          attributes = this.attributesTdBuilder()
          break
      }
      if (userAttributes) for (let attribute in userAttributes) attributes[attribute] = userAttributes[attribute]
      return attributes
    },
    attributesImgBuilder () {
      return {
        src: '',
        srcset: '',
        width: '',
        height: '',
        alt: ''
      }
    },
    attributesABuilder () {
      return {
        href: '#',
        // download: '',
        referrerpolicy: '',
        rel: '',
        target: '',
        type: ''
      }
    },
    attributesTableBuilder () {
      return {
        role: 'presentation',
        cellspacing: '0',
        cellpadding: '0',
        border: '0',
        width: '100%'
      }
    },
    attributesTdBuilder () {
      return {
        align: 'presentation',
        valign: '0',
        width: '100%',
        dir: ''
      }
    },
    writeNewLine (text, level = 0) {
      let indent = ''
      while (level > 0) {
        indent += '\t'
        level--
      }
      return indent + text + '\n'
    },
    parseAttributes (attributes) {
      let line = ''
      for (let attribute in attributes) if (attributes[attribute]) line += attribute + '="' + attributes[attribute] + '" '
      return line.trim()
    },
    parseStyles (styles) {
      let line = 'style="'
      let stylesString = ''
      for (let style in styles) if (styles[style]) stylesString += style + ': ' + styles[style] + '; '
      if (!stylesString) return ''
      line += stylesString
      line = line.trim()
      line = ' ' + line
      line += '"'
      return line
    },
    parseClasses (classes) {
      let line = 'class="'
      for (let inlineClass of classes) line += inlineClass + ' '
      line = line.trim()
      line += '"'
      return line
    },
    writeNewHTML (element, level = 0, line = '') {
      // console.log(element.name)
      // console.log(line)
      let selfClosing = ['img', 'meta', 'br', 'param']
      let cleanTags = ['body', 'center', 'tr']
      let indent = ''
      let tabs = 0
      while (level > tabs) {
        indent += '\t'
        tabs++
      }
      if (element.comments && this.emailing.design.options.hacks.comments) {
        if (element.comments.before) {
          if (element.comments.before.length) {
            for (let beforeComment of element.comments.before) {
              line += indent + '<!-- '
              line += beforeComment
              line += ' -->'
              line += '\n'
            }
          }
        }
      }
      if (element.name === 'msHack') {
        for (let hackLine of element.content) {
          line += indent + hackLine
          line += '\n'
        }
        if (element.comments && this.emailing.design.options.hacks.comments) {
          if (element.comments.after) {
            if (element.comments.after.length) {
              for (let afterComment of element.comments.after) {
                line += indent + '<!-- '
                line += afterComment
                line += ' -->'
                line += '\n'
              }
            }
          }
        }
        return line
      }
      if (element.name === 'style') {
        line += indent + '<' + element.name + '>'
        line += '\n'
        for (let hackLine of element.content) {
          if (!this.emailing.design.options.hacks.comments) {
            if (hackLine[hackLine.length - 1] === '/') continue
          }
          line += indent + hackLine
          line += '\n'
        }
        line += indent + '</' + element.name + '>'
        line += '\n'
        if (element.comments && this.emailing.design.options.hacks.comments) {
          if (element.comments.after) {
            if (element.comments.after.length) {
              for (let afterComment of element.comments.after) {
                line += indent + '<!-- '
                line += afterComment
                line += ' -->'
                line += '\n'
              }
            }
          }
        }
        return line
      }
      line += indent + '<'
      line += element.name
      if (element.attributes) {
        if (Object.keys(element.attributes).length) line += ' ' + this.parseAttributes(element.attributes)
      }
      if (element.styles) {
        if (!cleanTags.includes(element.name)) {
          for (let style in this.emailing.design.options.cascadeStyles) {
            let cascade = this.emailing.design.options.cascadeStyles[style]
            if (cascade && !element.styles[style]) element.styles[style] = this.emailing.design.styles[style]
          }
        }
        if (Object.keys(element.styles).length) line += this.parseStyles(element.styles)
      }
      if (element.classes) {
        if (element.classes.length) line += ' ' + this.parseClasses(element.classes)
      }
      if (selfClosing.includes(element.name)) {
        line += ' />'
        if (element.comments && this.emailing.design.options.hacks.comments) {
          if (element.comments.inline.length) {
            let comment = '<!-- '
            comment += element.comments.inline.join('. ')
            comment += ' -->'
            line += ' ' + comment
          }
        }
      } else {
        line += '>'
      }
      line += '\n'
      if (element.children) {
        level++
        for (let child of element.children) {
          // console.log('Children')
          line += this.writeNewHTML(child, level)
        }
      }
      if (element.content) {
        if (element.children) {
          // console.log(element.children)
          if (!element.children.length) line += indent + '\t' + element.content + '\n'
          // else line += indent + '\t' + element.content + '\n'
        } else {
          line += indent + '\t' + element.content + '\n'
        }
      }
      if (!selfClosing.includes(element.name)) {
        line += indent + '</' + element.name + '>'
        if (element.comments && this.emailing.design.options.hacks.comments) {
          if (element.comments.inline.length) {
            let comment = '<!-- '
            comment += element.comments.inline.join('. ')
            comment += ' -->'
            line += ' ' + comment
          }
        }
        line += '\n'
      }
      if (element.comments && this.emailing.design.options.hacks.comments) {
        if (element.comments.after) {
          if (element.comments.after.length) {
            for (let afterComment of element.comments.after) {
              line += indent + '<!-- '
              line += afterComment
              line += ' -->'
              line += '\n'
            }
          }
        }
      }

      return line
    },
    textFileDownload (textFile, fileName) {
      var atag = document.createElement('a')
      var file = new Blob([textFile], { type: 'text/plain' })
      atag.href = URL.createObjectURL(file)
      atag.download = (fileName + '.html')
      atag.click()
    },
    // writeStyles(element) {
    //   if ()
    // },
    htmlFileBuilding (emailing = null, options = { comments: false, width: 600 }) {
      let baseHTML = {
        name: 'html',
        attributes: { 'lang': 'en', 'xmlns': 'http://www.w3.org/1999/xhtml', 'xmlns:v': 'urn:schemas-microsoft-com:vml', 'xmlns:o': 'urn:schemas-microsoft-com:office:office' },
        children: []
      }
      baseHTML.children.push(this.addHeadTag())
      baseHTML.children.push({
        name: 'body',
        comments: {
          before: [
            'The email background color (#222222) is defined in three places:',
            '1. body tag: for most email clients',
            '2. center tag: for Gmail and Inbox mobile apps and web versions of Gmail, GSuite, Inbox, Yahoo, AOL, Libero, Comcast, freenet, Mail.ru, Orange.fr',
            '3. mso conditional: For Windows 10 Mail'
          ],
          inline: [],
          after: []
        },
        attributes: { width: '100%' },
        styles: { 'background-color': emailing.design['body-background-color'], 'margin': '0', 'padding': '0 !important', 'mso-line-height-rule': 'exactly' },
        children: [
          // {
          //   name: 'msHack'
          // },
          {
            name: 'center',
            attributes: { role: 'article', 'aria-roledescription': 'email', lang: 'es' },
            styles: { 'width': '100%', 'background-color': emailing.design['body-background-color'] },
            children: [
              {
                name: 'div',
                attributes: {},
                styles: { 'max-width': options.width + 'px', 'margin': '0 auto' },
                classes: ['email-container'],
                children: emailing.design.mainRows
              }
            ]
          }
        ]
      })
      let indexHTML = '<!DOCTYPE html>' + '\n'
      indexHTML += this.writeNewHTML(baseHTML)
      return indexHTML
    },
    addHeadTag () {
      let headTag = {
        name: 'head',
        children: []
      }
      headTag.children = headTag.children.concat(this.addMetaTags())
      headTag.children.push(this.addTitleTag())
      headTag.children.push(this.addMsoPPIHack())
      headTag.children.push(this.addWebFontHack())
      if (this.emailing.design.fonts.length) headTag.children.push(this.addWebFontLinks())
      headTag.children.push(this.addCssReset())
      headTag.children.push(this.addProgressiveEnhancements())
      return headTag
    },
    addMetaTags () {
      let metatags = []
      metatags.push({
        name: 'meta',
        attributes: { 'charset': 'utf-8' },
        comments: {
          inline: ['utf-8 works for most cases']
        }
      })
      metatags.push({
        name: 'meta',
        attributes: { 'name': 'viewport', 'content': 'width=device-width' },
        comments: {
          inline: ['Forcing initial-scale shouldn\'t be necessary']
        }
      })
      metatags.push({
        name: 'meta',
        attributes: { 'http-equiv': 'X-UA-Compatible', 'content': 'IE=edge' },
        comments: {
          inline: ['Use the latest (edge) version of IE rendering engine']
        }
      })
      metatags.push({
        name: 'meta',
        attributes: { 'name': 'x-apple-disable-message-reformatting' },
        comments: {
          inline: ['Disable auto-scale in iOS 10 Mail entirely']
        }
      })
      metatags.push({
        name: 'meta',
        attributes: { 'name': 'format-detection', 'content': 'telephone=no,address=no,email=no,date=no,url=no' },
        comments: {
          inline: ['Tell iOS not to automatically link certain text strings.']
        }
      })
      metatags.push({
        name: 'meta',
        attributes: { 'name': 'color-scheme', 'content': 'light' },
        comments: {
          inline: ['Try to Force light theme?']
        }
      })
      metatags.push({
        name: 'meta',
        attributes: { 'name': 'supported-color-schemes', 'content': 'light' },
        comments: {
          inline: ['Try to Force light theme?']
        }
      })
      return metatags
    },
    addTitleTag () {
      let titleTag = {
        name: 'title',
        content: this.emailing.design.options.title,
        comments: {
          before: [],
          inline: ['The title tag shows in email notifications, like Android 4.4'],
          after: []
        }
      }
      return titleTag
    },
    addMsoPPIHack () {
      let hack = {
        name: 'msHack',
        comments: {
          before: ['What it does: Makes background images in 72ppi Outlook render at correct size.'],
          inlne: [],
          after: []
        },
        content: [
          '<!--[if gte mso 9]>',
          '<xml>',
          '\t<o:OfficeDocumentSettings>',
          '\t\t<o:AllowPNG/>',
          '\t\t<o:PixelsPerInch>96</o:PixelsPerInch>',
          '\t</o:OfficeDocumentSettings>',
          '</xml>',
          '<![endif]-->'
        ]
      }
      return hack
    },
    addWebFontHack () {
      let hack = {
        name: 'msHack',
        comments: {
          before: [
            'Web Font / @font-face : BEGIN',
            'NOTE: If web fonts are not required, lines 23 - 41 can be safely removed.',
            'Desktop Outlook chokes on web font references and defaults to Times New Roman, so we force a safe fallback font.'
          ],
          inlne: [],
          after: []
        },
        content: [
          '<!--[if mso]>',
          '\t<style>',
          '\t\t* {',
          '\t\t\tfont-family: sans-serif !important;',
          '\t\t}',
          '\t</style>',
          '<![endif]-->'
        ]
      }
      return hack
    },
    addWebFontLinks () {
      let hack = {
        name: 'msHack',
        comments: {
          before: [
            'All other clients get the webfont reference; some will render the font and others will silently fail to the fallbacks. More on that here: http://stylecampaign.com/blog/2015/02/webfont-support-in-email/',
            'NOTE: If web fonts are not required, lines 23 - 41 can be safely removed.',
            'Desktop Outlook chokes on web font references and defaults to Times New Roman, so we force a safe fallback font.'
          ],
          inlne: [],
          after: ['Web Font / @font-face : END']
        },
        content: [
          '<!--[if !mso]><!-->'
        ]
      }
      if (this.emailing.design.fonts.length) {
        for (let fontLink of this.emailing.design.fonts) hack.content.push(`\t<link href="${fontLink.link}" rel="stylesheet">`)
      }
      hack.content.push('<!--<![endif]-->')
      return hack
    },
    addCssReset () {
      let cssReset = {
        name: 'style',
        comments: {
          before: ['CSS Reset : BEGIN'],
          inline: [],
          after: ['CSS Reset : END']
        },
        content: []
      }
      cssReset.content = cssReset.content.concat([
        '\t/* What it does: Tells the email client that only light styles are provided but the client can transform them to dark. A duplicate of meta color-scheme meta tag above. */',
        '\t:root {',
        '\t\tcolor-scheme: light;',
        '\t\tsupported-color-schemes: light;',
        '\t}'
      ])
      cssReset.content = cssReset.content.concat([
        '\t/* What it does: Remove spaces around the email design added by some email clients. */',
        '\t/* Beware: It can remove the padding / margin and add a background color to the compose a reply window. */',
        '\thtml,',
        '\tbody {',
        '\t\tmargin: 0 auto !important;',
        '\t\tpadding: 0 !important;',
        '\t\theight: 100% !important;',
        '\t\twidth: 100% !important;',
        '\t}'
      ])
      cssReset.content = cssReset.content.concat([
        '\t/* What it does: Stops email clients resizing small text. */',
        '\t* {',
        '\t\t-ms-text-size-adjust: 100%;',
        '\t\t-webkit-text-size-adjust: 100%;',
        '\t}'
      ])
      cssReset.content = cssReset.content.concat([
        '\t/* What it does: Centers email on Android 4.4 */',
        '\tdiv[style*="margin: 16px 0"] {',
        '\t\tmargin: 0 !important;',
        '\t}'
      ])
      cssReset.content = cssReset.content.concat([
        '\t/* What it does: forces Samsung Android mail clients to use the entire viewport */',
        '\t#MessageViewBody, #MessageWebViewDiv {',
        '\t\twidth: 100% !important;',
        '\t}'
      ])
      cssReset.content = cssReset.content.concat([
        '\t/* What it does: Stops Outlook from adding extra spacing to tables. */',
        '\ttable, td {',
        '\t\tmso-table-lspace: 0pt !important;',
        '\t\tmso-table-rspace: 0pt !important;',
        '\t}'
      ])
      cssReset.content = cssReset.content.concat([
        '\t/* What it does: Fixes webkit padding issue. */',
        '\ttable {',
        '\t\tborder-spacing: 0 !important;',
        '\t\tborder-collapse: collapse !important;',
        '\t\ttable-layout: fixed !important;',
        '\t\tmargin: 0 auto !important;',
        '\t}'
      ])
      cssReset.content = cssReset.content.concat([
        '\t/* What it does: Uses a better rendering method when resizing images in IE. */',
        '\timg {',
        '\t\t-ms-interpolation-mode:bicubic;',
        '\t}'
      ])
      cssReset.content = cssReset.content.concat([
        '\t/* What it does: Prevents Windows 10 Mail from underlining links despite inline CSS. Styles for underlined links should be inline. */',
        '\ta {',
        '\t\ttext-decoration: none;',
        '\t}'
      ])
      cssReset.content = cssReset.content.concat([
        '\t/* What it does: A work-around for email clients meddling in triggered links. */',
        '\ta[x-apple-data-detectors],',
        '\t.unstyle-auto-detected-links a,',
        '\t.aBn {',
        '\t\tborder-bottom: 0 !important;',
        '\t\tcursor: default !important;',
        '\t\tcolor: inherit !important;',
        '\t\ttext-decoration: none !important;',
        '\t\tfont-size: inherit !important;',
        '\t\tfont-family: inherit !important;',
        '\t\tfont-weight: inherit !important;',
        '\t\tline-height: inherit !important;',
        '\t}'
      ])
      cssReset.content = cssReset.content.concat([
        '\t/* What it does: Prevents Gmail from displaying a download button on large, non-linked images. */',
        '\t.a6S {',
        '\t\tdisplay: none !important;',
        '\t\topacity: 0.01 !important;',
        '\t}'
      ])
      cssReset.content = cssReset.content.concat([
        '\t/* What it does: Prevents Gmail from changing the text color in conversation threads. */',
        '\t.im {',
        '\t\tcolor: inherit !important;',
        '\t}'
      ])
      cssReset.content = cssReset.content.concat([
        '\t/* If the above doesn\'t work, add a .g-img class to any image in question. */',
        '\timg.g-img + div {',
        '\t\tdisplay: none !important;',
        '\t}'
      ])
      cssReset.content = cssReset.content.concat([
        '\t/* What it does: Removes right gutter in Gmail iOS app: https://github.com/TedGoas/Cerberus/issues/89  */',
        '\t/* Create one of these media queries for each additional viewport size you\'d like to fix */',
        '\t/* iPhone 4, 4S, 5, 5S, 5C, and 5SE */',
        '\t@media only screen and (min-device-width: 320px) and (max-device-width: 374px) {',
        '\t\tu ~ div .email-container {',
        '\t\t\tmin-width: 320px !important;',
        '\t\t}',
        '\t}'
      ])
      cssReset.content = cssReset.content.concat([
        '\t/* iPhone 6, 6S, 7, 8, and X */',
        '\t@media only screen and (min-device-width: 375px) and (max-device-width: 413px) {',
        '\t\tu ~ div .email-container {',
        '\t\t\tmin-width: 375px !important;',
        '\t\t}',
        '\t}'
      ])
      cssReset.content = cssReset.content.concat([
        '\t/* iPhone 6+, 7+, and 8+ */',
        '\t@media only screen and (min-device-width: 414px) {',
        '\t\tu ~ div .email-container {',
        '\t\t\tmin-width: 414px !important;',
        '\t\t}',
        '\t}'
      ])
      return cssReset
    },
    addProgressiveEnhancements () {
      let cssReset = {
        name: 'style',
        comments: {
          before: ['Progressive Enhancements : BEGIN'],
          inline: [],
          after: ['Progressive Enhancements : END']
        },
        content: []
      }
      cssReset.content = cssReset.content.concat([
        '\t/* What it does: Hover styles for buttons */',
        '\t.button-td,',
        '\t.button-a {',
        '\t\ttransition: all 100ms ease-in;',
        '\t}',
        '\t.button-td-primary:hover,',
        '\t.button-a-primary:hover {',
        '\t\tbackground: #555555 !important;',
        '\t\tborder-color: #555555 !important;',
        '\t}'
      ])
      // OPEN MEDIA QUERIES
      cssReset.content = cssReset.content.concat([
        '\t/* Media Queries */',
        '\t@media screen and (max-width: 480px) {'
      ])

      cssReset.content = cssReset.content.concat([
        '\t\t/* What it does: Forces table cells into full-width rows. */',
        '\t\t.stack-column,',
        '\t\t.stack-column-center {',
        '\t\t\tdisplay: block !important;',
        '\t\t\twidth: 100% !important;',
        '\t\t\tmax-width: 100% !important;',
        '\t\t\tdirection: ltr !important;',
        '\t\t}'
      ])
      cssReset.content = cssReset.content.concat([
        '\t\t/* And center justify these ones. */',
        '\t\t.stack-column-center {',
        '\t\t\ttext-align: center !important;',
        '\t\t}'
      ])
      cssReset.content = cssReset.content.concat([
        '\t\t/* What it does: Generic utility class for centering. Useful for images, buttons, and nested tables. */',
        '\t\t.center-on-narrow {',
        '\t\t\ttext-align: center !important;',
        '\t\t\tdisplay: block !important;',
        '\t\t\tmargin-left: auto !important;',
        '\t\t\tmargin-right: auto !important;',
        '\t\t\tfloat: none !important;',
        '\t\t}',
        '\t\ttable.center-on-narrow {',
        '\t\t\tdisplay: inline-block !important;',
        '\t\t}'
      ])
      cssReset.content = cssReset.content.concat([
        '\t\t/* What it does: Adjust typography on small screens to improve readability */',
        '\t\t.email-container p {',
        '\t\t\tfont-size: 17px !important;',
        '\t\t}'
      ])

      // CLOSE MEDIA QUERIES
      cssReset.content = cssReset.content.concat([
        '\t}'
      ])
      return cssReset
    }
  },

  created () {
  }
}
