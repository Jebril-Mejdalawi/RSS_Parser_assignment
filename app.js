
//!with rss:

document.addEventListener('DOMContentLoaded', function () {
    const jobTitle = document.querySelector('#job-title');
    const btn = document.querySelectorAll('.btn');
    let index = 0;
    const jobs = [];

   
    function showLoading() {
        jobTitle.innerHTML = 'Job Title (fetching...) <i class="fas fa-spinner fa-spin"></i>';
    }

    function Job(title) {
        this.title = title;
    }

   
    async function fetchJobs() {
        showLoading(); 

        const proxyUrl = 'http://127.0.0.1:8080/';
        const targetUrl = 'https://careers.moveoneinc.com/rss/all-rss.xml';
        const response = await fetch(proxyUrl + targetUrl);

        if (response.ok) {
            const text = await response.text();
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(text, "text/xml");
            const items = xmlDoc.getElementsByTagName("item");

            for (let item of items) {
                const title = item.getElementsByTagName("title")[0].textContent;
                createJob(title);
            }

           
            jobTitle.textContent = jobs[0].title;
        } else {
            console.error("Error fetching RSS feed:", response.status, response.statusText);
        }
    }

    function createJob(title) {
        let job = new Job(title);
        jobs.push(job);
    }

    btn.forEach(function (button) {
        button.addEventListener('click', function (e) {
            e.preventDefault();

            if (e.currentTarget.classList.contains('prev')) {
                if (index === 0) {
                    index = jobs.length;
                }
                index--;
                jobTitle.textContent = jobs[index].title;
            }

            if (e.currentTarget.classList.contains('next')) {
                index++;
                if (index === jobs.length) {
                    index = 0;
                }

                jobTitle.textContent = jobs[index].title;
            }
        });
    });

    
    fetchJobs();
});


//!no rss 
// document.addEventListener('DOMContentLoaded', function () { 
//     const jobTitle = document.querySelector('#job-title');
    

//     const btn = document.querySelectorAll('.btn');
//     let index = 0;
//     const jobs = [];

//     function Job(title) {
//         this.title = title;
       
//     }

//     function createJob(title) {
//         let job = new Job(title);
//         jobs.push(job);
//     }

//     createJob("On Call Destination Consultants- Saudi Arabia")
// createJob("Immigration Coordinator - Riyadh, Saudi Arabia")
// createJob("Pet Transport Coordinator")

    
//     jobTitle.textContent = jobs[index].title;
    

//     btn.forEach(function (button) {
//         button.addEventListener('click', function (e) {
//             e.preventDefault(); 

//             if (e.currentTarget.classList.contains('prev')) { 
//                 if (index === 0) {
//                     index = jobs.length;
//                 }
//                 index--;
//                 jobTitle.textContent = jobs[index].title;
               
//             }

//             if (e.currentTarget.classList.contains('next')) { 
//                 index++;
//                 if (index === jobs.length) {
//                     index = 0;
//                 }

//                 jobTitle.textContent = jobs[index].title;
               
//             }
//         });
//     });
// });
