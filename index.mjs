import { Marp } from '@marp-team/marp-core'
import Express from 'express'
import multer from 'multer'

/**
 * @type {Express.Application}
 */
const app = new Express()

const { PORT = 8081, APP_NAME = '#Marper' } = process.env
const _multer = multer()

app.post('*', _multer.none(), (req, res) => {
  const { markdown } = req.body ?? {}

  if (!markdown) {
    return res.redirect('/')
  }

  const marp = new Marp()
  const { html, css } = marp.render(markdown)

  if (req.query.raw) {
    return res.send({
      html,
      css
    })
  }

  res.send(`
    <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${APP_NAME}</title>
        <style>
          body {
            margin: 0;
          }

          ${css}
        </style>
      </head>
      <body>
        ${html}
      </body>
      </html>`)
})

app.all('*', (_req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>#Marper</title>
    </head>
    <body>
      <form enctype="multipart/form-data" method="post" style="display: flex; flex-direction: column;">
        <textarea name="markdown" id="markdown" cols="30" rows="10">&gt; Write markdown here...!</textarea>
        <button type="submit">Render...!</button>
      </form>
    </body>
    </html>
  `)
})

app.listen(PORT, () => {
  console.info(`${APP_NAME} started at http://localhost:${PORT}`)
})

