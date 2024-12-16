import { jsPDF } from 'jspdf'; // Import jsPDF for PDF generation
import React, { useEffect, useState } from 'react';
import './Closet.css';
import closetback from './closetback.jpg';

// ClosetCategory Component for each item category
const ClosetCategory = ({ title, id, onSelectItem, searchQuery }) => {
    const [categoryItems, setCategoryItems] = useState([]);
    const [isScrollViewOpen, setIsScrollViewOpen] = useState(false); // Local state for category items

    // Initializes category items with placeholders on component mount
    useEffect(() => {
        const newItems = Array.from({ length: 20 }, (_, index) => ({
            id: index + 1, // Unique identifier for each item
            name: `Item ${index + 1}`, // Name of each item
            image: null,
            selected: false, // Tracks if item is selected
            tags: [], // Creates a tag for each item
            available: true,
        }));
        setCategoryItems(newItems); // Sets the category items to the new items
    }, []);

    const toggleScrollView = () => {
        setIsScrollViewOpen(!isScrollViewOpen);
    }

    const handleDeleteItem = (itemId) => {
        // Correctly filter out only the item with the matching id
        setCategoryItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
    };

    const handleUpload = async (itemId, event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setCategoryItems((prevItems) => {
                    const updatedItems = prevItems.map((item) =>
                        item.id === itemId
                            ? { ...item, image: reader.result } // Set the image directly
                            : item
                    );
                    return updatedItems;
                });
            };
            reader.readAsDataURL(file); // Convert file to base64 URL
        }
        event.target.value = ''; // Reset file input
    };

    const handleNameChange = (itemId, newName) => {
        setCategoryItems((prevItems) =>
            prevItems.map((item) =>
                item.id === itemId ? { ...item, name: newName } : item
            )
        );
    };

    // Handles when items are clicked
    const handleItemClick = (item) => {
        if (item.available) { // Only allow selection if the item is available
            onSelectItem(item); // Passing the selected item to the parent component
        } // Passing the selected item to the parent component
    };

    const handleTagAddition = (itemId, tagName) => {
        if (!tagName.trim()) return;

        const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
        setCategoryItems((prevItems) =>
            prevItems.map((item) =>
                item.id === itemId
                    ? { ...item, tags: [...item.tags, { name: tagName, color: randomColor }] }
                    : item
            )
        );
    };
    const handleMakeUnavailable = (itemId) => {
        setCategoryItems((prevItems) =>
            prevItems.map((item) =>
                item.id === itemId ? { ...item, available: !item.available } : item
            )
        );
    };
    const filteredItems = searchQuery
        ? categoryItems.filter((item) =>
            item.tags.some((tag) => tag.name.toLowerCase().includes(searchQuery.toLowerCase()))
        )
        : categoryItems;

    useEffect(() => {
        console.log("Updated category items:", categoryItems);
    }, [categoryItems]); // Logs whenever the state changes

    useEffect(() => {
        const handleClickOutside = (event) => {
            const scrollView = document.getElementById(id);
            if (scrollView && !scrollView.contains(event.target)) {
                setIsScrollViewOpen(false); // Close the scroll view
            }
        };

        if (isScrollViewOpen) {
            document.addEventListener("mousedown", handleClickOutside); // Use 'mousedown' for better UX
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isScrollViewOpen, id]);

    return (
        <div className="shelf">
            {/* Title of category inputted later */}
            <button className="toggle-button" onClick={toggleScrollView}>
                {isScrollViewOpen ? 'Close' : 'Open'} {title}
            </button>
            {isScrollViewOpen && (
                <div className="scroll-container" id={id}>
                    {filteredItems.map((item) => (
                        <div key={item.id} className="item-box">
                            <div onClick={() => handleItemClick(item)}>
                                {item.image ? (
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        style={{width: "150px", height: "150px"}}
                                    />
                                ) : (
                                    <span>{item.name}</span>
                                )}
                            </div>
                            {item.name && (
                                <button
                                    className="delete-button"
                                    onClick={(e) => {
                                        e.stopPropagation(); // Prevent parent click events
                                        handleDeleteItem(item.id);
                                    }}
                                >
                                    🗑️
                                </button>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleUpload(item.id, e)}
                                className="image-input"
                            />
                            <div className="tags-container">
                                {item.tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        style={{
                                            backgroundColor: tag.color,
                                            color: '#fff',
                                            padding: '2px 8px',
                                            margin: '2px',
                                            borderRadius: '4px',
                                            display: 'inline-block',
                                        }}
                                    >
                                        {tag.name}
                                    </span>
                                ))}
                            </div>
                            <div className="text-input-container">
                                <input
                                    type="text"
                                    placeholder="Enter item name"
                                    className="name-input"
                                    onClick={(e) => e.stopPropagation()} // Prevents event from bubbling to parent
                                    onChange={(e) => handleNameChange(item.id, e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.target.blur(); // Remove focus after pressing Enter
                                        }
                                    }}
                                />
                                <input
                                    type="text"
                                    placeholder="Add tag"
                                    onClick={(e) => e.stopPropagation()}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            handleTagAddition(item.id, e.target.value);
                                            e.target.value = '';
                                        }
                                    }}
                                />
                            </div>
                            <button
                                className="make-unavailable-button"
                                onClick={() => handleMakeUnavailable(item.id)} // This will still toggle availability
                                style={{
                                    backgroundColor: item.available ? '#4CAF50' : '#f44336', // Green for available, red for unavailable
                                    color: '#fff',
                                }}
                            >
                                {item.available ? 'Available' : 'Unvailable'}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const Closet = () => {
    const [selectedItems, setSelectedItems] = useState({}); // Tracks currently selected item
    const [searchQuery, setSearchQuery] = useState(''); // Tracks search query

    // Function to handle item selection
    const handleSelectItem = (item, categoryId) => {
        setSelectedItems((prevSelected) => ({
            ...prevSelected,
            [categoryId]: item,
        }));
    };

    const exportToPDF = async () => {
        const doc = new jsPDF();
        let yPosition = 20; // Start position on the page

        const imagesToLoad = Object.entries(selectedItems)
            .map(([category, item]) => item.image ? {...item, category} : null)
            .filter(item => item !== null); // Only consider items with images

        const imagePromises = imagesToLoad.map(item => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.src = item.image;

                img.onload = () => {
                    resolve({ img, item }); // Resolve when the image is loaded
                };

                img.onerror = () => reject(`Error loading image for ${item.category}: ${item.name}`);
            });
        });

        // Add title to the PDF
        doc.setFontSize(20);
        doc.text("Selected Closet Items", 20, yPosition);
        yPosition += 10;

        try {
            // Wait for all images to load
            const loadedImages = await Promise.all(imagePromises);

            // Iterate over the loaded images and add them to the PDF
            loadedImages.forEach(({ img, item }) => {
                // Check if we need to add a new page before adding content
                if (yPosition + 70 > doc.internal.pageSize.height) {
                    doc.addPage();
                    yPosition = 20; // Reset y-position for the new page
                }

                // Add category name
                doc.setFontSize(16);
                doc.text(`${item.category}:`, 20, yPosition); // Category name
                yPosition += 10;

                // Add item name
                doc.setFontSize(12);
                doc.text(`Item Name: ${item.name}`, 20, yPosition); // Item name
                yPosition += 10;

                // Add the item image to the PDF
                doc.addImage(img, "JPEG", 20, yPosition, 50, 50); // Adjust size as needed
                yPosition += 60; // Move y-position down after the image

                // Check if we're near the bottom of the page and add a new page if needed
                if (yPosition > doc.internal.pageSize.height - 20) {
                    doc.addPage();
                    yPosition = 20; // Reset y-position for the new page
                }
            });

            // Save the PDF
            doc.save("closet_items.pdf");
        } catch (error) {
            console.error("Error loading images: ", error);
        }
    };


    return (
        <div className="closet">
            <h1>Outfit Picker</h1>
            <div className="search-bar">
                <form>
                    <input
                        type="text"
                        placeholder="Search by Tag..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-bar-text"
                    />
                    <button type="submit">Search</button>
                </form>
            </div>
            <img src={closetback} alt="closet-back" className="closet-back" />
            <div className="categories">
                <ClosetCategory
                    title="Shirts"
                    id="shirts-shelf"
                    onSelectItem={(item) => handleSelectItem(item, 'shirts')}
                    searchQuery={searchQuery}
                />
                <ClosetCategory
                    title="Pants"
                    id="pants-shelf"
                    onSelectItem={(item) => handleSelectItem(item, 'pants')}
                    searchQuery={searchQuery}
                />
                <ClosetCategory
                    title="Shoes"
                    id="shoes-shelf"
                    onSelectItem={(item) => handleSelectItem(item, 'shoes')}
                    searchQuery={searchQuery}
                />
                <ClosetCategory
                    title="Accessories"
                    id="accessories-shelf"
                    onSelectItem={(item) => handleSelectItem(item, 'accessories')}
                    searchQuery={searchQuery}
                />
            </div>
            <button onClick={exportToPDF} className="export-button">Export to PDF</button>
            <div className="selected-items">
                {Object.entries(selectedItems).map(([category, item]) => (
                    <div key={category} className="selected-item">
                        {item.image && (
                            <img
                                src={item.image}
                                alt={item.name}
                            />
                        )}
                        <p>{item.name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Closet;
