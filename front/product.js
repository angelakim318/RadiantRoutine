const API_URL = `http://localhost:8080`

function fetchProductsData() {
    fetch(`${API_URL}/api/products`)
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            showProductList(data)
        })
        .catch((error) => {
            console.log(`Error Fetching Data: ${error}`)
            document.getElementById('posts').innerHTML = 'Error Loading Products Data'
        })
}

function fetchProduct(productid) {
    fetch(`${API_URL}/api/products/${productid}`)
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            showProductDetail(data)
        })
        .catch((error) => {
            console.log(`Error Fetching data : ${error}`)
            document.getElementById('post').innerHTML = 'Error Loading Single Product Data'
        })
}

function parseProductId() {
    try {
        var url_string = (window.location.href).toLowerCase();
        var url = new URL(url_string);
        var productid = url.searchParams.get("productid");
        return productid
      } catch (err) {
        console.log("Issues with Parsing URL Parameter's - " + err);
        return "0"
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

function showProductList(data) {
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


function showProductDetail(post) {
    const ul = document.getElementById('post');
    ul.classList.add('detail-container')
    const detail = document.createDocumentFragment();

    console.log("Product:", post);
    let li = document.createElement('div');
    let name = document.createElement('h2');
    let brand = document.createElement('p');
    let type = document.createElement('p');
    let usage = document.createElement('p');
    let image = document.createElement('img');
    name.innerHTML = `${post.name}`;
    brand.innerHTML = `<strong>Brand</strong>: ${formatData(post.brand)}`;
    type.innerHTML = `<strong>Type</strong>: ${formatData(post.productType)}`;
    usage.innerHTML = `<strong>Usage</strong>: ${formatData(post.usageType)}`;

    image.classList.add('resized-image');
    image.src = `data:image/png;base64,${post.image}`;
    image.alt = `${post.name} Image`;

    li.appendChild(name);
    li.appendChild(brand);
    li.appendChild(type);
    li.appendChild(usage);
    li.appendChild(image);
    detail.appendChild(li);
    
    ul.appendChild(detail);
}


function handlePages() {
    let productid = parseProductId()
    console.log("productId: ",productid)

    if (productid != null) {
        console.log("found a productId")
        fetchProduct(productid)
    } else {
        console.log("load all products")
        fetchProductsData()
    }
}

handlePages()