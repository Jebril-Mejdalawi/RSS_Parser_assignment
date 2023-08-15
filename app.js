//! with maps

document.addEventListener('DOMContentLoaded', function () {
    const jobTitle = document.querySelector('#job-title');
    const btn = document.querySelectorAll('.btn');
    const mapBtn = document.querySelector('.map');
    let index = 0;
    const jobs = [];
    let map;

    function showLoading() {
        jobTitle.innerHTML = 'Job Title (fetching...) <i class="fas fa-spinner fa-spin"></i>';
    }

    function Job(title, country) {
        this.title = title;
        this.country = country;
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
                const country = item.getElementsByTagName("country")[0].textContent;
                createJob(title, country);
            }

            jobTitle.textContent = jobs[0].title;
        } else {
            console.error("Error fetching RSS feed:", response.status, response.statusText);
        }
    }

    function createJob(title, country) {
        let job = new Job(title, country);
        jobs.push(job);
    }

    function initMap(country) {
        const geocoder = new google.maps.Geocoder();
        map = new google.maps.Map(document.getElementById('map'));

        geocoder.geocode({ 'address': country }, function (results, status) {
            if (status == 'OK') {
                map.setCenter(results[0].geometry.location);
                new google.maps.Marker({
                    map: map,
                    position: results[0].geometry.location
                });
            } else {
                console.error('Geocode was not successful for the following reason: ' + status);
            }
        });
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

    mapBtn.addEventListener('click', function (e) {
        e.preventDefault();
        initMap(jobs[index].country);
    });

    fetchJobs();
});


