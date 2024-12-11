import React, { useEffect, useState } from 'react';
import './Closet.css';
import closetback from './closetback.jpg';

const ClosetCategory = ({ title, id, onSelectItem, searchQuery }) => {
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

    // changes between on and off for visibility of the scrollable container
    const toggleVisibility = () => {
        setIsVisible(!isVisible); 
    };

    const filteredItems = searchQuery
        ? categoryItems.filter(item =>
            item.tags.some(tag => tag.name.toLowerCase().includes(searchQuery.toLowerCase()))
        )
        : categoryItems;

    useEffect(() => {
        console.log("Updated category items:", categoryItems);
    }, [categoryItems]); // Logs whenever the state changes

    return (
        <div className="shelf" onClick={toggleVisibility}>
            {/* title of category inputted later */}
            <h2 className="shelf-title">{title}</h2>
            {isVisible && (
                <div className="scroll-container" id={id}>
                    {filteredItems.map((item, index) => (
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
                                                marging: '2px',
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
                                <input
                                    type="text"
                                    placeholder="add tag"
                                    onClick={(e) => e.stopPropagation()}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            handleTagAddition(item.id, e.target.value);
                                            e.target.value = '';
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const Closet = () => {
    const [selectedItems, setSelectedItems] = useState({}); //tracks currently selected item
    const [searchQuery, setSearchQuery] = useState(''); // tracks search query

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
            <div className="search-bar">
                <form>
                    <input type="text" placeholder="Search by Tag..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="search-bar-text" />
                    <button type="submit">Search</button>
                </form>
            </div>
            <img src={closetback} alt="closet-back" className = "closet-back" />
            <div className="shelves">
                {/* Add categories for each shelf */}
                <ClosetCategory
                    title="Shirts"
                    id="shirts-shelf"
                    onSelectItem={handleSelectItem}
                    searchQuery={searchQuery}
                />
                <ClosetCategory
                    title="Pants"
                    id="pants-shelf"
                    onSelectItem={handleSelectItem}
                    searchQuery={searchQuery}
                />
                <ClosetCategory
                    title="Shoes"
                    id="shoes-shelf"
                    onSelectItem={handleSelectItem}
                    searchQuery={searchQuery}
                />
                <ClosetCategory
                    title="Accessories"
                    id="accessories-shelf"
                    onSelectItem={handleSelectItem}
                    searchQuery={searchQuery}
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
