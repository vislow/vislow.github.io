
const fs = require('fs');
const path = require('path');

GenerateBlogContents();

function GenerateBlogContents() {
    const markdownDirectory = path.join(__dirname, 'blog-posts-markdown');

    const markdownFiles = fs.readdirSync(markdownDirectory).filter(file => file.endsWith('.md'));

    const blogPageTemplate = fs.readFileSync(path.join(__dirname, 'blogPageTemplate.html'), 'utf-8');
    const blogPostTemplate = fs.readFileSync(path.join(__dirname, 'blogPostTemplate.html'), 'utf-8');
    let blogPostHTML = ''

    let htmlFiles = [];

    markdownFiles.forEach(fileName => {
        const markdownFile = fs.readFileSync(path.join(markdownDirectory, fileName), 'utf-8');
        const { html, metadata } = parseMarkdownToHtml(markdownFile, fileName);


        fileData = {
            fileName: fileName,
            html: html,
            metadata: metadata
        }

        htmlFiles.push(fileData);
    })

    // sort htmlFiles by metadata date
    // parse date

    htmlFiles = SortArrayByCreationDate(htmlFiles);

    htmlFiles.forEach(file => {
        const linkSlug = file.fileName.toLowerCase().replace('.md', '.html').replace(/\s+/g, '-');
        const outputPath = path.join(__dirname, 'blog-posts-html', linkSlug);

        const dateTime = `<small>(${file.metadata.timeString})</small> ${file.metadata.dateString}`;
        const title = file.metadata.title;
        const tags = `Tags: ${file.metadata.tags}`

        // CREATE BLOG PAGE TO READ FULL BLOG
        let blogPageHTML = blogPageTemplate
            .replace('<!-- BLOG_TITLE -->', title)
            .replace('<!-- BLOG_DATE -->', dateTime)
            .replace('<!-- BLOG_TAGS -->', tags)
            .replace('<!-- BLOG_CONTENT -->', file.html);

        fs.writeFileSync(outputPath, blogPageHTML);
        console.log(`✅ Generated: ${outputPath}`);

        // CREATE BLOG POST ON MAIN PAGE BLOG LIST)
        let blogPreview = file.html.substring(0, 800).replaceAll('<br>', '');

        blogPostHTML += blogPostTemplate
            .replace('<!-- BLOG_TITLE -->', title)
            .replace('<!-- BLOG_PREVIEW -->', blogPreview)
            .replace('<!-- BLOG_DATE -->', dateTime)
            .replace('<!-- BLOG_TAGS -->', tags);

        let indexHTML = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8');

        indexHTML = indexHTML.replace(
            /<div id="blogList">[\s\S]*?<!-- BLOG_POSTS -->/,
            `<div id="blogList">\n${blogPostHTML}\n<!-- BLOG_POSTS -->`
        );

        fs.writeFileSync(path.join(__dirname, 'index.html'), indexHTML);
    });
}

function SortArrayByCreationDate(files) {
    let sort = true;

    while (sort == true) {
        sort = false;

        for (let i = 0; i < files.length - 1; i++) {
            const a = files[i];
            const b = files[i + 1];

            const aIsNewer = getTimestamp(a.metadata) < getTimestamp(b.metadata);

            if (aIsNewer) {
                files[i] = b;
                files[i + 1] = a;

                sort = true;
            }
        }
    }

    return files;
}

function parseMarkdownToHtml(markdown, filename = '') {
    const lines = markdown.split('\n');

    let html = '';
    let title = filename.replace('.md', '');
    let dateString = ''
    let timeString = '';
    let date = {
        year: 0,
        month: 0,
        day: 0
    }
    let time = {
        hour: 0,
        minute: 0
    }
    let tags = '';

    for (const line of lines) {
        let htmlTag = '';

        if (line.startsWith('Creation Date: ')) {
            dateString = line.replace('Creation Date: ', '');


            const parsedDate = dateString.replace('th,', '').replace('nd', '').split(' ');

            date.month = ConvertMonthToInt(parsedDate[0]);
            date.day = parseInt(parsedDate[1]);
            date.year = parseInt(parsedDate[2]);

            continue;
        } else if (line.startsWith('Creation Time: ')) {
            timeString = line.replace('Creation Time: ', '')

            const parsedTime = timeString.split(':');
            time.hour = parseInt(parsedTime[0]);
            time.minute = parseInt(parsedTime[1].split(' ')[0]);

            continue;
        } else if (line.startsWith('Tags: ')) {
            tags = line.replace('Tags: ', '');
            continue;
        }

        if (line.startsWith('###### ')) htmlTag = 'h6';
        else if (line.startsWith('##### ')) htmlTag = 'h5';
        else if (line.startsWith('#### ')) htmlTag = 'h4';
        else if (line.startsWith('### ')) htmlTag = 'h3';
        else if (line.startsWith('## ')) htmlTag = 'h2';
        else if (line.startsWith('# ')) htmlTag = 'h1';
        else if (line === '') {
            html += '<br>';
            continue;
        } else htmlTag = 'p';

        const content = line.replace(/^#+\s*/, '');
        html += `<${htmlTag}>${content}</${htmlTag}>`;
    }

    return {
        html,
        metadata: {
            title,
            dateString,
            timeString,
            date,
            time,
            tags
        }
    };
}

function getTimestamp(metadata) {
    return (
        metadata.date.year * 100000000 +
        metadata.date.month * 1000000 +
        metadata.date.day * 10000 +
        metadata.time.hour * 100 +
        metadata.time.minute
    );
}

function ConvertMonthToInt(month) {
    const months = {
        jan: 1, feb: 2, mar: 3, apr: 4,
        may: 5, jun: 6, jul: 7, aug: 8,
        sep: 9, oct: 10, nov: 11, dec: 12
    };

    return months[month.toLowerCase()] || 0;
}

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