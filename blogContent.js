const url = document.baseURI
let docTitle = url.split('/')[url.split('/').length - 1];
docTitle = docTitle.replace('.html', '.md')

fetch('/blogPosts/' + docTitle)
    .then(response => response.text())
    .then(text => {
        parseText(text);
    });

function parseText(markdown) {
    const lines = markdown.split('\n');

    let paragraph = '';
    const blogBody = document.getElementsByClassName('blogBody')[0];

    document.getElementsByClassName('blogTitle')[0].innerText = docTitle.replace('.md', '');

    blogBody.innerHTML = ''

    console.log(lines)

    for (const line of lines) {
        let newElement = '';

        if (line.startsWith('Creation Date: ')) {
            document.getElementsByClassName('blogPostDate')[0].innerText = line;
            continue;
        } else if (line.startsWith('Tags: ')) {
            document.getElementsByClassName('blogTags')[0].innerText = line;
            continue;
        }

        if (line.startsWith('###### ')) {
            newElement = 'h6';
        } else if (line.startsWith('##### ')) {
            newElement = 'h5';
        } else if (line.startsWith('#### ')) {
            newElement = 'h4';
        } else if (line.startsWith('### ')) {
            newElement = 'h3';
        } else if (line.startsWith('## ')) {
            newElement = 'h2';
        } else if (line.startsWith('# ')) {
            newElement = 'h1';
        } else if (line == '') {
            newElement = 'br';
        } else {
            newElement = 'p';
        }

        console.log(newElement);

        const element = document.createElement(newElement);
        element.innerText = line.split('# ').pop();
        element.className = 'blogBody';
        blogBody.appendChild(element);
    }
}
