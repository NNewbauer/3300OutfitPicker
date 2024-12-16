import React from 'react';
import './PreviouslySelectedItems.css';

const PreviouslySelectedItems = ({ selectedItems, onReSelectItem }) => {
    const categories = ['shirts', 'pants', 'shoes', 'accessories'];

    return (
        <div className="previously-selected">
            <h2>Previously Selected Items</h2>
            <div className="previously-selected-container">
                {categories.map((category) => (
                    <div key={category} className="category-section">
                        <h3>{category.charAt(0).toUpperCase() + category.slice(1)}</h3>
                        {selectedItems[category] ? (
                            <div
                                className="previous-item"
                                onClick={() => onReSelectItem(category, selectedItems[category])}
                            >
                                {selectedItems[category].image ? (
                                    <img
                                        src={selectedItems[category].image}
                                        alt={selectedItems[category].name}
                                        className="item-image"
                                    />
                                ) : (
                                    <p>{selectedItems[category].name}</p>
                                )}
                            </div>
                        ) : (
                            <p>No item selected</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PreviouslySelectedItems;