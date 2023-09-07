const API_URL = `http://localhost:8080`;

// function fetchProductsData() {
//     fetch(`${API_URL}/api/products`)
//         .then((res) => res.json())
//         .then((data) => {
//             handleUsagePage(data);
//         })
//         .catch((error) => {
//             console.error(`Error Fetching Data: ${error}`);
//             document.getElementById('posts').innerHTML = 'Error Loading Products';
//         });
// }

function fetchProductsData() {
    const usage = parseUsage();

    fetch(`${API_URL}/api/products`)
        .then((res) => res.json())
        .then((data) => {
            if (usage !== null) {
                const filteredProducts = data.filter((product) =>
                    product.usageType.toLowerCase() === usage.toLowerCase()
                );
                showUsageList(filteredProducts);
            } else {
                showUsageList(data); // Show all products if no usage parameter is specified
            }
        })
        .catch((error) => {
            console.error(`Error Fetching Data: ${error}`);
            document.getElementById('posts').innerHTML = 'Error Loading Products';
        });
}




function handleUsagePage(data) {
    let usage = parseUsage();
    console.log("Usage:", usage);

    const ul = document.getElementById('posts');
    ul.innerHTML = ''; // Clear any previous content

    if (usage !== null) {

        const filteredUsages = data.filter((product) =>
            product.usage.trim().toLowerCase() === usage.trim().toLowerCase()
        );

        if (filteredUsages.length > 0) {
            showUsageList(filteredUsages);
        } else {
            document.getElementById('posts').innerHTML = 'No products found for this usage type.';
        }
    } else {
        console.log("No usage specified.");
    }
}

function formatData(string) {
    return string
        .replace(/_/g, ' ') // Replace underscores with a whitespace
        .toLowerCase()  // Convert the entire string to lowercase
        .split(' ')     // Split the string into an array of words
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))  // Capitalize the first letter of each word
        .join(' ');     // Join the words back into a string
}

function showUsageList(data) {
    const ul = document.getElementById('posts');
    ul.innerHTML = ''; // Clear any previous content

    let productRow; // Declare a variable to hold the current row

    data.forEach(function(post, index) {
        if (index % 4 === 0) {
            // Create a new row for every fifth product
            productRow = document.createElement('div');
            productRow.classList.add('product-row');
        }

        console.log("Product: ", post);

        let name = document.createElement('h3');
        let image = document.createElement('img');

        image.src = `data:image/png;base64,${post.image}`;
        image.alt = `${post.name} Image`;
        image.classList.add('image-thumbnail');
        name.innerHTML = `<a href="/productdetail.html?productid=${post.id}">${formatData(post.name)}</a>`;

        let productContainer = document.createElement('div');
        productContainer.classList.add('product-container');
        productContainer.appendChild(image);
        productContainer.appendChild(name);
        productRow.appendChild(productContainer);

        if (index % 4 === 0 || index === data.length - 1) {
            ul.appendChild(productRow); // Append the row to the main container
        }
    });
}



function parseUsage() {
    try {
        var url_string = (window.location.href).toLowerCase();
        var url = new URL(url_string);
        var usage = url.searchParams.get("usage");
        return usage;
    } catch (error) {
        console.error("Issues with Parsing URL Parameter's - " + error);
        return null;
    }
}

fetchProductsData();
