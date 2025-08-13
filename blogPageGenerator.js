// const fs = require('fs');
// const path = require('path');

// const postDir = path.join(__dirname, 'blogPosts');

// const files = fs.readdirSync(postDir).filter(file => file.endsWith('.md'))
// const blogTemplateHtml = fs.readFileSync(path.join(__dirname, "blogTemplate.html"))

// files.forEach(file => {
//     const outputFile = path.join(__dirname, `blogs/${file.replace('.md', '')}.html`);

//     fs.writeFileSync(outputFile, blogTemplateHtml)
// });


const fs = require('fs');
const path = require('path');

const postDir = path.join(__dirname, 'blogPosts');
const outputDir = path.join(__dirname, 'blogs');
const pageTemplate = fs.readFileSync(path.join(__dirname, 'blogTemplate.html'), 'utf-8');

// Reuse your custom parser
function parseMarkdownToHtml(markdown, filename = '') {
    const lines = markdown.split('\n');
    let html = '';
    let title = filename.replace('.md', '');
    let date = '';
    let tags = '';

    for (const line of lines) {
        let tag = '';

        if (line.startsWith('Creation Date: ')) {
            date = line.replace('Creation Date: ', '');
            continue;
        } else if (line.startsWith('Tags: ')) {
            tags = line.replace('Tags: ', '');
            continue;
        }

        if (line.startsWith('###### ')) tag = 'h6';
        else if (line.startsWith('##### ')) tag = 'h5';
        else if (line.startsWith('#### ')) tag = 'h4';
        else if (line.startsWith('### ')) tag = 'h3';
        else if (line.startsWith('## ')) tag = 'h2';
        else if (line.startsWith('# ')) tag = 'h1';
        else if (line === '') {
            html += '<br>';
            continue;
        } else tag = 'p';

        const content = line.replace(/^#+\s*/, '');
        html += `<${tag}>${content}</${tag}>`;
    }

    return {
        html,
        metadata: {
            title,
            date,
            tags
        }
    };
}

// Read all .md files
const files = fs.readdirSync(postDir).filter(file => file.endsWith('.md'));

let mainPage = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8');
const postTemplate = fs.readFileSync(path.join(__dirname, 'blogPost.html'), 'utf-8');
let postHtml = ''

files.forEach(file => {
    const markdown = fs.readFileSync(path.join(postDir, file), 'utf-8');
    const { html, metadata } = parseMarkdownToHtml(markdown, file);

    // Replace placeholders in your template
    let finalHtml = pageTemplate
        .replace('<!-- BLOG_TITLE -->', metadata.title)
        .replace('<!-- BLOG_DATE -->', metadata.date)
        .replace('<!-- BLOG_TAGS -->', 'Tags: ' + metadata.tags)
        .replace('<!-- BLOG_CONTENT -->', html);

    const slug = file.toLowerCase().replace('.md', '.html').replace(/\s+/g, '-');
    const outputPath = path.join(outputDir, slug);
    fs.writeFileSync(outputPath, finalHtml);
    console.log(`✅ Generated: ${outputPath}`);

    // Add to post list
    postHtml += postTemplate
        .replace('<!-- BLOG_TITLE -->', metadata.title)
        .replace('<!-- BLOG_PREVIEW -->', html.substring(0, 200).replaceAll('<br>', ''))
        .replace('<!-- BLOG_DATE -->', metadata.date)
        .replace('<!-- BLOG_TAGS -->', 'Tags: ' + metadata.tags);
});

mainPage = mainPage.replace(
    /<div id="blogList">[\s\S]*?<!-- BLOG_POSTS -->/,
    `<div id="blogList">\n${postHtml}\n<!-- BLOG_POSTS -->`
);

fs.writeFileSync(path.join(__dirname, 'index.html'), mainPage);

// // Generate.json
// const outputFile = path.join(__dirname, 'blogPosts.json')

// const posts = files.map(file => {
//     const content = fs.readFileSync(path.join(postDir, file), 'utf8');
//     const lines = content.split('\n');
//     const title = lines[0].replace(/^#\s*/, '') || file;

//     let tags = []
//     for (const line of lines) {
//         if (line.toLowerCase().startsWith('tags:')) {
//             tags = line.split(':')[1].split(',').map(tag => tag.trim().toLowerCase());
//             break;
//         }
//     }

//     return {
//         filename: file,
//         title: title,
//         tags: tags
//     };
// });

// fs.writeFileSync(outputFile, JSON.stringify(posts, null, 2));

// console.log(`Generated ${outputFile}`)