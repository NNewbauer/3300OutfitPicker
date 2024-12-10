import React, { useEffect, useState } from 'react';
import './Closet.css';
import closetback from './closetback.jpg';

const ClosetCategory = ({ title, id, onSelectItem }) => {
    const [categoryItems, setCategoryItems] = useState([]); // local state for category items
    const [isVisible, setIsVisible] = useState(false); // visibility toggle on item containers

    // initializes category items with placeholders on component mount
    useEffect(() => {
        const newItems = Array.from({ length: 20 }, (_, index) => ({ // creates 20 items
            id: index + 1, // unique identifier for each item
            name: `Item ${index + 1}`, // name of each item
            image: null,
            selected: false, // tracks if item is selected
            tags: [], // cretes a tag for each item
        }));
        setCategoryItems(newItems); // sets the category items to the new items
    }, []);

    const handleUpload = async (itemId, event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                console.log("Image loaded:", reader.result)
                setCategoryItems((prevItems) => {
                    const updatedItems = prevItems.map((item) =>
                        item.id === itemId
                            ? { ...item, image: reader.result } // Set the image directly from the FileReader
                            : item
                    );
                    console.log("updated category items:", updatedItems);
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

    // handles when items are clicked
    const handleItemClick = (item) => {
        onSelectItem(item); // passing the selected item to the parent component
    };

    // changes between on and off for visibility of the scrollable container
    const toggleVisibility = () => {
        setIsVisible(!isVisible); 
    };

    useEffect(() => {
        console.log("Updated category items:", categoryItems);
    }, [categoryItems]); // Logs whenever the state changes

    return (
        <div className="shelf" onClick={toggleVisibility}>
            {/* title of category inputted later */}
            <h2 className="shelf-title">{title}</h2>
            {isVisible && (
                <div className="scroll-container" id={id}>
                    {categoryItems.map((item, index) => (
                        <div key={item.id} className="item-box">
                            <div onClick={() => handleItemClick(item)}>
                                {item.image ? (
                                    <img 
                                        src={item.image}
                                        alt={item.name}
                                        style={{width: "150px", height: "150px"}}
                                        />
                                ) : (
                                    <span>No image for {item.name}</span>
                                )}
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleUpload(item.id, e)}
                                className="image-input"
                            />
                            <input
                                type="text"
                                placeholder="enter item name"
                                className="name-input"
                                onClick={(e) => e.stopPropagation()} // Prevents event from bubbling to parent
                                onChange={(e) => handleNameChange(item.id, e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.target.blur(); // Remove focus after pressing Enter
                                    }
                                }}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const Closet = () => {
    const [selectedItems, setSelectedItems] = useState({}); //tracks currently selected item

    // updates the selected item displayed in the closet
    const handleSelectItem = (item, categoryId) => {
        setSelectedItems((prevSelected) => ({
            ...prevSelected,
            [categoryId]: item,
        }));
    };

    return (
        <div className="closet" style={{ backgroundImage: `('public/closetback.jpg')` }}>
            {/* Closet title */}
            <h1>My Closet</h1>
            {/* Closet background image */}
            <img src={closetback} alt="closet-back" className = "closet-back" />
            {/* Shelves section - display closet categories*/}
            <div className="shelves">
                {/* Add categories for each shelf */}
                <ClosetCategory
                    title="Shirts"
                    id="shirts-shelf"
                    onSelectItem={handleSelectItem}
                />
                <ClosetCategory
                    title="Pants"
                    id="pants-shelf"
                    onSelectItem={handleSelectItem}
                />
                <ClosetCategory
                    title="Shoes"
                    id="shoes-shelf"
                    onSelectItem={handleSelectItem}
                />
                <ClosetCategory
                    title="Accessories"
                    id="accessories-shelf"
                    onSelectItem={handleSelectItem}
                />
            </div>
            <div className="selected-items">
                <h2>Selected Items</h2>
                {Object.entries(selectedItems).map(([category, item]) =>(
                    <p key={category}>
                        {category}: {item.name}
                    </p>
                ))}
            </div>
        </div>
    );
};

export default Closet;
