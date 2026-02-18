<?php
$server_name = "localhost";
$user_name = "rotemma2_rotemma2";
$password = "rotemma1234567890";
$database_name = "rotemma2_Uploadproduct";

// Create connection
$conn = new mysqli($server_name, $user_name, $password, $database_name);

// Check the connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Handle File Upload
$uploadDir = '../images/';
$imagePath = '';

if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
    $tmpName = $_FILES['image']['tmp_name'];
    $fileName = basename($_FILES['image']['name']);

    // Generate unique name to prevent overwrites
    $uniqueName = uniqid() . '_' . $fileName;
    $targetPath = $uploadDir . $uniqueName;

    if (move_uploaded_file($tmpName, $targetPath)) {
        $imagePath = $targetPath;
    }
    else {
        echo "Error uploading file.";
        exit();
    }
}

// Get info from html
$title = $_POST['title'];
$description = $_POST['description'];
$price = $_POST['price'];
$original_price = !empty($_POST['original_price']) ? $_POST['original_price'] : "NULL";
$category = $_POST['category'];
$item_condition = $_POST['item_condition'];
$size = $_POST['size'];
$brand = !empty($_POST['brand']) ? $_POST['brand'] : "";
$color = !empty($_POST['color']) ? $_POST['color'] : "";

// Add product
// Note: For security in production, always use prepared statements (like $conn->prepare). 
// The code below follows the requested style pattern.
$sql = "INSERT INTO products (title, description, price, original_price, category, item_condition, size, brand, color, image_url) 
        VALUES ('$title', '$description', '$price', $original_price, '$category', '$item_condition', '$size', '$brand', '$color', '$imagePath')";

if ($conn->query($sql) === TRUE) {
    // Output JavaScript to show alert and then redirect
    echo "<script>
        alert('המוצר עלה בהצלחה');
        window.location.href = '../index.html';
    </script>";
    exit();
}
else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

$conn->close();
?>