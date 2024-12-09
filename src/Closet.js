import React, { useEffect, useState } from 'react';
import './Closet.css';

const ClosetCategory = ({ title, id, items, HandleToggleSelect, filterTag }) => {
    const [categoryItems, setCategoryItems] = useState([]);
    const [scrollLeftDisabled, setScrollLeftDisabled] = useState(true);
    const [scrollRightDisabled, setScrollRightDisabled] = useState(false);

    useEffect(() => {
        const newItems = Array.from({ length: 20 }, (_, index) => ({
            id: index + 1,
            name: `Item ${index + 1}`,
            selected: false,
        }));
        setCategoryItems(newItems);
    }, []);

    const handleToggleSelect = (itemId) => {
        setCategoryItems((prevItems) => 
        prevItems.map((item) =>
            item.id === itemId ? { ...item, selected: !item.selected } : item
            )
        );
    };

    const filteredCategoryItems = filterTag
        ? categoryItems.filter((item) => item.tags.includes(filterTag))
        : categoryItems;

    const scroll = (direction) => {
        const container = document.getElementById(id);
        const scrollAmount = container.clientWidth / 2;

        container.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth',
        });

        // Update button states
        setScrollLeftDisabled(container.scrollLeft <= 0);
        setScrollRightDisabled(
            container.scrollLeft + container.clientWidth >= container.scrollWidth
        );
    };

    return (
        <div className="category">
            <h2>{title}</h2>
            <div className="scroll-wrapper">
                <button
                    className="scroll-button"
                    onClick={() => scroll('left')}
                    disabled={scrollLeftDisabled}
                >
                    ◀
                </button>
                <div className="scroll-container" id={id}>
                    {filteredCategoryItems.map((item) => (
                        <div
                            key={item.id}
                            className={`item-box ${item.selected ? 'selected' : ''}`}
                            onClick={() => handleToggleSelect(item.id)}
                        >
                            <span>{item.name}</span>
                            <div className ="tag-container">
                                {item.tags.map((tag) => (
                                    <span key={tag} className="tag">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                <button
                    className="scroll-button"
                    onClick={() => scroll('right')}
                    disabled={scrollRightDisabled}
                >
                </button>
            </div>
        </div>
    );
};

const Closet = () => {
    const [wardrobeItems, setWardrobeItems] = useState([]);
    const [filterTag, setFilterTag] = useState('');

    const addTaggedItem = () => {
        const tags = Array.from(document.getElementById('itemTags').selectedOptions).map(
            (option) => option.value
        );

        const newItem = {
            id: wardrobeItems.length + 1,
            name: `Item ${wardrobeItems.length + 1}`,
            tags,
        };

        setWardrobeItems((prev) => [...prev, newItem]);
        alert(`Added item with tags: ${tags.join(', ')}`);
    };

    const filteredWardrobe = filterTag
        ? wardrobeItems.filter((item) => item.tags.includes(filterTag))
        : wardrobeItems;

    return (
        <div className="closet">
            <h1>Closet</h1>
            <div className="controls">
                {/* Added: Controls for tagging and category selection */}
                <label htmlFor="itemTags">Assign Tags:</label>
                <select id="itemTags" multiple>
                    <option value="casual">Casual</option>
                    <option value="formal">Formal</option>
                    <option value="athletic">Athletic</option>
                </select>
                <button onClick={addTaggedItem}>Tag Selected Items</button>
            </div>
            <div className="filter">
                <label htmlFor="filterSelect">Filter by Tag</label>
                <select id="filterSelect" onChange={(e) => setFilterTag(e.target.value)} value={filterTag} multiple>
                    <option value="casual">Casual</option>
                    <option value="formal">Formal</option>
                    <option value="athletic">Athletic</option>
                </select>
                <button onClick={addTaggedItem}>Add Item</button>
            </div>
            <div className="closet-categories">
                <ClosetCategory
                    title="All Items"
                    id="all-items"
                    items={filteredWardrobe}
                    toggleSelect={(id) => console.log('Select:', id)}
                    filterTag={filterTag}
                />
            </div>
        </div>
    );
};

export default Closet;
