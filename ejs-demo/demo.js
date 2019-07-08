var ejs = require('ejs')

var people = ['geddy','孙东','罗得知']

var html = `
    <h1>
        <%= people.join(',')  %>
    </h1>
`

console.log(
    ejs.render(html , { people : people })
)