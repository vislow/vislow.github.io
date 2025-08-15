document.addEventListener('DOMContentLoaded', () => {
    const blogs = document.getElementsByClassName('blogTitle');
    const blogButtons = document.querySelectorAll('a[href="blog_link"]');

    console.log(`Found ${blogs.length} blog titles and ${blogButtons.length} buttons`);

    for (let i = 0; i < blogButtons.length; i++) {
        const blogTitle = blogs[i]?.textContent?.trim();

        if (blogTitle) {
            // Convert to URL-friendly format (e.g. "My Blog Title" → "my-blog-title")
            const slug = blogTitle.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]/g, '');

            blogButtons[i].setAttribute('href', `/blog-posts-html/${slug}.html`);

            console.log(`Button ${i} href set to: /blog-posts-html/${slug}.html`);
        } else {
            console.warn(`No matching title found for button ${i}`);
        }
    }
});


// let allPosts = [];

// function renderPosts(posts) {
//     const list = document.getElementById('blogList');
//     list.innerHTML = '';

//     posts.forEach(post => {
//         const li = document.createElement('li');
//         const link = document.createElement('a');
//         link.href = `blogPosts/${post.filename}`;
//         link.textContent = post.title;
//         li.appendChild(link);

//         if (post.tags.length > 0) {
//             const tagSpan = document.createElement('span');
//             tagSpan.textContent = ' [' + post.tags.join(', ') + ']';
//             tagSpan.style.marginLeft = '8px';
//             li.appendChild(tagSpan);
//         }

//         list.appendChild(li)
//     })
// }

// fetch('blogPosts.json')
// .then(res => res.json())
// .then(posts => {
//     allPosts = posts;
//     renderPosts(allPosts);
//     populateTagFilter(allPosts);
// });