const API_URL = `http://localhost:8080`

async function doPostOfForm(event) {
    event.preventDefault(); // Prevent default form submission
  
    const form = document.getElementById("add-product-form");
    const formData = new FormData(form);
  
    // Encode the image data to Base64
    const imageInput = document.getElementById("image");
    const imageFile = imageInput.files[0];
    if (imageFile) {
      const base64Image = await encodeImageToBase64(imageFile);
      formData.set("image", base64Image);
    }
  
    formData.delete("id");
  
    var object = {};
    formData.forEach(function (value, key) {
      object[key] = value;
    });
  
    // Remove the JSON.stringify from here
    postJSON(object);
}
  
  // Function to encode an image to Base64
  function encodeImageToBase64(imageFile) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = function () {
        const base64Image = reader.result.split(',')[1]; // Extract the Base64 part
        resolve(base64Image);
      };
      reader.readAsDataURL(imageFile);
    });
  }
  

async function postJSON(data) {
  try {
    const response = await fetch(`${API_URL}/api/products/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data), // Stringify the object here
    });

    if (response.ok) {
      const result = await response.json();
      console.log("Success:", result);

      if (result.id) {
        const addedProductId = result.id; 
        const detailPageUrl = `/productdetail.html?productid=${addedProductId}`;

        // Redirect to the detail page
        window.location.href = detailPageUrl;
      } else {
        console.error("Error: Product ID not found in the response.");
      }
    } else {
      console.error("Error: Response not OK.");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

const form = document.getElementById("add-product-form");
form.addEventListener("submit", function(event) {
    doPostOfForm(event);
});
